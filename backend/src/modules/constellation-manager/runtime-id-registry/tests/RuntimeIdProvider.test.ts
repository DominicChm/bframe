import {RIDRegistry} from "../RIDRegistry";
import {v4 as uuidv4} from 'uuid';

function setup() {
    const rip = new RIDRegistry();
    const uid1 = uuidv4();
    const uid2 = uuidv4();

    const rid1 = rip.allocRid(uid1);
    const rid2 = rip.allocRid(uid2);
    return {rip, uid1, uid2, rid1, rid2}
}


it("doesn't create new RIDs for duplicate UIDs", () => {
    const r = setup();

    expect(r.rip.allocRid(r.uid1)).toBe(r.rid1);
    expect(r.rip.allocRid(r.uid2)).toBe(r.rid2);
});

it("resolves RIDs", () => {
    const r = setup();

    expect(r.rip.resolveRidFromUid(r.uid1)).toBe(r.rid1);
    expect(r.rip.resolveRidFromUid(r.uid2)).toBe(r.rid2);
});

it("resolves UUIDs", () => {
    const r = setup();

    expect(r.rip.resolveUidFromRid(r.rid1)).toBe(r.uid1);
    expect(r.rip.resolveUidFromRid(r.rid2)).toBe(r.uid2);
});

it("contains RID", () => {
    const r = setup();

    expect(r.rip.containsRid(r.rid1)).toBe(true);
    expect(r.rip.containsRid(-5)).toBe(false);
});


it("contains UID", () => {
    const r = setup();

    expect(r.rip.containsUid(r.uid1)).toBe(true);
    expect(r.rip.containsUid("")).toBe(false);
});

it("deallocates IDs", () => {
    const r = setup();

    expect(r.rip.deallocRid(r.uid1)).toBeTruthy();
    expect(r.rip.resolveRidFromUid(r.uid1)).toBeUndefined()

    expect(r.rip.deallocRid(r.uid2)).toBeTruthy();
    expect(r.rip.resolveRidFromUid(r.uid2)).toBeUndefined()

    expect(r.rip.deallocRid(r.uid2)).toBeFalsy();
});

it("handles undefined", () => {
    const r = setup();

    expect(r.rip.containsRid(undefined)).toBe(false);
    expect(r.rip.containsUid(undefined)).toBe(false);
    expect(r.rip.allocRid(undefined)).toBeUndefined();
    expect(r.rip.deallocRid(undefined)).toBeFalsy();
    expect(r.rip.resolveRidFromUid(undefined)).toBeUndefined();
    expect(r.rip.resolveUidFromRid(undefined)).toBeUndefined();
});

it("throws for short UIDs", () => {
    const r = setup();
    expect(() => r.rip.allocRid("s")).toThrow();
});
