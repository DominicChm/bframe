import {IModuleTypeDefinition} from "./IModuleTypeDefinition";

export class ParticleDefinitionRegistry {
    private particle_definitions: IModuleTypeDefinition[] = [];

    public registerDefinition(def: IModuleTypeDefinition) {
        this.particle_definitions.push(def);
    }

    /**
     * Returns the definition for a name, if one exists.
     * @param name The definition name to search for
     */
    public getDefByTypename(name: string): IModuleTypeDefinition | undefined {
        return this.particle_definitions.find(def => def.name === name);
    }
}
