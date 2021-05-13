import {ICType} from "c-type-util";
import {IDerivedValue} from "./IDerivedValue";

type js_type_strings = "object" | "number" | "string" | "bigint"

export interface IVariableDefinition<VariableSymbol extends string, TBase> {
    /**
     * A C-compatible symbol to represent the variable. It is used to generate headers for
     * firmware. For example, `analog_raw`
     */
    symbol: VariableSymbol;

    /**
     * The JS typename
     */
    js_type: js_type_strings

    /**
     * A user-readable name to describe this variable. For example, `Analog Input`
     */
    readable_name: string;

    /**
     * A user-readable description of what this variable is and does.
     */
    description: string;

    /**
     * The C-Type that is represented by this variable.
     */
    c_type: ICType<TBase>;

    /**
     * An array of {@link IDerivedValue}[IDerivedValues], used to specify transformations to and from
     * more user-friendly data
     */
    derived?: IDerivedValue<TBase, unknown>[];

    /**
     * A user-defined function that returns true if the base value is currently atypical.
     * TODO: PASS IN ENTIRE STATE TO ALLOW USE OF OTHER VARIABLES
     */
    outside_typical?: (raw_val: TBase, variable_definition: IVariableDefinition<VariableSymbol, TBase>) => boolean;

    /**
     * A function that returns true if the base value is critically incorrect
     * (Like engine speed being above 12,000 RPM).
     * TODO: PASS IN ENTIRE STATE TO ALLOW USE OF OTHER VARIABLES
     */
    outside_abs?: (raw_val: TBase, variable_definition: IVariableDefinition<VariableSymbol, TBase>) => boolean;

    //Fields that can automatically take care of limiting and recognizing typical vals for number base types.
    typical_max?: TBase extends number ? number : never;
    typical_min?: TBase extends number ? number : never;
    abs_min?: TBase extends number ? number : never;
    abs_max?: TBase extends number ? number : never;
}
