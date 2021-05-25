import {cStruct, CType, uint16, uint8} from "c-type-util";
import {OpCT} from "./OpCT";
import {RidCT} from "./RidCT";
import {TimestampCT} from "./TimestampCT";


export interface TimestampHeader {
    op: number,
    rid: number,
    timestamp: number,
}


/**
 * The ctype for parsing the protocol's common header, which includes a timestamp and id.
 */
export let TimestampHeaderCT: CType<TimestampHeader> = cStruct<TimestampHeader>({
    op: OpCT,
    rid: RidCT,
    timestamp: TimestampCT,
})
