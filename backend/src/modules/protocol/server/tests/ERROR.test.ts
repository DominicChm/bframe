import {cString, uint16} from "c-type-util";
import {serializeError} from "../0xFF_ERROR";
import {OpCT} from "../../ctypes/OpCT";

it('compose_error composes test packet', () => {
    const message_ctype = cString(256);
    const code_ctype = uint16

    const test_data = {
        code: 0x69,
        message: "Test Error Message String 1234567890"
    }

    const buf = Buffer.alloc(256 + 2 + 1);

    //Manually construct a handshake packet
    OpCT.writeLE(0xFF, buf);
    code_ctype.writeLE(test_data.code, buf, OpCT.size)
    message_ctype.writeLE(test_data.message, buf, code_ctype.size + OpCT.size);

    expect(
        serializeError(test_data.code, test_data.message)
    ).toEqual(buf);
});
