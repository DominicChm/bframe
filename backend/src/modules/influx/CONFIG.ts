import * as Path from "path";

export let CFG_influxdb = {
    INFLUXD_PATH: Path.resolve(__dirname, "lib/influxdb-1.8.2-1/influxd.exe"),
    START_TIMEOUT: 10000,

    //The string to search for in Influx's stdout that indicates a successful startup.
    STARTUP_SEARCH_STRING: "Listening on HTTP",
}
