async function* gen() {
    console.log("GEN RUNNING");

    yield "FUCKING COCKSUCKING BULLSHIT FUCKSICLE"
}

function *gen2() {
    console.log("NON-ASYNC GEN");
    yield Promise.resolve("DAKNASJDBN")
}

async function NotAGen() {
    console.log("NotAGen RUNNING");
}

(async () => {
    const g = gen();
    const ng = gen2();

    NotAGen();
    console.log("AFTER GENERATOR INIT");
    console.log(await g.next())
    console.log(await ng.next())
})()
