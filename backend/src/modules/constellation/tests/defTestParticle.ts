import {cString, double, uint16, uint8} from "c-type-util";
import {
    IParticleTypeDefinition, ISystemParticleDefinition,
    IVariableDefinition
} from "bc/constellation";


const uint16_val: IVariableDefinition<number> = {
    js_type: "number",
    readable_name: "Uint16 Value",
    description: "A test integer value",
    abs_min: 0,
    abs_max: 1023,
    typical_min: 250,
    typical_max: 773,
    cType: uint16,
    derived: [
        {
            symbol: "normalized",
            readable_name: "Normalized Value",
            description: "The integer value, normalized 0 - 1",
            convert_base_to_derived: (base_val: number, variable_definition) => 0,
            convert_derived_to_base: (derived: number, variable_definition) => 0
        },
    ],
    owner: "particle"
}

const double_val: IVariableDefinition<number> = {
    js_type: "number",
    readable_name: "Double Value",
    description: "A test double",
    abs_min: 0,
    abs_max: 1,
    typical_min: 0.25,
    typical_max: 0.75,
    cType: double,
    owner: "particle"
}

const string_val: IVariableDefinition<string> = {
    js_type: "string",
    readable_name: "String Value",
    description: "A test string",
    cType: cString(32),
    outside_typical: ((raw_val, variable_definition) => raw_val !== "nominal"),
    owner: "particle"
}

const uint16_server_val: IVariableDefinition<number> = {
    js_type: "number",
    readable_name: "Uint16 Server Value",
    description: "A test integer value",
    abs_min: 0,
    abs_max: 1023,
    typical_min: 250,
    typical_max: 773,
    cType: uint16,
    derived: [
        {
            symbol: "normalized",
            readable_name: "Normalized Value",
            description: "The integer value, normalized 0 - 1",
            convert_base_to_derived: (base_val: number, variable_definition) => 0,
            convert_derived_to_base: (derived: number, variable_definition) => 0
        },
    ],
    owner: "server"
}

export interface ITestParticleState {
    uint16_val: number,
    double_val: number,
    string_val: string,
    uint16_server_val: number
}

export const testParticleSystemDefinition: ISystemParticleDefinition<ITestParticleState> = {
    typeName: "test-particle",
    initialState: {
        double_val: 0.00,
        string_val: "str",
        uint16_server_val: 0,
        uint16_val: 0,
    },
    uid: "uid"
}

export const testParticleTypeDefinition: IParticleTypeDefinition<ITestParticleState> = {
    typeName: "test-particle",
    description: "A test particle",
    readable_name: "Test Particle",
    endian: "little",
    variables: {
        uint16_val,
        double_val,
        string_val,
        uint16_server_val
    },
    defaultInitialState: {
        uint16_val: 0,
        uint16_server_val: 0,
        string_val: "STR",
        double_val: 0
    }
}
