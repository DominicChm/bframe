import {logger} from "./modules/logging";
import {init as userManagerInit} from "bc/user-manager"
import {mutableProxy} from "./modules/constellation-manager/proxies/mutableProxy";

const log = logger("ROOT");

//Start all in async IIFE
// (async () => {
//     const pm = new ParticleManager();
//     await userManagerInit();
//
// })()


let p = new Proxy({test: 1, lel: "34902"}, mutableProxy(
    (s, prev, patch) => console.log(s, prev, patch)
))

p.test = 2;
p.test = 45;
p.lel = "hek";

