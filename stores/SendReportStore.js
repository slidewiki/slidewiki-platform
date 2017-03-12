/**
 * Created by lfernandes on 12.03.17.
 */
import {BaseStore} from 'fluxible/addons';

class SendReportStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.wrongFields = {
            reason: false,
            text: false
        };
        this.error = null;
    }

    destructor() {
        this.wrongFields = {
            reason: false,
            text: false
        };
        this.error = null;
    }

    getState() {
        return {
            wrongFields: this.wrongFields,
            error: this.error
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.wrongFields = state.wrongFields;
        this.error = state.error;
    }

    showWrongFields(wF) {
        this.wrongFields.reason = wF.reason;
        this.wrongFields.text = wF.text;

        this.emitChange();
    }
}

SendReportStore.storeName = 'AddDeckStore';
SendReportStore.handlers = {
    'REPORT_SHOW_WRONG_FIELDS': 'showWrongFields',
    'CREATION_FAILURE': 'creationFailure',
    'CREATION_SUCCESS': 'creationSuccess',
};

export default SendReportStore;
