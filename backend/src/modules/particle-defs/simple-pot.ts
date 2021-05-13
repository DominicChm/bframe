import {uint8} from "c-type-util";
import {
    IParticleTypeDefinition,
    IParticleVariableDefinition,
    IState,
    IVariableDefinition
} from "bc/constellation-manager";

interface ISimplePotParticleState {
    pot_val: number
}

interface ISimplePotServerState extends IState {

}

const pot_var: IParticleVariableDefinition<"pot_val", number> = {
    symbol: "pot_val",
    readable_name: "Potentiometer Value",
    description: "The value of the potentiometer",
    abs_min: 0,
    abs_max: 1023,
    typical_min: 250,
    typical_max: 773,
    c_type: uint8,
    derived: [
        {
            symbol: "normalized",
            readable_name: "Normalized Value",
            description: "The value of the potentiometer, normalized 0 - 1",
            convert_base_to_derived: (base_val: number, variable_definition) => 0,
            convert_derived_to_base: (derived: number, variable_definition) => 0
        },
        {
            symbol: "resistance",
            readable_name: "Resistance",
            description: "The current resistance of the potentiometer in ohms",
            convert_base_to_derived: (base_val: number, variable_definition) => 0,
            convert_derived_to_base: (derived: number, variable_definition) => 0
        },
        {
            symbol: "position",
            readable_name: "Position",
            description: "The current position of the potentiometer in degrees",
            convert_base_to_derived: (base_val: number, variable_definition) => 0,
            convert_derived_to_base: (derived: number, variable_definition) => 0
        },
    ]
}

export const defSimplePot: IParticleTypeDefinition<ISimplePotParticleState, ISimplePotServerState> = {
    typeName: "simple-potentiometer",
    description: "A potentiometer",
    readable_name: "Simple potentiometer",
    particleVariables: [
        pot_var
    ],
    serverVariables: [],
}
