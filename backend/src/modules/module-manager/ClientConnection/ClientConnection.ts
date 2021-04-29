import {EventEmitter} from "events";
import {ModuleTypeRegistry} from "../ModuleTypeRegistry/ModuleTypeRegistry";

export class ClientConnection extends EventEmitter {
    /**
     * Abstracts module connection management from ModuleManager
     */
    private readonly type_registry: ModuleTypeRegistry

    private id: number;

    private ws: WebSocket;

    constructor(ws, id, type_registry) {
        super();
        this.type_registry = type_registry;
        this.ws = ws;
        this.id = id;
    }
}
