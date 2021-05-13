import {IParticleTypeDefinition, ISystemParticleDefinition} from "../interfaces";

export function verifyInitialServerState<TServerState>(
    typeDefinition: IParticleTypeDefinition<any, TServerState>,
    systemDefinition: ISystemParticleDefinition<TServerState>
) {
    typeDefinition.serverVariables.forEach(vDef => {
        if (systemDefinition.initialServerState[vDef.symbol] === undefined)
            throw new Error(`System definition initial server state is missing required field >${vDef.symbol}<!`);

        const js_type = typeof systemDefinition.initialServerState[vDef.symbol]
        if (typeof systemDefinition.initialServerState[vDef.symbol] !== vDef.js_type)
            throw new Error(`Incorrect initial server state type of field ${vDef.symbol}! Expected ${vDef.js_type}, got ${js_type}`)

    })
}
