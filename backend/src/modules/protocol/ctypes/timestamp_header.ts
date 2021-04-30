import {c_struct, ICType, uint16, uint8} from "c-type-util";
import {id_ctype} from "./id";
import {timestamp_ctype} from "./timestamp";
import {opcode_ctype} from "./opcode";


export interface ITimestampHeader {
    id: number,
    timestamp: number
}


/**
 * The ctype for parsing the protocol's common header, which includes a timestamp and id.
 */
export let timestamp_header_ctype: ICType = c_struct([
    {
        name: "op",
        type: opcode_ctype,
    },
    {
        name: "id",
        type: id_ctype,
    },
    {
        name: "timestamp",
        type: timestamp_ctype
    }
])
