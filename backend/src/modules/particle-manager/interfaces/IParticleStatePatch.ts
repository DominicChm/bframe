import {ParticleState_t} from "./IParticleState";

type IParticleStatePatch = { [Property in keyof ParticleState_t]?: ParticleState_t[Property] }; //Make properties optional for patch.


