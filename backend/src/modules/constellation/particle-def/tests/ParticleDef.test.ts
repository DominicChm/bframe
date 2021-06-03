import {ParticleDef} from "../ParticleDef";
import {testParticleTypeDefinition} from "../../tests/defTestParticle";
import {cString, uint16} from "c-type-util";
import {VarIdCT} from "../../../protocol/ctypes/VarIdCT";

describe("parses a defTestParticle state update", () => {
    it("uint16_val", () => {
        const pd = new ParticleDef(testParticleTypeDefinition);
        const buf = Buffer.from([
            0x00, 0x01, 0x01, //Dummy state update to set uint16_val to 1.
        ])
        const updateData = pd.parseDataPatch(buf);
        expect(updateData).toEqual({uint16_val: 257})

    });

    it("str_val", () => {
        const pd = new ParticleDef(testParticleTypeDefinition);
        const buf = Buffer.alloc(33);
        buf.writeUInt8(0x02);
        cString(32).writeLE("TEST_STRING", buf, 1);

        const updateData = pd.parseDataPatch(buf);
        expect(updateData).toEqual({string_val: "TEST_STRING"})
    });

    it("uint16_val AND str_val", () => {
        const pd = new ParticleDef(testParticleTypeDefinition);
        const buf = Buffer.alloc(33 + 3);
        buf.writeUInt8(0x00);
        buf.writeUInt16LE(1234, 1);

        buf.writeUInt8(0x02, 3);
        cString(32).writeLE("TEST_STRING", buf, 4);

        const updateData = pd.parseDataPatch(buf);
        expect(updateData).toEqual({uint16_val: 1234, string_val: "TEST_STRING"})
    });
})

describe("ParticleDef serializer", () => {
    it("DOESN'T serialize a particle-owned variable", () => {
        const pd = new ParticleDef(testParticleTypeDefinition);

        //Should NOT serialize, b/c uint16_val is not a server-owned variable
        const res = pd.serializeDataPatch({uint16_val: 257});
        expect(res).toEqual(Buffer.alloc(0));
    });

    it("serializes a server-owned variable", () => {
        const pd = new ParticleDef(testParticleTypeDefinition);
        const expected = Buffer.concat([
            VarIdCT.allocLE(0x03),
            uint16.allocLE(0xAA),
        ]);

        const res = pd.serializeDataPatch({uint16_server_val: 0xAA, uint16_val: 1234, string_val: "TEST_STRING"});
        expect(res).toEqual(expected)

    });
})
