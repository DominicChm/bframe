import {Server} from "ws"
import config from "bc/config"
import {logger} from "bc/logging";

const log = logger("user-manager");

export async function init() {
    new Server({port: config.port})
}
