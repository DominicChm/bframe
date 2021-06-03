import {parseHandshake} from "../0x00_HANDSHAKE";
import {cString} from "c-type-util";
import {OpCT} from "../../ctypes/OpCT";

it('handshake parses buffer', () => {
    const TypenameCT = cString(64);
    const UidCT = cString(32);

    const test_data = {
        op: 0x00,
        typeName: "012345678901234567890123456789012345678901234567890123456789012",
        uid: "0123456789012345678901234567890"
    }

    //Manually construct a handshake packet
    const payload = Buffer.concat([
        OpCT.allocLE(test_data.op),
        TypenameCT.allocLE(test_data.typeName),
        UidCT.allocLE(test_data.typeName)
    ])

    const parsed = parseHandshake(payload);

    expect(parsed).toEqual(test_data);
});
