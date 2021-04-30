import {ICType} from "c-type-util";
import {id_ctype} from "./id";
import {timestamp_ctype} from "./timestamp";


export interface ITimestampHeader {
    id: number,
    timestamp: number
}


/**
 * The ctype for parsing the protocol's common header, which includes a timestamp and id.
 */
export let timestamp_header_ctype: ICType = {
    size: id_ctype.size + timestamp_ctype.size,
    readBE(buf: Buffer, offset: number | undefined): ITimestampHeader {
        return {
            id: id_ctype.readBE(buf, offset),
            timestamp: timestamp_ctype.readBE(buf, offset + id_ctype.size)
        }
    },
    readLE(buf: Buffer, offset: number | undefined): ITimestampHeader {
        return {
            id: id_ctype.readLE(buf, offset),
            timestamp: timestamp_ctype.readLE(buf, offset + id_ctype.size)
        }
    },
    writeBE(data: ITimestampHeader, buf: Buffer, offset: number | undefined): void {
        id_ctype.writeBE(data.id, buf, offset);
        timestamp_ctype.writeBE(data.timestamp, buf, offset + id_ctype.size)
    },
    writeLE(data: ITimestampHeader, buf: Buffer, offset: number | undefined): void {
        id_ctype.writeLE(data.id, buf, offset);
        timestamp_ctype.writeLE(data.timestamp, buf, offset + id_ctype.size)
    }

}
