import {BaseStore} from 'fluxible/addons';
import { isEmpty } from '../common.js';
import { isNullOrUndefined } from 'util';

class AttachQuestionsModalStore extends BaseStore{
    constructor(dispatcher) {
        super(dispatcher);
        this.userDecks = [];
        this.recentDecks = [];
        this.searchDecks =[];
        this.selectedDeckTitle = ''; /*nikki 'Select the deck you wish to attach...'; */
        this.selectedDeckId =-1;
        this.showSearchResults = false;
        this.showQuestions = false; /*nikki changed away from true */
        this.showOptions = false;
        this.showWarning = false;
        this.activeItem = 'CurrentDeck';
        this.deckQuestions = [];
        this.selectedQuestions = []; /*nikki for storing the questions that have been selected for insertion */
        this.currentDeckId = '';
        this.currentDeckTitle = '';
        this.questionsCount = '';
        this.embedOptions = {
            title: '',
            showNumbers: false,
            showAnsExp: false,
            //showExplanation: false,
        };
    }

    getState(){ //should this be getInitialState?
        return {
            userDecks : this.userDecks,
            recentDecks: this.recentDecks,
            searchDecks: this.searchDecks,
            selectedDeckTitle: this.selectedDeckTitle,
            selectedDeckId: this.selectedDeckId,
            showSearchResults: this.showSearchResults,
            showQuestions: this.showQuestions,
            showOptions: this.showOptions,
            showWarning: this.showWarning,
            activeItem: this.activeItem,
            deckQuestions: this.deckQuestions,
            deckQuestionsCount: this.deckQuestionsCount,
            selectedQuestions: this.selectedQuestions,
            questionsCount: this.questionsCount,
            embedOptions: this.embedOptions,
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
        this.showQuestions = state.showQuestions;
        this.showWarning = state.showWarning;
        this.showOptions = state.showOptions;
        this.activeItem = state.activeItem;
        this.deckQuestions = state.deckQuestions;
        this.deckQuestionsCount = state.deckQuestionsCount;
        this.selectedQuestions = state.selectedQuestions;
        this.questionsCount = state.questionsCount;//nikki 
    }
    resetModalStore(){
        this.userDecks = [];
        this.recentDecks = [];
        this.searchDecks = [];
        this.selectedDeckTitle = ''; /*nikki 'Select the deck you wish to attach...'; */
        this.selectedDeckId = -1;
        this.showSearchResults = false;
        this.showQuestions = false; 
        this.showOptions = false;
        this.showWarning = false;
        this.activeItem = 'CurrentDeck';
        this.deckQuestions = [];
        this.deckQuestionsCount = '';
        this.selectedQuestions = [];
        this.questionsCount = '';
        this.embedOptions = {
            title: '',
            showNumbers: false,
            showAnsExp: false,
            //showExplanation: false,
        };

        this.emitChange();
    }
    initModal(){
        this.selectedDeckTitle = ''; /*nikki 'Select the deck you wish to attach...'; */
        this.selectedDeckId = -1;
        this.showSearchResults = false;
        this.showQuestions = false;
        this.showOptions = false;
        this.showWarning = false;
        this.activeItem = 'CurrentDeck';
        this.deckQuestions = [];
        this.deckQuestionsCount = ''; 
        this.selectedQuestions = []; 
        this.embedOptions = {
            title: '',
            showNumbers: false,
            showAnsExp: false,
            //showExplanation: false,
        };
    
        this.emitChange();
    }

    updateUserDecks(payload){
        this.userDecks = payload;
        this.emitChange();
    }

    updateSelectedDeck(payload){
        this.selectedDeckTitle = payload.selectedDeckTitle;
        this.selectedDeckId = payload.selectedDeckId;
        console.log(payload);
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
                    description: deck.description,
                    //updated: !isEmpty(deck.lastUpdate) ? deck.lastUpdate : (new Date()).setTime(1).toISOString(),
                    updated:deck.lastUpdate,
                    //creationDate: !isEmpty(deck.timestamp) ? deck.timestamp : (new Date()).setTime(1).toISOString(),
                    creationDate: deck.timestamp,
                    deckID: deck._id,
                    theme: deck.theme,
                    firstSlide: deck.firstSlide,
                    language:deck.language,
                    countRevisions:deck.countRevisions,
                    deckCreatorid:deck.user,
                    deckCreator:deck.username,
                    questionsCount: deck.questionsCount,
                });

            });
            this.recentDecks = recentDecks;
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
                    description: deck.description,
                    updated:deck.lastUpdate,
                    creationDate: deck.timestamp,
                    deckID: deck.db_id,
                    theme: deck.theme,
                    firstSlide: deck.firstSlide,
                    language:deck.language,
                    countRevisions:deck.revisionCount,
                    deckCreatorid:deck.creator,
                    deckCreator:deck.user.username,
                    questionsCount: deck.questionsCount,
                });
            });

            this.searchDecks = searchDecks;
            this.showSearchResults = true;
        }
        this.emitChange();
    }

    updateActiveItem(payload){

        this.activeItem = payload.activeItem;
        this.showQuestions = payload.showQuestions;
        this.emitChange();
    }

    updateShowQuestions(payload){
        if (isNullOrUndefined(payload)){
            console.log('undefined');
        } else {
            this.showQuestions = payload;
        }
        this.emitChange();
    }

    updateShowOptions(payload){
        if (payload===true){
            this.showOptions = true;
        }
        else {
            this.showOptions = false;
        }
        this.emitChange();
    }

    updateShowWarning(payload){
        if (isNullOrUndefined(payload)){
            console.log('undefined');
        } else {
            this.showWarning = payload;
        }
        this.emitChange();
    }

    updateDeckQuestions(payload){
        if((payload === [])||(typeof payload === 'undefined')){
            this.deckQuestions = [];
            this.deckQuestionsCount = 0;
        }else{
            this.deckQuestions = payload.questions;
            this.deckQuestionsCount = this.deckQuestions.length;
        }
        this.emitChange();
    }

    updateSelectedQuestions(payload){
        if((payload.selectedQuestions===[])||(typeof payload.selectedQuestions === 'undefined')){
            this.selectedQuestions =[];
        }else{
            this.selectedQuestions = payload.selectedQuestions;
            //console.log(payload.selectedQuestions);
        }
        this.emitChange();  
    }

    updateOptions(payload){
        //gets payload type (option) and the value?
        //options.title , options.showAnsExp 
        //console.log(payload);
        switch(payload.option){
            case 'title':
                this.embedOptions.title = payload.value;
                break;
            case 'showNumbers':
                this.embedOptions.showNumbers = payload.value;
                break;
            case 'showAnsExp':
                this.embedOptions.showAnsExp = payload.value;
                break;
            /* Combined with showAnswers to become showAnsExp
            case 'showExplanation':
                this.embedOptions.showExplanation = payload.value;
                break;
                */
            default:
                break;
        }
        //console.log(this.embedOptions);
        this.emitChange();
    }
}

