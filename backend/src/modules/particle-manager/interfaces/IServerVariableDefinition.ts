import {IVariableDefinition} from "./IVariableDefinition";

export interface IServerVariableDefinition<VariableSymbol extends string, TBase>
    extends IVariableDefinition<VariableSymbol, TBase> {
    /**
     * Allows limiting of only outgoing data.
     */
    limit?: (raw_val: TBase, variable_definition: IVariableDefinition<VariableSymbol, TBase>) => TBase;
}
