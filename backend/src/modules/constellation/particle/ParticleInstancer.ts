import {IParticleTypeDefinition, ISystemParticleDefinition} from "../interfaces";
import {Particle} from "./Particle";
import {RIDRegistry} from "../runtime-id-registry/RIDRegistry";

export class ParticleInstancer {
    tDefs: IParticleTypeDefinition<any>[];
    ridReg: RIDRegistry;

    constructor(tDefs: IParticleTypeDefinition<any>[], ridReg: RIDRegistry) {
        this.tDefs = tDefs;
        this.ridReg = ridReg
    }

    construct<S>(pDef: ISystemParticleDefinition<S>) {
        const tDef = this.tDefs.find(d => d.typeName === pDef.typeName) as IParticleTypeDefinition<S> | undefined;

        if (!tDef)
            throw new Error(`Could not construct particle with type ${pDef.typeName} - no type definition found.`);

        return new Particle()
            .setRid(this.ridReg.allocRid(pDef.uid))
            .setTDef(tDef)
            .setPDef(pDef);
    }
}
