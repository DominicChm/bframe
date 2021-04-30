import {ICType} from "c-type-util";
import {IDerivedValue} from "./IDerivedValue";

export interface IVariableDefinition {
    symbol: string;
    readable_name: string;
    description: string;
    c_type: ICType;
    derived?: IDerivedValue[];
    abs_min?: number;
    abs_max?: number;
    limit?: (raw_val: any, variable_definition: IVariableDefinition) => any;
    typical_max?: number;
    typical_min?: number;
    outside_typical?: (raw_val: any, variable_definition: IVariableDefinition) => boolean;
}



