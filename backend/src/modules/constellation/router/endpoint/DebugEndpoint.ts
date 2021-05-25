import {ResponseFn, RouterEndpoint} from "../Router";

export class DebugEndpoint implements RouterEndpoint {
    push(data: Buffer, respond: ResponseFn): void {
        console.log(data);
    }
}
