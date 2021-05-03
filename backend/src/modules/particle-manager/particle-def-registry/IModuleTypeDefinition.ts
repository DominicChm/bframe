import {IVariableDefinition} from "./IVariableDefinition";

export interface IModuleTypeDefinition {
    name: string;

    readable_name: string;
    description: string;

    client_vars: IVariableDefinition[];
    server_vars: IVariableDefinition[];
}
