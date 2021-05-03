import {logger} from "./modules/logging";
import {init as userManagerInit} from "bc/user-manager"
import {ParticleManager} from "./modules/particle-manager/ParticleManager";

const log = logger("ROOT");

//Start all in async IIFE
(async () => {
    const pm = new ParticleManager();
    await userManagerInit();

})()

