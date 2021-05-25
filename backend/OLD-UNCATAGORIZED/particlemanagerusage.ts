
const con = new Constellation();
con.load(systemDef);

interface stateEvent {
    prevState: Object;
    state: Object;
    patch: Object;
    time: BigInt;
}

interface ConnectionEvent {
    uid: string
}

con.particle("uid")
    .patch((state) => {
        state.test = 1
        state.val2 = "kek";
    });

con.particle("uid")
    .on("state", (stateEvent: Buffer) => {
    })
    .on("connect", () => {
    })

con.particles() // => [ParticleManager, ParticleManager];

con.on("stateEvent", (data: DataEvent) => {
})

con.on("connection", (particle: Particle) => {
})
