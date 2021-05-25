import {parseStateUpdate} from "../0x10_STATE_UPDATE";
import {timestamp_header_ctype} from "../../ctypes/timestamp_header";

it('state_update parses buffer', () => {
    const data_payload = Buffer.from([5,6,7,8,32,213,13,2]);
    const buf = Buffer.alloc(data_payload.length + timestamp_header_ctype.size);

    const timestamp = 12345;
    const id = 8293;
    const op = 0x10

    timestamp_header_ctype.writeLE({timestamp, id, op}, buf, 0)
    data_payload.copy(buf, timestamp_header_ctype.size); // Copy payload into the data buffer.

    const parsed = parseStateUpdate(buf);
    expect(parsed).toEqual({id, timestamp, data: data_payload});
});
