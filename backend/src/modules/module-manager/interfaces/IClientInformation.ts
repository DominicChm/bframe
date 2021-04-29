import {IModuleTypeDefinition} from "../ModuleTypeRegistry/IModuleTypeDefinition";

export interface IClientInformation {
    id: number;
    type: string;
    uid: string;
    definition: IModuleTypeDefinition;
}
