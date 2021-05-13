export interface ISystemParticleDefinition<TServerState> {
    typeName: string,
    uid: string,
    initialServerState: TServerState
}
