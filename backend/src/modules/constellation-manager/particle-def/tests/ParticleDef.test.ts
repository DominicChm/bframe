import {ParticleDef} from "../ParticleDef";
import {testParticleTypeDefinition} from "../../tests/defTestParticle";
import {cString} from "c-type-util";

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

describe("encodes a defTestParticle state update", () => {
    it("uint16_val", () => {
        const pd = new ParticleDef(testParticleTypeDefinition);
        const expected = Buffer.from([
            0x00, 0x01, 0x01, //Dummy state update to set uint16_val to 1.
        ])
        const res = pd.serializeDataPatch({uint16_val: 257});
        expect(res).toEqual(expected);
    });

    it("str_val", () => {
        const pd = new ParticleDef(testParticleTypeDefinition);
        const expected = Buffer.alloc(33);
        expected.writeUInt8(0x02);
        cString(32).writeLE("TEST_STRING", expected, 1);

        const res = pd.serializeDataPatch({string_val: "TEST_STRING"});
        expect(res).toEqual(expected)
    });

    it("uint16_val AND str_val", () => {
        const pd = new ParticleDef(testParticleTypeDefinition);
        const expected = Buffer.alloc(33 + 3);
        expected.writeUInt8(0x00);
        expected.writeUInt16LE(1234, 1);

        expected.writeUInt8(0x02, 3);
        cString(32).writeLE("TEST_STRING", expected, 4);

        const res = pd.serializeDataPatch({uint16_val: 1234, string_val: "TEST_STRING"});
        expect(res).toEqual(expected)

    });
})
