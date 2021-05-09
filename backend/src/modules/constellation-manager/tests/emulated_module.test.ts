import {ParticleSystem} from "../ParticleSystem";
import WebSocket from "ws";
import * as util from "util";
import {Buffer} from "buffer";
import {handshake_ctype} from "../../protocol";
import {v4 as uuid} from "uuid"
import {defSimplePot} from "../../particle-defs";

// Creates a ParticleManager and connects a single WS to it.
async function setup() {
    const pm = new ParticleSystem({port: 0}); //port=0 automatically assigns a port from OS.
    pm.registerDefinition(defSimplePot);
    const ws = new WebSocket(`ws://localhost:${pm.port}`);

    await util.promisify((cb) => ws.once("open", cb))(); //Wait for ws to open.

    //Promisified websocket send and receive functions
    const rxMsg = () => new Promise(res => ws.once("message", res));
    const txMsg = util.promisify((data, cb) => ws.send(data, cb));

    return {rx: rxMsg, tx: txMsg, ws, pm, finish: pm.stop.bind(pm)};
}

it("responds to handshake", async () => {
    const {rx, pm, finish, tx, ws} = await setup();

    const handshakeBuf = Buffer.alloc(97);
    handshake_ctype.writeLE({
        op: 0x00,
        typeName: "simple-potentiometer",
        uid: uuid()
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
    const {rx, pm, finish, tx, ws} = await setup();

    const handshakeBuf = Buffer.alloc(97);
    handshake_ctype.writeLE({
        op: 0x00,
        typeName: "ERROR ERROR",
        uid: uuid()
    }, handshakeBuf);

    await tx(handshakeBuf);
    const resp: Buffer = (await rx()) as Buffer;

    expect(resp instanceof Buffer).toBeTruthy();
    expect(resp[0]).toBe(0xFF);

    finish();
});
