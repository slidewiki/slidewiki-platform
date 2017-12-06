import {BaseStore} from 'fluxible/addons';

class SSOStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.openModal = false;
        this.activeTrap = false;
    }

    getState(){
        return {
            openModal : this.openModal,
            activeTrap : this.activeTrap
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.openModal = state.openModal;

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



}
SSOStore.storeName = 'SSOStore';
SSOStore.handlers = {
  'SSO_MODAL_OPEN' : 'openExampleModal',
  'SSO_MODAL_CLOSE': 'closeExampleModal'

};

export default SSOStore;
