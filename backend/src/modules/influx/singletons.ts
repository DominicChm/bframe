// Stores singleton instances for this entire module.

import {InfluxDB} from "influx";
import {ChildProcessWithoutNullStreams} from "child_process";

export interface IInfluxSingletons {
    client: InfluxDB | null,
    influxd_process: ChildProcessWithoutNullStreams | null,
    loaded: boolean,
}

// Export as an object to allow mutation from outside sources.
// This behavior should not be used outside of things like process management
export let singletons: IInfluxSingletons = {
    client: null,
    influxd_process: null,
    loaded: false,
}

