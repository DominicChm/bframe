import findProcess from "find-process"
import {startInflux} from "../startProcess";

describe("Influxd bootstrapper", () => {
    it("starts influxd.exe", async () => {
        const isRunning = async () => (await findProcess("name", "influxd", true)).length > 0;

        if (await isRunning())
            throw new Error("Influxd is already running! Please kill it!")

        await startInflux();

        expect(await isRunning()).toBeTruthy();

    })
})
