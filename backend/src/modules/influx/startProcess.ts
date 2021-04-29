/** Starts the influxd process **/
//TODO: SUPPORT LINUX
import child_process from "child_process"
import Path from "path";
import {logger} from "bc/logging";
import * as fs from "fs";
import {CFG_influxdb} from "./CONFIG";

const log = logger("Influx Bootstrapper");

export async function startInflux() {
    log("Starting Influx...");

    const exe = Path.resolve(__dirname, CFG_influxdb.INFLUXD_PATH);

    if (!fs.existsSync(exe)) {
        log(`Influx start failed! Configured InfluxDB .exe (${exe}) does not exist.`, "fatal");
        process.exit(1);
    }

    // stdio[2] is normal log output for influxd
    const influxd_process = child_process.spawn(exe, {stdio: ["ignore", "ignore", "pipe"]});

    // Waits for the process to successfully start.
    function startPromise(resolve, reject) {

        // Runs and exits program after START_TIMEOUT ms if not cleared by successful startup.
        const timeout = setTimeout(() => {
            log(`InfluxDB startup timed out after ${CFG_influxdb.START_TIMEOUT}ms`, "fatal");
            process.exit(1);
        }, CFG_influxdb.START_TIMEOUT);

        function onOut(data) {
            //Resolves if the search string for successful startup is seen in process output.
            if (data.includes(CFG_influxdb.STARTUP_SEARCH_STRING)) {
                clearTimeout(timeout);
                resolve();
            }
        }

        influxd_process.stdio[2].on("data", onOut);
    }

    await new Promise(startPromise);
    log("Influx successfully bootstrapped!")

    return influxd_process;
}


