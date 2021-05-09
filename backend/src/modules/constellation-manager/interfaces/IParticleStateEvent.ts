export interface IParticleStateEvent<ParticleState_t extends { [key: string]: any }> {
    uid: string,
    previousState: ParticleState_t;
    nextState: ParticleState_t;
    patch: { [Property in keyof ParticleState_t]?: ParticleState_t[Property] }; //Make properties optional for patch.
}


