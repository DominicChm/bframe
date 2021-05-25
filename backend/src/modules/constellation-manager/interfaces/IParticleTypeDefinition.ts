import {IVariableDefinition} from "./IVariableDefinition";
import {CType} from "c-type-util";

export interface IParticleTypeDefinition<TParticleState> {
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

    /**
     * The C type used to encode variable IDs. Usually uint8, but can go up to uint32 if needed to support more
     * variable fields.
     */
    varIdCType: CType<number>


    endian: "little" | "big"

    defaultInitialState: TParticleState;

    variables: { [Property in keyof TParticleState]: IVariableDefinition<TParticleState[Property]> }
}
