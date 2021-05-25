import {logger} from "./modules/logging";
import {MutableProxy} from "./modules/constellation-manager/particle/mutableProxy";


const log = logger("ROOT");

const h = new MutableProxy<{ a: number }>();
const p = new Proxy({a: 1}, h);
p.a = 2;
p.a = 5;

console.log(p.a);
console.log(h.previous, h.current, h.patch);

// interface simplePState {
//     v: number
// }
//
// const simpleP: IParticleTypeDefinition<simplePState> = {
//     typeName: "test",
//     varIdCType: uint16,
//     endian: "little",
//     variables: {
//         v: {
//             owner: "server",
//             js_type: "number",
//             cType: uint16,
//             description: "var",
//             readable_name: "readable"
//         }
//     },
//     readable_name: "test",
//     description: "test",
// };
//
// //Start all in async IIFE
// (async () => {
//     const pm = new Constellation();
//
//     pm.registerParticleType(simpleP)
//
//     await pm.load({
//         particles: [{
//             uid: "uid",
//             initialState: {},
//             typeName: "test"
//         }]
//     })
//
//     await userManagerInit();
//
// })()
