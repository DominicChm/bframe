import {Particle} from "./Particle";

export interface ParticleEventEmitter<S> {
    on(event: "patch", listener: (patch: Partial<S>, particle: Particle<S>) => void): this;

    on(event: "state", listener: (state: S, particle: Particle<S>) => void): this;

    on(event: "change", listener: (current: S, patch: Partial<S>, previous: S, particle: Particle<S>) => void): this;

    on(event: "connect", listener: (particle: Particle<S>) => void): this;

    on(event: "disconnect", listener: (particle: Particle<S>) => void): this;
}
