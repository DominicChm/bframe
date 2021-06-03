import {parseStateUpdate} from "../0x10_STATE_UPDATE";
import {TimestampHeaderCT} from "../../ctypes/TimestampHeaderCT";

it('state_update parses buffer', () => {
    const timestamp = 12345;
    const rid = 8293;
    const op = 0x10

    const data_payload = Buffer.from([5, 6, 7, 8, 32, 213, 13, 2]);
    const timestamp_payload = TimestampHeaderCT.allocLE({timestamp, rid, op})
    const payload = Buffer.concat([timestamp_payload, data_payload]);

    const parsed = parseStateUpdate(payload);
    expect(parsed).toEqual({rid, timestamp, data: data_payload});
});
