import {cloneDeep} from "lodash"

export let mutableProxy = function <T extends Object>(
    onModified: (currentState: T, prevState: T | undefined, patch: Partial<T>) => void
): ProxyHandler<T> {
    let currentState: T;
    let prevState: T;
    let patch: Partial<T> = {};

    let callbackQueued = false;

    //Called after the function that is mutating the object is finished using `process.nexttick` magic.
    function onMutationFinish() {
        callbackQueued = false;

        onModified(currentState, prevState, patch);

        prevState = cloneDeep(currentState)
        patch = {};
    }

    function queueOnFinish() {
        if (!callbackQueued) {
            process.nextTick(onMutationFinish);
            callbackQueued = true;
        }
    }


    return {
        get: function (target, key) {
            currentState = target;

            //TODO: Attach proxy to internal objects to update patch for nested changes.
            return target[key];

        },
        set: function (target, key, value) {
            currentState = target;
            console.log("set")
            //Only set existing fields.
            if (target[key] !== undefined) {
                target[key] = value;
                patch[key] = value;

                //On modification, register the callback to run after the function that's mutating the object currently
                //is finished.
                queueOnFinish();
                return true;
            }
            return false;
        },
        defineProperty: function (target, key, desc) {
            currentState = target;
            return false;
        },
        deleteProperty: function (target, key) {
            currentState = target;
            return false;
        }
    }

}



