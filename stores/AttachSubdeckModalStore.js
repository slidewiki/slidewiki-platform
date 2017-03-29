import {BaseStore} from 'fluxible/addons';

class AttachSubdeckModalStore extends BaseStore{
    constructor(dispatcher) {
        super(dispatcher);
        this.userDecks = [];
    }

    getState(){
        return {
            userDecks : this.userDecks
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.userDecks = state.userDecks;

    }

    updateUserDecks(payload){
        this.userDecks = payload.userDecks;
    }




}
AttachSubdeckModalStore.storeName = 'AttachSubdeckModalStore';
AttachSubdeckModalStore.handlers = {
    'ATTACHSUBDECK_LOAD_USERDECKS' : 'updateUserDecks',


};

export default AttachSubdeckModalStore;
