import {EventEmitter} from "events";
import {log_fn_t, logger} from "../../logging";

export abstract class Module extends EventEmitter {
    private log: log_fn_t;

    constructor() {
        super();
    }

    static verifyImplementation() {
    }
}
