import {IClientInformation} from "../../module-manager/interfaces/IClientInformation";
import WebSocket from "ws";
import {promisify} from "util";
import {parse_HANDSHAKE} from "../client/parse_HANDSHAKE";
import {ModuleTypeRegistry} from "../../module-manager";

/**
 * Performs a handshake with the passed websocket connection and, returning `IClientInformation`
 * @param ws {WebSocket} - The websocket associated with the attempted connection
 * @param allocatedID {number} - The allocated runtime ID of this connection.
 * @param module_def_registry - A {type : definition} map containing all module definitions. Needed to verify and construct a module.
 * @return {Promise<IClientInformation>}
 */
export async function doHandshake(ws: WebSocket, allocatedID: number, module_def_registry: ModuleTypeRegistry): Promise<IClientInformation> {
    const wsOnce = promisify(ws.once);

    //Await one message from the client. Throw if it's not to spec.
    const msg: Buffer = await wsOnce("message");
    if (!(msg instanceof Buffer)) throw new Error("Handshake was not an instance of Buffer! (was text sent?)");

    const handshake = parse_HANDSHAKE(msg);
    console.log(handshake);

    return {
        id: allocatedID,
        type: "NA",
        uid: "NA",
        definition: module_def_registry[0]
    }

}
