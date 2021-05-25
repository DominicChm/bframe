export class RIDRegistry {
    private uidRidMap: { [key: string]: number } = {};

    // Sets maximum number of allocatable IDs
    private ridUidMap = new Array<string | undefined>(10).fill(undefined);

    constructor() {
        this.ridUidMap[0] = null; //Prevent 0 from being allocated as an RID - 0 signifies no RID.
    }

    /**
     * Allocates an ID linked to an input UID.
     */
    allocRid(uid: string): number | undefined {
        // If UID already connected, return allocated id.
        if (!uid) return undefined;

        if (this.uidRidMap[uid] !== undefined) {
            return this.uidRidMap[uid];
        }

        if (uid.length < 3) {
            throw new Error("UIDs must be at least 3 characters!")
        }

        //Get index of undefined to find first unallocated rID
        const i = this.ridUidMap.indexOf(undefined);

        if (i < 0) {
            return undefined;
        }

        this.uidRidMap[uid] = i;
        this.ridUidMap[i] = uid;

        return i;
    }

    deallocRid(rid: number)
    deallocRid(uid: string)
    deallocRid(id: string | number): boolean {
        if (typeof id === "number") {
            if (!this.containsRid(id)) return;

            const uid = this.ridUidMap[id]
            delete this.ridUidMap[id];
            delete this.uidRidMap[uid];

            return true;
        } else if (typeof id === "string") {
            if (!this.containsUid(id)) return;

            const rid = this.uidRidMap[id]
            delete this.ridUidMap[rid];
            delete this.uidRidMap[id];

            return true;
        } else {
            return false;
            //throw new Error(`Couldn't deallocate from ${id}`);
        }
    }

    resolveUidFromRid(rid: number): string {
        return this.ridUidMap[rid];
    }

    resolveRidFromUid(uid: string): number {
        return this.uidRidMap[uid];
    }

    containsUid(uid: string) {
        return this.uidRidMap[uid] !== undefined;
    }

    containsRid(rid: number) {
        return this.ridUidMap[rid] !== undefined;
    }
}
