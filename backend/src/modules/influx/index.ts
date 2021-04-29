//This is a simple module to manage a singleton InfluxDB instance.
import {startInflux} from "./startProcess";
import {singletons} from "./singletons"
import {logger} from "bc/logging";

const log = logger("Influx")

// Initializes the influx client and API
export async function init() {
    if (singletons.loaded) {
        log("Attempt to init Influx when it was already started!", "warn");
        return;
    }

    singletons.influxd_process = await startInflux();
    singletons.loaded = true;
}


export async function stop() {
    if (!singletons.loaded) {
        return;
    }
    log("Stopping influx...");

    singletons.influxd_process.kill();

    log("Influx stopped.");
}

export async function getClient() {
    return singletons.client;
}
