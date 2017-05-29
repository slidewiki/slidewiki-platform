import {BaseStore} from 'fluxible/addons';
import { isEmpty } from '../common.js';

class AttachSubdeckModalStore extends BaseStore{
    constructor(dispatcher) {
        super(dispatcher);
        this.userDecks = [];
        this.recentDecks = [];
        this.searchDecks =[];
        this.selectedDeckTitle='Select one deck...';
        this.selectedDeckId =-1;
        this.showSearchResults = false;
        this.activeItem = 'MyDecks';
    }

    getState(){
        return {
            userDecks : this.userDecks,
            recentDecks: this.recentDecks,
            searchDecks: this.searchDecks,
            selectedDeckTitle: this.selectedDeckTitle,
            selectedDeckId: this.selectedDeckId,
            showSearchResults: this.showSearchResults,
            activeItem: this.activeItem

        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.userDecks = state.userDecks;
        this.recentDecks = state.recentDecks;
        this.searchDecks = state.searchDecks;
        this.selectedDeckTitle = state.selectedDeckTitle;
        this.selectedDeckId = state.selectedDeckId;
        this.showSearchResults = state.showSearchResults;
        this.activeItem = state.activeItem;
    }

    updateUserDecks(payload){
        this.userDecks = payload;
        //Object.assign(this.userDecks, payload);
        this.emitChange();
    }

    updateSelectedDeck(payload){
        this.selectedDeckTitle = payload.selectedDeckTitle;
        this.selectedDeckId = payload.selectedDeckId;
        this.emitChange();
    }
    updateRecentDecks(payload){
        if(payload.recent===[]){
            this.recentDecks =[];
        } else{
            let recentDecks = payload.recent.map((deck) => {

                return({
                    title: !isEmpty(deck.title) ? deck.title : 'No Title',
                    picture: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Business_presentation_byVectorOpenStock.jpg',
                    description: !isEmpty(deck.description) ? deck.description : 'No Description',
                    //updated: !isEmpty(deck.lastUpdate) ? deck.lastUpdate : (new Date()).setTime(1).toISOString(),
                    updated:deck.lastUpdate,
                    //creationDate: !isEmpty(deck.timestamp) ? deck.timestamp : (new Date()).setTime(1).toISOString(),
                    creationDate: deck.timestamp,
                    deckID: deck._id,
                    firstSlide: deck.firstSlide,
                    language:deck.language,
                    countRevisions:deck.countRevisions,
                    deckCreatorid:deck.user,
                    deckCreator:deck.username

                });

            }); //map
            this.recentDecks = recentDecks;
            //Object.assign(this.recentDecks, recentDecks);
        }
        this.emitChange();
    }

    updateSearchDecks(payload){
        if((payload.docs===[])||(typeof payload.docs === 'undefined')){
            this.searchDecks =[];
            this.showSearchResults = true;

        }else{

            let searchDecks = payload.docs.map((deck) => {

                return({
                    title: !isEmpty(deck.title) ? deck.title : 'No Title',
                    picture: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Business_presentation_byVectorOpenStock.jpg',
                    description: !isEmpty(deck.description) ? deck.description : 'No Description',
                    updated:deck.lastUpdate,
                    creationDate: deck.timestamp,
                    deckID: deck.db_id,
                    firstSlide: deck.firstSlide,
                    language:deck.language,
                    countRevisions:deck.revisionsCount,
                    deckCreatorid:deck.creator,
                    deckCreator:deck.user.username
                });
            });//map

            this.searchDecks = searchDecks;
            this.showSearchResults = true;
        }
        this.emitChange();
    }
    resetModalStore(){
        this.userDecks = [];
        this.recentDecks = [];
        this.searchDecks = [];
        this.selectedDeckTitle = 'Select one deck...';
        this.selectedDeckId = -1;
        this.showSearchResults = false;
        this.activeItem = 'MyDecks';

        this.emitChange();
    }
    initModal(){
        this.selectedDeckTitle = 'Select one deck...';
        this.selectedDeckId = -1;
        this.showSearchResults = false;
        this.activeItem = 'MyDecks';

        this.emitChange();
    }

    updateActiveItem(payload){
        this.activeItem = payload.activeItem;

        this.emitChange();
    }





}
AttachSubdeckModalStore.storeName = 'AttachSubdeckModalStore';
AttachSubdeckModalStore.handlers = {
    'ATTACHSUBDECK_LOAD_USERDECKS' : 'updateUserDecks',
    'ATTACHSUBDECK_SELECTED_DECK' : 'updateSelectedDeck',
    'ATTACHSUBDECK_LOAD_RECENTDECKS': 'updateRecentDecks',
    'ATTACHSUBDECK_LOAD_SEARCHDECKS' : 'updateSearchDecks',
    'ATTACHSUBDECK_RESET':'resetModalStore',
    'ATTACHSUBDECK_INIT' :'initModal',
    'ATTACHSUBDECK_ACTIVE_ITEM' :'updateActiveItem',

};

export default AttachSubdeckModalStore;
