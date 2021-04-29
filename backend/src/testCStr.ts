import {c_string} from "c-type-util";
import {parse_HANDSHAKE} from "./modules/protocol/client/parse_HANDSHAKE";

const type_packet = Buffer.alloc(97)
type_packet.writeUInt8(0x00);
type_packet.write("TEST_TYPE", 1, 64, "ascii");
type_packet.write("12:34:56:78:9A:BC", 65, "ascii");

console.log(parse_HANDSHAKE(type_packet));

