import {compose_STATE_UPDATE} from "../0x10_STATE_UPDATE";

it("state_update composes correctly", () => {
    let buf = compose_STATE_UPDATE(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]));
    expect(buf).toEqual(Buffer.from([0x10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]))
});
