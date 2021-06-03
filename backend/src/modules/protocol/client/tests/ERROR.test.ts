import {cString, uint16} from "c-type-util";
import {ParticleErrorCT} from "../0xFF_ERROR";
import {ParticleHandshakeCT} from "../0x00_HANDSHAKE";
import {EClientOp} from "../../client_opcodes";
import {TimestampHeaderCT} from "../../ctypes/TimestampHeaderCT";

it('parse_error parses test packet', () => {
    const message_ctype = cString(256);
    const code_ctype = uint16

    const test_data = {
        errorCode: 0x69,
        message: "Test Error Message String 1234567890",
        id: 0x7777,
        timestamp: 0xAAAA
    }

    //Manually construct an error packet
    const buf = Buffer.concat([
        TimestampHeaderCT.allocLE({
            rid: test_data.id,
            timestamp: test_data.timestamp,
            op: 0xFF
        }),
        code_ctype.allocLE(test_data.errorCode),
        message_ctype.allocLE(test_data.message),
    ]);


    // Write the other components of the error message.


    const parsed = ParticleErrorCT.readLE(buf);

    expect(parsed.message).toEqual(test_data.message);
    expect(parsed.errorCode).toEqual(test_data.errorCode);
});
