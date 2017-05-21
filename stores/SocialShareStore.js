import {BaseStore} from 'fluxible/addons';

class SocialShareStore extends BaseStore {

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

    openMailShareModal(payload){
        this.openModal = true;
        this.activeTrap = true;
        this.emitChange();
    }

    closeMailShareModal(payload){
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

SocialShareStore.storeName = 'SocialShareStore';
SocialShareStore.handlers = {
    'MAIL_SHARE_SHOW_WRONG_FIELDS': 'showWrongFields',
    'MAIL_SHARE_MODAL_OPEN': 'openMailShareModal',
    'MAIL_SHARE_MODAL_CLOSE': 'closeMailShareModal'
};


export default SocialShareStore;
