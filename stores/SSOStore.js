import {BaseStore} from 'fluxible/addons';

class SSOStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.openModal = false;
        this.activeTrap = false;
        this.emailExisting = false;
        this.errors = {};
        this.instance = '';
        this.email = '';
        this.jwt = '';
        this.errorMessage = '';
    }

    getState(){
        return {
            openModal : this.openModal,
            activeTrap : this.activeTrap,
            emailExisting: this.emailExisting,
            errors: this.errors,
            instance: this.instance,
            email: this.email,
            jwt: this.jwt,
            errorMessage: this.errorMessage
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.openModal = state.openModal;
        this.emailExisting = state.emailExisting;
        this.errors = state.errors;
        this.instance = state.instance;
        this.email = state.email;
        this.jwt = state.jwt;
        this.errorMessage = state.errorMessage;
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

    checkedEmail(result) {
        this.emailExisting = result;
        // console.log('SSOStore checkedemail', result);
        this.emitChange();
    }

    initiate(data) {
        this.instance = data.instance;
        this.email = data.email;
        this.emitChange();
    }

    saveJWT(jwt) {
        this.jwt = jwt;
        this.emitChange();
    }

    signInError(err) {
        this.errorMessage = err.message;
        this.emitChange();
    }

}
SSOStore.storeName = 'SSOStore';
SSOStore.handlers = {
  'SSO_MODAL_OPEN' : 'openExampleModal',
  'SSO_MODAL_CLOSE': 'closeExampleModal',
  'SSO_MODAL_ERROR': 'error',
  'SSO_MODAL_CHECKED_EMAIL': 'checkedEmail',
  'SSO_INITIATE': 'initiate',
  'SSO_SIGNIN_SUCCESS': 'saveJWT',
  'SSO_SIGNIN_ERROR': 'signInError'
};

export default SSOStore;
