import {Router, RouterEndpoint, ResponseFn, Connector} from "../Router";
import {TestConnector, TestEndpoint} from "../../tests/testUtil";
import pEvent from "p-event";


function setup() {
    const endpoint = new TestEndpoint();
    const router = new Router();
    const connector = new TestConnector();
    router.addConnector(connector);
    router.addEndpoint("uid", endpoint);
    router.route((data: Buffer) => data.toString());

    return {endpoint, router, connector};
}

it("routes a buffer", async () => {
    const {endpoint, router, connector} = setup();
    const pData = pEvent(endpoint, "data");

    connector.pushData(Buffer.from("uid"));
    expect(await pData).toEqual(Buffer.from("uid"));
})

it.skip("handles an unaddressed buffer", async () => {
    const {endpoint, router, connector} = setup();

    connector.pushData(Buffer.from("NO_ADDRESS"));
    //expect(await unaddressed).toEqual(bFrom("NO_ADDRESS"));
});


















