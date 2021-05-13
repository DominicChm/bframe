import {ParticleSystem} from "../ParticleSystem";
import WebSocket from "ws";
import * as util from "util";
import {Buffer} from "buffer";
import {handshake_ctype, opcode_ctype, var_id_ctype} from "../../protocol";
import {defTestParticle} from "./test-particle-def";

// Creates a ParticleManager and connects a single WS to it.
async function setup() {
    const testUid = "1234";

    //Setup a test particleSystem instance.
    const pm = new ParticleSystem({port: 0}); //port=0 automatically assigns a port from OS.
    pm.registerDefinition(defTestParticle);
    pm.loadSystem({
        particles: [
            {
                initialServerState: {
                    uint16_server_val: 0,
                },
                uid: testUid,
                typeName: "test-particle"
            }
        ]
    })

    //Setup a test Particle.
    const ws = new WebSocket(`ws://localhost:${pm.port}`);

    await util.promisify((cb) => ws.once("open", cb))(); //Wait for ws to open.

    //Promisified websocket send and receive functions
    const rxMsg = () => new Promise(res => ws.once("message", res));
    const txMsg = util.promisify((data, cb) => ws.send(data, cb));

    return {rx: rxMsg, tx: txMsg, ws, pm, finish: pm.stop.bind(pm), uid: testUid};
}

it("responds to handshake", async () => {
    const {rx, pm, finish, tx, ws, uid} = await setup();

    const handshakeBuf = Buffer.alloc(97);
    handshake_ctype.writeLE({
        op: 0x00,
        typeName: "test-particle",
        uid
    }, handshakeBuf);

    await tx(handshakeBuf);
    const resp: Buffer = (await rx()) as Buffer;

    expect(resp instanceof Buffer).toBeTruthy();
    if (resp[0] === 0xFF) { //Error code - parse and display err.
        fail(resp.toString("ascii", 1))
    }
    expect(resp[0]).toBe(0x00);

    finish();
});

it("responds with error on invalid typename", async () => {
    //Note: This test will probably result in an error in the console. This is expected.
    const {rx, pm, finish, tx, ws, uid} = await setup();

    const handshakeBuf = Buffer.alloc(97);
    handshake_ctype.writeLE({
        op: 0x00,
        typeName: "ERROR ERROR",
        uid
    }, handshakeBuf);

    await tx(handshakeBuf);
    const resp: Buffer = (await rx()) as Buffer;

    expect(resp instanceof Buffer).toBeTruthy();
    expect(resp[0]).toBe(0xFF);

    finish();
});

it("sends an initial state update", async () => {
    const {rx, pm, finish, tx, ws, uid} = await setup();

    const handshakeBuf = Buffer.alloc(97);
    handshake_ctype.writeLE({
        op: 0x00,
        typeName: "test-particle",
        uid
    }, handshakeBuf);

    await tx(handshakeBuf);
    await rx(); //Toss first (handshake) response. Not needed for testing
    const resp: Buffer = (await rx()) as Buffer; //Expect initial state.

    expect(Buffer.length).toBe(
        opcode_ctype.size
        + var_id_ctype.size
        + 2
    )

    finish();
})
