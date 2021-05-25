export let readonlyProxy = {
    setProperty: function(target, key, value){
        if(target.hasOwnProperty(key))
            return target[key];
    },
    get: function(target, key){
        return target[key];
    },
    set: function(target, key, value){
        return this.setProperty(target, key, value);
    },
    defineProperty: function (target, key, desc) {
        return this.setProperty(target, key, desc.value);
    },
    deleteProperty: function(target, key) {
        return false;
    }
}
