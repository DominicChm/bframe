import {c_string, uint16} from "c-type-util";
import {serializeError} from "../0xFF_ERROR";
import {opcode_ctype} from "../../ctypes/opcode";

it('compose_error composes test packet', () => {
    const message_ctype = c_string(256);
    const code_ctype = uint16

    const test_data = {
        code: 0x69,
        message: "Test Error Message String 1234567890"
    }

    const buf = Buffer.alloc(256 + 2 + 1);

    //Manually construct a handshake packet
    opcode_ctype.writeLE(0xFF, buf);
    code_ctype.writeLE(test_data.code, buf, opcode_ctype.size)
    message_ctype.writeLE(test_data.message, buf, code_ctype.size + opcode_ctype.size);

    expect(
        serializeError(test_data.code, test_data.message)
    ).toEqual(buf);
});
