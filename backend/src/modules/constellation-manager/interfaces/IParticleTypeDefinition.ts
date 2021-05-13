import {IServerVariableDefinition} from "./IServerVariableDefinition";
import {IParticleVariableDefinition} from "./IParticleVariableDefinition";
import {IState} from "./IState";
import {IVariableDefinition} from "./IVariableDefinition";

//Maps input interface object type to array of variable definition types.
type TParticleVariables<T extends Object> = IParticleVariableDefinition<Extract<keyof T, string>, T[keyof T]>[];
type TServerVariables<T extends Object> = IServerVariableDefinition<Extract<keyof T, string>, T[keyof T]>[];


export interface IParticleTypeDefinition<TParticleState extends Object, TServerState extends Object> {
    /**
     * The name of the particle. This should be unique. Max length of 64 chars.
     */
    typeName: string;

    /**
     * A user-readable name for the particle.
     */
    readable_name: string;

    /**
     * A user-readable description for the particle.
     */
    description: string;

    particleVariables: TParticleVariables<TParticleState>;
    serverVariables: TServerVariables<TServerState>;
}
