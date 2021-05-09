export class RuntimeIdProvider {
    private uid_rid_map: { [key: string]: number } = {};

    // Sets maximum number of allocatable IDs
    private rid_uid_map = new Array<string | undefined>(10).fill(undefined);

    /**
     * Allocates an ID linked to an input UID.
     */
    allocRid(uid: string): number | undefined {
        // If UID already connected, return allocated id.
        if (!uid) return undefined;

        if (this.uid_rid_map[uid] !== undefined) {
            return this.uid_rid_map[uid];
        }

        if (uid.length < 3) {
            throw new Error("UIDs must be at least 3 characters!")
        }

        //Get index of undefined to find first unallocated rID
        const i = this.rid_uid_map.indexOf(undefined);

        if (i < 0) {
            return undefined;
        }

        this.uid_rid_map[uid] = i;
        this.rid_uid_map[i] = uid;

        return i;
    }

    deallocRid(rid: number)
    deallocRid(uid: string)
    deallocRid(id: string | number): boolean {
        if (typeof id === "number") {
            if (!this.containsRid(id)) return;

            const uid = this.rid_uid_map[id]
            delete this.rid_uid_map[id];
            delete this.uid_rid_map[uid];

            return true;
        } else if (typeof id === "string") {
            if (!this.containsUid(id)) return;

            const rid = this.uid_rid_map[id]
            delete this.rid_uid_map[rid];
            delete this.uid_rid_map[id];

            return true;
        } else {
            return false;
            //throw new Error(`Couldn't deallocate from ${id}`);
        }
    }

    resolveUidFromRid(rid: number): string {
        return this.rid_uid_map[rid];
    }

    resolveRidFromUid(uid: string): number {
        return this.uid_rid_map[uid];
    }

    containsUid(uid: string) {
        return this.uid_rid_map[uid] !== undefined;
    }

    containsRid(rid: number) {
        return this.rid_uid_map[rid] !== undefined;
    }
}