AttachQuestionsModalStore.storeName = 'AttachQuestionsModalStore';
AttachQuestionsModalStore.handlers = {
    'ATTACHQUESTIONS_LOAD_USERDECKS' : 'updateUserDecks',
    'ATTACHQUESTIONS_SELECTED_DECK' : 'updateSelectedDeck',
    'ATTACHQUESTIONS_LOAD_RECENTDECKS': 'updateRecentDecks',
    'ATTACHQUESTIONS_LOAD_SEARCHDECKS' : 'updateSearchDecks',
    'ATTACHQUESTIONS_RESET':'resetModalStore',
    'ATTACHQUESTIONS_INIT' :'initModal',
    'ATTACHQUESTIONS_ACTIVE_ITEM' :'updateActiveItem',
    'ATTACHQUESTIONS_LOAD_QUESTIONS' : 'updateDeckQuestions', 
    'ATTACHQUESTIONS_SELECTED_QUESTIONS' : 'updateSelectedQuestions', 
    'ATTACHQUESTIONS_SHOW_QUESTIONS' : 'updateShowQuestions',
    'ATTACHQUESTIONS_SHOW_OPTIONS'  : 'updateShowOptions', 
    'ATTACHQUESTIONS_SHOW_WARNING' : 'updateShowWarning',
    'ATTACHQUESTIONS_UPDATE_OPTIONS': 'updateOptions',
};

export default AttachQuestionsModalStore;
