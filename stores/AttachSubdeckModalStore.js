import {BaseStore} from 'fluxible/addons';

class AttachSubdeckModalStore extends BaseStore{
    constructor(dispatcher) {
        super(dispatcher);
        this.userDecks = [];
        this.selectedDeckTitle='Select one deck...';
        this.selectedDeckId =-1;
    }

    getState(){
        return {
            userDecks : this.userDecks,
            selectedDeckTitle: this.selectedDeckTitle,
            selectedDeckId: this.selectedDeckId
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.userDecks = state.userDecks;
        this.selectedDeckTitle = state.selectedDeckTitle;
        this.selectedDeckId = state.selectedDeckId;
    }

    updateUserDecks(payload){

        Object.assign(this.userDecks, payload);
        this.emitChange();
    }

    updateSelectedDeck(payload){
        this.selectedDeckTitle = payload.selectedDeckTitle;
        this.selectedDeckId = payload.selectedDeckId;
        this.emitChange();



    }




}
AttachSubdeckModalStore.storeName = 'AttachSubdeckModalStore';
AttachSubdeckModalStore.handlers = {
    'ATTACHSUBDECK_LOAD_USERDECKS' : 'updateUserDecks',
    'ATTACHSUBDECK_SELECTED_DECK' : 'updateSelectedDeck'


};

export default AttachSubdeckModalStore;
