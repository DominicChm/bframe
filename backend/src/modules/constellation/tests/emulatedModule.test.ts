import {Constellation} from "../Constellation";
import {testParticleTypeDefinition, testParticleSystemDefinition} from "./defTestParticle";
import {TestConnector} from "./testUtil";
import {
    EServerOp, HandshakeResponse,
    HandshakeResponseCT,
    OpCT,
    ParticleHandshakeCT,
    ServerErrorCT, TimestampHeaderCT
} from "../../protocol";
import {VarIdCT} from "../../protocol/ctypes/VarIdCT";
import {uint16} from "c-type-util";
import pEvent from "p-event";


async function doHandshake(connector: TestConnector, typeName: string, uid: string): Promise<Buffer> {
    const response = pEvent<"response", Buffer>(connector, "response");

    connector.pushData(ParticleHandshakeCT.allocLE({
        op: 0x00,
        typeName,
        uid
    }));

    return response;
}

function sendTestStateUpdate(connector: TestConnector, rid: number): void {
    const stateUpdatePayload = Buffer.concat([
        TimestampHeaderCT.allocLE({op: 0x10, timestamp: 0, rid}),
        VarIdCT.allocLE(0x00),
        uint16.allocLE(0xFF),
    ]);
    connector.pushData(stateUpdatePayload);
}

// Creates a ParticleManager and connects a single WS to it.
async function setup() {
    const connector = new TestConnector();

    //Setup a test Constellation instance.
    const constellation = new Constellation({}, [connector]);

    constellation.registerParticleType(testParticleTypeDefinition);
    await constellation.load({
        particles: [
            testParticleSystemDefinition
        ]
    })

    return {
        connector,
        constellation,
        uid: testParticleSystemDefinition.uid,
        typeName: testParticleSystemDefinition.typeName
    };

}

it("responds to handshake", async () => {
    const {connector, constellation, uid, typeName} = await setup();


    const handshake = await doHandshake(connector, typeName, uid);

    //Don't check response content - RID might be random in future.
    expect(handshake.length).toBe(HandshakeResponseCT.size);
    expect(OpCT.readLE(handshake)).toBe(EServerOp.HANDSHAKE_RESPONSE);
});

it("responds with error on invalid typename", async () => {
    const {connector, constellation, uid, typeName} = await setup();

    const res = await doHandshake(connector, "ERROR", uid);
    //Don't check response content - RID might be random in future.
    expect(res.length).toBe(ServerErrorCT.size);
    expect(OpCT.readLE(res)).toBe(EServerOp.ERROR);
});

it("sends an initial state update", async () => {
    const {connector, constellation, uid, typeName} = await setup();
    const responses = pEvent.multiple(connector, "response", {count: 2});
    connector.pushData(ParticleHandshakeCT.allocLE({
        op: 0x00,
        typeName,
        uid
    }));

    const [handshake, stateUpdate] = await responses;
    const expected = Buffer.from([
        EServerOp.STATE_UPDATE, //State update opcode
        3, //Variable ID (only one - server-sided uint16)
        0xff, 0x01 //Value set in definition (511)
    ]);

    expect(stateUpdate).toEqual(expected)
});

it("returns a particle based on uid", async () => {
    const {connector, constellation, uid, typeName} = await setup();

    const p = constellation.particle(uid);
    expect(p).not.toBeUndefined();
});

it("Particle fires a state event", async () => {
    const {connector, constellation, uid, typeName} = await setup();
    const particle = constellation.particle(uid);
    const pPatch = pEvent(particle, "patch", {multiArgs: true});

    const {rid} = HandshakeResponseCT.readLE(await doHandshake(connector, typeName, uid));

    sendTestStateUpdate(connector, rid);

    const patch = await pPatch;
    expect(patch).toEqual([{uint16_val: 0xFF}, particle])
});

it("Particle fires a patch event", async () => {
    const {connector, constellation, uid, typeName} = await setup();
    const particle = constellation.particle(uid);
    const pState = pEvent(particle, "state", {multiArgs: true});

    const {rid} = HandshakeResponseCT.readLE(await doHandshake(connector, typeName, uid));

    sendTestStateUpdate(connector, rid);

    const state = await pState;
    expect(state).toEqual([{
        uint16_val: 0xFF,
        double_val: 0,
        string_val: "str",
        uint16_server_val: 511
    }, particle])
});

it("Particle fires a change event", async () => {
    const {connector, constellation, uid, typeName} = await setup();
    const particle = constellation.particle(uid);
    const pChange = pEvent(particle, "change", {multiArgs: true});

    const {rid} = HandshakeResponseCT.readLE(await doHandshake(connector, typeName, uid));

    sendTestStateUpdate(connector, rid);

    const change = await pChange;
    expect(change).toEqual([
        {
            uint16_val: 0xFF,
            double_val: 0,
            string_val: "str",
            uint16_server_val: 511
        },
        {
            uint16_val: 0xFF
        },
        {
            uint16_val: 0,
            double_val: 0,
            string_val: "str",
            uint16_server_val: 511
        },
        particle]);
});
