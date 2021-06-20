import {MutableProxy} from "../MutableProxy";

it("simple use case", () => {
    const mp = new MutableProxy();
    const obj = {
        v1: 1,
        v2: "test",
        v3: [1, 2, 3]
    };
    const prev = {...obj};
    const expected = {
        v1: 4,
        v2: "test",
        v3: [4, 5, 6]
    }

    const p = new Proxy<typeof obj>(obj, mp);

    p.v1 = expected.v1;
    p.v2 = expected.v2;
    p.v3 = expected.v3;

    expect(obj).toEqual(expected); // Check original HAS mutated

    //Check MutableProxy fields
    expect(mp.current).toEqual(expected)
    expect(mp.previous).toEqual(prev)
    expect(mp.patch).toEqual({v1: expected.v1, v3: expected.v3});
});
