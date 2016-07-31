import {BaseStore} from 'fluxible/addons';

class MigrateStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.password = 'rfhfvtkm123';
    }
    destructor()
    {
        this.password = '';
    }
    getState() {
        return {
            password: this.password
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.password = state.password;
    }
}

MigrateStore.storeName = 'MigrateStore';
MigrateStore.handlers = {

};

export default MigrateStore;
