import {IVariableDefinition} from "./IVariableDefinition";

/**
 * Interface for "derived" variables. These are values that are codependent with the raw base value of the
 * containing variable definition. They can be used to expose a more user-friendly interface for interacting
 * with module variables. For example, instead of interacting directly with an analog (0-1023) value read from a
 * potentiometer, a derived variable might map that value to a degree range.
 */
export interface IDerivedValue {
    /**
     * The internal string used to refer to this derived value. Should be C++ compatible.
     * For example: "raw_val"
     */
    symbol: string;

    /**
     * The name shown to users when selecting this derived value. Should be reasonably descriptive.
     * For example: "Raw Value"
     */
    readable_name: string;

    /**
     * A user-friendly description for this derived value. For example: "The raw analog value
     * present at the input of the ESP"
     */
    description: string;

    /**
     * Should convert the base type of the parent value to whatever this derived value represents. For example, if
     * the base value is the raw analog value of a potentiometer (0-1023), this function might map it to degrees.
     */
    convert_base_to_derived: (base_val: any, variable_definition: IVariableDefinition) => any;

    /**
     * Should do the opposite of `convert_base_to_derived`. That is, convert to an expected raw analog value from
     * an input in degrees.
     */
    convert_derived_to_base: (derived: any, variable_definition: IVariableDefinition) => any;
}
