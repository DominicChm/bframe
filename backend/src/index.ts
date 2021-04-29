import {logger} from "./modules/logging";
import {init, stop} from "bc/influx";

const log = logger("ROOT");

//Start all in async IIFE
(async () => {
    await init();
})()

