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
        this.errorMessageFinalize = '';
        this.userid = 0;
        this.register = false;
        this.username = '';
        this.hash = '';
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
            errorMessage: this.errorMessage,
            errorMessageFinalize: this.errorMessageFinalize,
            userid: this.userid,
            register: this.register,
            username: this.username,
            hash: this.hash
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
        this.errorMessageFinalize = state.errorMessageFinalize;
        this.userid = state.userid;
        this.register = state.register;
        this.username = state.username;
        this.hash = state.hash;
    }
    openModalMethod(payload){
        this.openModal = true;
        this.activeTrap = true;
        this.register = payload.register;
        this.emitChange();

    }
    closeModal(payload){
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
        // console.log('SSOStore initiate', data);
        this.emitChange();
    }

    saveSignInData(data) {
        this.jwt = data.jwt;
        this.userid = JSON.parse(data.data).userid;
        this.emitChange();
    }

    signInError(err) {
        this.errorMessage = err.message;
        this.emitChange();
    }

    newData(data) {
        this.username = data.username;
        this.email = data.email;
        this.hash = data.hash;
        this.emitChange();
    }

    handleFinalizeError(err) {
        this.errorMessage = err.message;
        this.emitChange();
    }

}
SSOStore.storeName = 'SSOStore';
SSOStore.handlers = {
    'SSO_MODAL_OPEN' : 'openModalMethod',
    'SSO_MODAL_CLOSE': 'closeModal',
    'SSO_MODAL_ERROR': 'error',
    'SSO_MODAL_CHECKED_EMAIL': 'checkedEmail',
    'SSO_INITIATE': 'initiate',
    'SSO_SIGNIN_SUCCESS': 'saveSignInData',
    'SSO_SIGNIN_ERROR': 'signInError',
    'SSO_NEW_DATA': 'newData',
    'SSO_FINALIZE_FAILURE': 'handleFinalizeError'
};

export default SSOStore;
