import {BaseStore} from 'fluxible/addons';

class AddDeckStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
    }
    destructor()
    {
    }
    getState() {
        return {

        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
    }
}

AddDeckStore.storeName = 'AddDeckStore';
AddDeckStore.handlers = {
};

export default AddDeckStore;
