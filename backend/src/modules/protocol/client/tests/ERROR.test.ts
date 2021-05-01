import {c_string, uint16} from "c-type-util";
import {parse_ERROR} from "../0xFF_ERROR";
import {timestamp_header_ctype} from "../../ctypes/timestamp_header";

it('parse_error parses test packet', () => {
    const message_ctype = c_string(256);
    const code_ctype = uint16

    const test_data = {
        code: 0x69,
        message: "Test Error Message String 1234567890",
        id: 0x7777,
        timestamp: 0xAAAA
    }

    const buf = Buffer.alloc(256 + 2 + 2 + 1 + 2);

    //Manually construct a handshake packet
    timestamp_header_ctype.writeLE({
        id: test_data.id,
        timestamp: test_data.timestamp,
        op: 0xFF
    }, buf);

    // Write the other components of the error message.
    code_ctype.writeLE(test_data.code, buf, timestamp_header_ctype.size);
    message_ctype.writeLE(test_data.message, buf, timestamp_header_ctype.size + code_ctype.size);

    const parsed = parse_ERROR(buf);

    expect(parsed).toEqual(test_data);
});
