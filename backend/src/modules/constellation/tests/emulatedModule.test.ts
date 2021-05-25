import {Constellation} from "../Constellation";
import {testParticleTypeDefinition, testParticleSystemDefinition} from "./defTestParticle";
import {TestConnector} from "./testUtil";
import {EServerOp, OpCT, ParticleErrorCT, ParticleHandshakeCT, RidCT, ServerErrorCT} from "../../protocol";

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

it("sends an initial state update", async () => {
    const {connector, constellation, uid, typeName} = await setup();

    connector.pushData(ParticleHandshakeCT.allocLE({
        op: 0x00,
        typeName,
        uid
    }));

    const handshakeRes = await connector.response;
    const stateUpdate = await connector.response;


})
