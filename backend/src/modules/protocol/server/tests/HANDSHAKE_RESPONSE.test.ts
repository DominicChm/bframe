import {compose_HANDSHAKE_RESPONSE} from "../0x00_HANDSHAKE_RESPONSE";

it("handshake_response composes correctly", () => {
    const id = 0x0005;
    const op = 0x00
    const expected = [
        op,
        0x05, 0x00
    ];
    let buf = compose_HANDSHAKE_RESPONSE(id);
    expect(buf).toEqual(Buffer.from(expected))
});
