import {IParticleTypeDefinition} from "../interfaces";

export class ParticleDefinitionRegistry {
    private particle_definitions: IParticleTypeDefinition<any, any>[] = [];

    public registerDefinition(def: IParticleTypeDefinition<any, any>) {
        this.particle_definitions.push(def);
    }

    /**
     * Returns the definition for a name, if one exists.
     * @param name The definition name to search for
     */
    public getDefByTypename(name: string): IParticleTypeDefinition<any, any> | undefined {
        return this.particle_definitions.find(def => def.typeName === name);
    }
}
