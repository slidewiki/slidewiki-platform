import {BaseStore} from 'fluxible/addons';

class AddDeckStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.wrongFields = {
            title: false,
            language: false,
            licence: false,
            conditions: false
        };
    }
    destructor()
    {
        this.wrongFields = {
            title: false,
            language: false,
            licence: false,
            conditions: false
        };
    }
    getState() {
        return {
            wrongFields: this.wrongFields
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.wrongFields = state.wrongFields;
    }

    showWrongFields(wF) {
        this.wrongFields.title = wF.title;
        this.wrongFields.language = wF.language;
        this.wrongFields.licence = wF.licence;
        this.wrongFields.conditions = wF.conditions;

        this.emitChange();
    }
}

AddDeckStore.storeName = 'AddDeckStore';
AddDeckStore.handlers = {
    'SHOW_WRONG_FIELDS': 'showWrongFields'
};

export default AddDeckStore;
