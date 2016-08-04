import {BaseStore} from 'fluxible/addons';

class ContentModulesStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.moduleType = 'questions';
        this.selector = {};
    }
    updateContentModules(payload) {
        this.moduleType = payload.moduleType;
        this.selector = payload.selector;
        this.emitChange();
    }

    updateModuleType(payload) {
        this.moduleType = payload.moduleType;
        this.emitChange();
    }
    getState() {
        return {
            moduleType: this.moduleType,
            selector: this.selector
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.moduleType = state.moduleType;
        this.selector = state.selector;
    }
}

ContentModulesStore.storeName = 'ContentModulesStore';
ContentModulesStore.handlers = {
    'LOAD_CONTENT_MODULES_SUCCESS': 'updateContentModules',
    'UPDATE_MODULE_TYPE_SUCCESS': 'updateModuleType'
};

export default ContentModulesStore;
