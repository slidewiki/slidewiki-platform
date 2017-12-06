import {BaseStore} from 'fluxible/addons';

class SSOStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.openModal = false;
        this.activeTrap = false;
        this.usernameExisting = false;
        this.errors = {};
    }

    getState(){
        return {
            openModal : this.openModal,
            activeTrap : this.activeTrap,
            usernameExisting: this.usernameExisting,
            errors: this.errors
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.openModal = state.openModal;
        this.usernameExisting = state.usernameExisting;
        this.errors = state.errors;
    }
    openExampleModal(payload){
        this.openModal = true;
        this.activeTrap = true;
        this.emitChange();

    }
    closeExampleModal(payload){
        this.openModal = false;
        this.activeTrap = false;
        this.emitChange();
    }

    error({type, err}) {
        this.errors[type] = err;
        this.emitChange();
    }

    checkedUsername(result) {
        this.usernameExisting = result;
        // console.log('SSOStore checkedUsername', result);
        this.emitChange();
    }

}
SSOStore.storeName = 'SSOStore';
SSOStore.handlers = {
  'SSO_MODAL_OPEN' : 'openExampleModal',
  'SSO_MODAL_CLOSE': 'closeExampleModal',
  'SSO_MODAL_ERROR': 'error',
  'SSO_MODAL_CHECKED_USERNAME': 'checkedUsername'
};

export default SSOStore;
