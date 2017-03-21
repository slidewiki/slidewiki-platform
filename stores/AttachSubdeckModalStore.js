import {BaseStore} from 'fluxible/addons';

class AttachSubdeckModalStore extends BaseStore{
    constructor(dispatcher) {
        super(dispatcher);
        this.openModal = false;
        this.activeItem = 'MyDecks';
        this.activeTrap = false;
    }

    getState(){
        return {
            openModal : this.openModal,
            activeItem : this.activeItem,
            activeTrap : this.activeTrap
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.openModal = state.openModal;

    }
    openSubDeckModal(payload){
        this.openModal = true;
        this.activeTrap = true;
        this.emitChange();

    }
    closeSubDeckModal(payload){
        this.openModal = false;
        this.activeTrap = false;
        this.emitChange();
    }



}
AttachSubdeckModalStore.storeName = 'AttachSubdeckModalStore';
AttachSubdeckModalStore.handlers = {
    'ATTACHSUBDECKMODAL_OPEN' : 'openSubDeckModal',
    'ATTACHSUBDECKMODAL_CLOSE': 'closeSubDeckModal'

};

export default AttachSubdeckModalStore;
