import {CType} from "c-type-util";
import {IDerivedValue} from "./IDerivedValue";

type js_type_strings = "object" | "number" | "string" | "bigint"

export interface IVariableDefinition<TBase> {

    /**
     * The JS typename
     */
    js_type: js_type_strings;

    /**
     * Defines who "owns" this variable. Only the owner can mutate its value.
     */
    owner: "particle" | "server";

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
    cType: CType<TBase>;

    /**
     * An array of {@link IDerivedValue}[IDerivedValues], used to specify transformations to and from
     * more user-friendly data
     */
    derived?: IDerivedValue<TBase, unknown>[];

    /**
     * A user-defined function that returns true if the base value is currently atypical.
     * TODO: PASS IN ENTIRE STATE TO ALLOW USE OF OTHER VARIABLES
     */
    outside_typical?: (raw_val: TBase, variable_definition: IVariableDefinition<TBase>) => boolean;

    /**
     * A function that returns true if the base value is critically incorrect
     * (Like engine speed being above 12,000 RPM).
     * TODO: PASS IN ENTIRE STATE TO ALLOW USE OF OTHER VARIABLES
     */
    outside_abs?: (raw_val: TBase, variable_definition: IVariableDefinition<TBase>) => boolean;

    /**
     * Allows limiting of data
     */
    limit?: (raw_val: TBase, variable_definition: IVariableDefinition<TBase>) => TBase;

    //Fields that can automatically take care of limiting and recognizing typical vals for number base types.
    typical_max?: TBase extends number ? number : never;
    typical_min?: TBase extends number ? number : never;
    abs_min?: TBase extends number ? number : never;
    abs_max?: TBase extends number ? number : never;
}
