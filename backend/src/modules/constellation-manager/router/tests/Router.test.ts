import {Router, RouterEndpoint, ResponseFn, Connector} from "../Router";
import {DeferredPromise} from "bc/util";
import {TestConnector, TestEndpoint} from "../../tests/testUtil";


const bFrom = Buffer.from;

function setup() {
    const endpoint = new TestEndpoint();
    const router = new Router();
    const connector = new TestConnector();
    const unaddressed = new DeferredPromise();
    router.addConnector(connector);
    router.addEndpoint("uid", endpoint);
    router.route((data: Buffer) => data.toString());
    router.handleUnrouted((data) => unaddressed.resolve(data));


    return {endpoint, router, connector, unaddressed};
}

it("routes a buffer", async () => {
    const {endpoint, router, connector, unaddressed} = setup();

    connector.pushData(bFrom("uid"));
    expect(await endpoint.data).toEqual(bFrom("uid"));
})

it("handles an unaddressed buffer", async () => {
    const {endpoint, router, connector, unaddressed} = setup();

    connector.pushData(bFrom("NO_ADDRESS"));
    expect(await unaddressed).toEqual(bFrom("NO_ADDRESS"));
});


















