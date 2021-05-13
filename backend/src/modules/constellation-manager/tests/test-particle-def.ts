import {c_string, double, uint16, uint8} from "c-type-util";
import {
    IParticleTypeDefinition,
    IParticleVariableDefinition,
    IState,
    IVariableDefinition
} from "bc/constellation-manager";

interface ITestParticleParticleState {
    uint16_val: number,
    double_val: number,
    string_val: string
}

interface ITestParticleServerState {
    uint16_server_val: number
}

const uint16_pval: IParticleVariableDefinition<"uint16_val", number> = {
    symbol: "uint16_val",
    js_type: "number",
    readable_name: "Uint16 Value",
    description: "A test integer value",
    abs_min: 0,
    abs_max: 1023,
    typical_min: 250,
    typical_max: 773,
    c_type: uint16,
    derived: [
        {
            symbol: "normalized",
            readable_name: "Normalized Value",
            description: "The integer value, normalized 0 - 1",
            convert_base_to_derived: (base_val: number, variable_definition) => 0,
            convert_derived_to_base: (derived: number, variable_definition) => 0
        },
    ]
}

const double_pval: IParticleVariableDefinition<"double_val", number> = {
    symbol: "double_val",
    js_type: "number",
    readable_name: "Double Value",
    description: "A test double",
    abs_min: 0,
    abs_max: 1,
    typical_min: 0.25,
    typical_max: 0.75,
    c_type: double,
}

const string_pval: IParticleVariableDefinition<"string_val", string> = {
    symbol: "string_val",
    js_type: "string",
    readable_name: "String Value",
    description: "A test string",
    c_type: c_string(32),
    outside_typical: ((raw_val, variable_definition) => raw_val !== "nominal")
}

const uint16_sval: IParticleVariableDefinition<"uint16_server_val", number> = {
    symbol: "uint16_server_val",
    js_type: "number",
    readable_name: "Uint16 Server Value",
    description: "A test integer value",
    abs_min: 0,
    abs_max: 1023,
    typical_min: 250,
    typical_max: 773,
    c_type: uint16,
    derived: [
        {
            symbol: "normalized",
            readable_name: "Normalized Value",
            description: "The integer value, normalized 0 - 1",
            convert_base_to_derived: (base_val: number, variable_definition) => 0,
            convert_derived_to_base: (derived: number, variable_definition) => 0
        },
    ]
}

export const defTestParticle: IParticleTypeDefinition<ITestParticleParticleState, ITestParticleServerState> = {
    typeName: "test-particle",
    description: "A test particle",
    readable_name: "Test Particle",
    particleVariables: [
        double_pval,
        uint16_pval,
        string_pval
    ],
    serverVariables: [
        uint16_sval
    ],
}
