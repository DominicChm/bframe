import {Constellation} from "../Constellation";
import {testParticleTypeDefinition, testParticleSystemDefinition, ITestParticleState} from "./defTestParticle";
import {TestConnector} from "./testUtil";
import {
    EClientOp,
    EServerOp,
    HandshakeResponseCT,
    OpCT,
    ParticleErrorCT,
    ParticleHandshakeCT,
    RidCT,
    ServerErrorCT, TimestampCT, TimestampHeaderCT
} from "../../protocol";
import {VarIdCT} from "../../protocol/ctypes/VarIdCT";
import {uint16} from "c-type-util";
import * as util from "util";
import {DeferredPromise} from "../../util";

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

    connector.pushData(ParticleHandshakeCT.allocLE({
        op: 0x00,
        typeName,
        uid
    }));

    const res = await connector.response;

    //Don't check response content - RID might be random in future.
    expect(res.length).toBe(OpCT.size + RidCT.size);
    expect(OpCT.readLE(res)).toBe(EServerOp.HANDSHAKE_RESPONSE);
});

it("responds with error on invalid typename", async () => {
    const {connector, constellation, uid, typeName} = await setup();
    connector.pushData(ParticleHandshakeCT.allocLE({
        op: 0x00,
        typeName: "ERROR_ERROR",
        uid
    }));

    const res = await connector.response;

    //Don't check response content - RID might be random in future.
    expect(res.length).toBe(ServerErrorCT.size);
    expect(OpCT.readLE(res)).toBe(EServerOp.ERROR);

});

it.skip("sends an initial state update", async () => {
    const {connector, constellation, uid, typeName} = await setup();

    connector.pushData(ParticleHandshakeCT.allocLE({
        op: 0x00,
        typeName,
        uid
    }));

    const handshakeRes = await connector.response;
    const stateUpdate = await connector.response;
});

it("returns a particle based on uid", async () => {
    const {connector, constellation, uid, typeName} = await setup();

    const p = constellation.particle(uid);
    expect(p).not.toBeUndefined();
});


it("emits on a particle state update", async () => {
    const {connector, constellation, uid, typeName} = await setup();
    const particle = constellation.particle(uid);

    const patchEvent = DeferredPromise.Promisify(particle.on.bind(particle), "patch");
    const stateEvent = DeferredPromise.Promisify(particle.on.bind(particle), "state");
    const changeEvent = DeferredPromise.Promisify(particle.on.bind(particle), "change");


    //Perform a handshake
    connector.pushData(ParticleHandshakeCT.allocLE({
        op: 0x00,
        typeName,
        uid
    }));
    const {rid} = HandshakeResponseCT.readLE(await connector.response);

    // Send a state update in to Constellation through our test connector.
    const stateUpdatePayload = Buffer.concat([
        TimestampHeaderCT.allocLE({op: 0x10, timestamp: 0, rid}),
        VarIdCT.allocLE(0x00),
        uint16.allocLE(0xFF),
    ]);
    connector.pushData(stateUpdatePayload);

    const [patch, state, change] = await Promise.all([patchEvent, stateEvent, changeEvent])

    expect(patch).toEqual([{uint16_val: 0xFF}, particle])
    expect(state).toEqual([{
        uint16_val: 0xFF,
        double_val: 0,
        string_val: "str",
        uint16_server_val: 0
    }, particle])
    expect(change).toEqual([
        {
            uint16_val: 0xFF,
            double_val: 0,
            string_val: "str",
            uint16_server_val: 0
        },
        {
            uint16_val: 0xFF
        },
        {
            uint16_val: 0,
            double_val: 0,
            string_val: "str",
            uint16_server_val: 0
        },
        particle])

});
