/**
 * Created by lfernandes on 12.03.17.
 */
import {BaseStore} from 'fluxible/addons';

class SendReportStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.wrongFields = {
            reason: false,
            text: false,
            name: false
        };
        this.error = null;

        this.openModal = false;
        this.activeTrap = false;
    }

    destructor() {
        this.wrongFields = {
            reason: false,
            text: false,
            name: false
        };
        this.error = null;
        this.openModal = false;
        this.activeTrap = false;
    }

    getState() {
        return {
            wrongFields: this.wrongFields,
            error: this.error,
            openModal: this.openModal,
            activeTrap: this.activeTrap
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.wrongFields = state.wrongFields;
        this.error = state.error;
        this.openModal = state.openModal;
        this.activeTrap = state.activeTrap;
        this.emitChange();
    }

    openReportModal(payload){
        this.openModal = true;
        this.activeTrap = true;
        this.emitChange();
    }

    closeReportModal(payload){
        this.openModal = false;
        this.activeTrap = false;
        this.emitChange();
    }

    showWrongFields(wF) {
        this.wrongFields.reason = wF.reason;
        this.wrongFields.text = wF.text;
        this.wrongFields.name = wF.name;

        this.emitChange();
    }
}

SendReportStore.storeName = 'SendReportStore';
SendReportStore.handlers = {
    'REPORT_SHOW_WRONG_FIELDS': 'showWrongFields',
    'REPORT_MODAL_OPEN': 'openReportModal',
    'REPORT_MODAL_CLOSE': 'closeReportModal'
    //'CREATION_FAILURE': 'creationFailure',
    //'CREATION_SUCCESS': 'creationSuccess',
};


export default SendReportStore;
