import {Module} from "../module-manager/classes/Module";
import {uint8} from "c-type-util";
import {IVariableDefinition} from "../module-manager/ModuleTypeRegistry/IVariableDefinition";

const pot_var: IVariableDefinition =
    {
        symbol: "pot_val",
        readable_name: "Potentiometer Value",
        description: "The value of the potentiometer",
        abs_min: 0,
        abs_max: 0,
        typical_min: 0,
        typical_max: 0,
        c_type: uint8,
        derived: [
            {
                symbol: "normalized",
                readable_name: "Normalized Value",
                description: "The value of the potentiometer, normalized 0 - 1",
                convert_base_to_derived: (base_val, variable_definition) => 0,
                convert_derived_to_base: (derived, variable_definition) => 0
            },
            {
                symbol: "resistance",
                readable_name: "Resistance",
                description: "The current resistance of the potentiometer in ohms",
                convert_base_to_derived: (base_val, variable_definition) => 0,
                convert_derived_to_base: (derived, variable_definition) => 0
            },
            {
                symbol: "position",
                readable_name: "Position",
                description: "The current position of the potentiometer in degrees",
                convert_base_to_derived: (base_val, variable_definition) => 0,
                convert_derived_to_base: (derived, variable_definition) => 0
            },
        ]
    }
