import {BaseStore} from 'fluxible/addons';

class AddDeckStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.wrongFields = {
            title: false,
            language: false,
            license: false,
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
            license: false,
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
        this.wrongFields.license = wF.license;
        this.wrongFields.conditions = wF.conditions;

        this.emitChange();
    }
    creationFailure(error) {
        console.log('store - error', error.statusCode);

        this.error = error;
        this.error.actionRequired = 'Restart your action.';

        try {
            const errorBody = JSON.parse(error.body.message.substr(6));

            this.error.type = errorBody.error;
            this.error.description = errorBody.message;
        } catch (e) {
            this.error.description = error.message;
        }

        this.emitChange();
    }
    creationSuccess(deck) {
        this.redirectID = Number.parseInt(deck.id ? deck.id : deck._id);

        this.emitChange();
    }
    deleteError() {
        this.error = null;
        this.emitChange();
    }
}

AddDeckStore.storeName = 'AddDeckStore';
AddDeckStore.handlers = {
    'SHOW_WRONG_FIELDS': 'showWrongFields',
    'CREATION_FAILURE': 'creationFailure',
    'CREATION_SUCCESS': 'creationSuccess',
    'DESTRUCT': 'destructor',
    'DELETE_ERROR': 'deleteError'
};

export default AddDeckStore;
