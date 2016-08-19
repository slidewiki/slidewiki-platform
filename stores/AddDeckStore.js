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
        this.redirectID = 0;
        this.error = null;
    }
    destructor()
    {
        this.wrongFields = {
            title: false,
            language: false,
            licence: false,
            conditions: false
        };
        this.redirectID = 0;
        this.error = null;
    }
    getState() {
        return {
            wrongFields: this.wrongFields,
            redirectID: this.redirectID,
            error: this.error
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.wrongFields = state.wrongFields;
        this.redirectID = state.redirectID;
        this.error = state.error;
    }

    showWrongFields(wF) {
        this.wrongFields.title = wF.title;
        this.wrongFields.language = wF.language;
        this.wrongFields.licence = wF.licence;
        this.wrongFields.conditions = wF.conditions;

        this.emitChange();
    }
    creationFailure(error) {
        console.log('store - error', error.statusCode);
        this.error = error;

        this.emitChange();
    }
    creationSuccess(deck) {
        this.redirectID = Number.parseInt(deck.id);

        this.emitChange();
    }
}

AddDeckStore.storeName = 'AddDeckStore';
AddDeckStore.handlers = {
    'SHOW_WRONG_FIELDS': 'showWrongFields',
    'CREATION_FAILURE': 'creationFailure',
    'CREATION_SUCCESS': 'creationSuccess',
    'DESTRUCT': 'destructor'
};

export default AddDeckStore;
