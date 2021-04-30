import test from 'ava';
import {parse_HANDSHAKE} from "../0x00_HANDSHAKE";
import {c_string} from "c-type-util";

test('handshake parses buffer', t => {
    const type_ctype = c_string(64);
    const uid_ctype = c_string(32);

    const test_data = {
        type: "012345678901234567890123456789012345678901234567890123456789012",
        uid: "0123456789012345678901234567890"
    }

    const buf = Buffer.alloc(1 + 64 + 32)

    //Manually construct a handshake packet
    buf.writeUInt8(0)
    type_ctype.writeLE(test_data.type, buf, 1);
    uid_ctype.writeLE(test_data.uid, buf, 64 + 1);

    const parsed = parse_HANDSHAKE(buf);
    t.deepEqual(parsed, test_data);
});
