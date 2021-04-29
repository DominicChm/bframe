/**
 * Returns a sparse array with indexes mapped to their updated values.
 */
import {ICType} from "c-type-util/dist/interfaces/ICType";

export interface IRawStateUpdate {
    uid: number;
    timestamp: number;
    payload: any[];
}

export function parse_STATE_UPDATE(buf: Buffer, array_type_map: ICType[]): IRawStateUpdate {
    return {
        uid: 0,
        timestamp: 0,
        payload: [],
    };
}
