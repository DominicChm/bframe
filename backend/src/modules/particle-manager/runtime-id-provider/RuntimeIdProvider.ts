export class RuntimeIdProvider {
    private uid_rid_map: { [key: string]: number } = {};

    // Sets maximum number of allocatable IDs
    private rid_uid_map = new Array<string | undefined>(10).fill(undefined);

    /**
     * Allocates an ID linked to an input UID.
     */
    allocRid(uid: string): number {
        if (this.uid_rid_map[uid]) { // If UID already connected, return allocated id.
            return this.uid_rid_map[uid];
        }

        const i = this.rid_uid_map.indexOf(undefined); //Get index of undefined to find unused rID

        if (i < 0) {
            throw new Error("No IDs left to assign!");
        }

        this.uid_rid_map[uid] = i;
        this.rid_uid_map[i] = uid;

        return i;
    }

    deallocRid(uid: string) {
        throw new Error("unimplemented")
    }

    resolveUidFromRid(rid: number): string {
        return this.rid_uid_map[rid];
    }

    resolveRidFromUid(uid: string): number {
        return this.uid_rid_map[uid];
    }
}
