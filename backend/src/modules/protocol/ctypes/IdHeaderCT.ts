import {cStruct, uint16, uint8} from "c-type-util";

export interface IdHeader {
    op: number,
    rid: number,
}

export let IdHeaderCT = cStruct<IdHeader>({
    op: uint8,
    rid: uint16,
})
