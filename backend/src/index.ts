import {logger} from "./modules/logging";
import {init, stop} from "bc/influx";
import {init as userManagerInit} from "bc/user-manager"
const log = logger("ROOT");

//Start all in async IIFE
(async () => {
    //await init();
    await userManagerInit();

})()

