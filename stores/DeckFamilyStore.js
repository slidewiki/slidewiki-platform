import {BaseStore} from 'fluxible/addons';

class DeckFamilyStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);

        this.tag = '';
        this.decks = [];
        this.numFound = 0;

        this.error = false;
        this.loading = false;

        this.loadMoreLoading = false;
        this.hasMore = false;
        this.page = 1;
    }
    showLoading(payload){
        this.loading = true;
        this.emitChange();
    }
    showLoadMoreLoading(payload){
        this.loadMoreLoading = true;
        this.emitChange();
    }
    updateFamilyDecks(payload){
        this.tag = payload.tag;
        this.decks = payload.decks.map( (deck) => {
            return {
                deckID: deck.db_id,
                title: deck.title,
                firstSlide: deck.firstSlide,
                theme: deck.theme,
                updated: deck.updated,
                description: deck.description,
                creationDate: deck.timestamp,
            };
        });

        this.numFound = payload.numFound;
        this.error = payload.error;
        this.hasMore = payload.hasMore;
        this.page = payload.page;

        // hide loading
        this.loading = false;
        this.loadMoreLoading = false;

        this.emitChange();
    }
    loadMoreFamilyDecks(payload){
        this.tag = payload.tag;
        this.decks = this.decks.concat(payload.decks);     // append more results
        this.numFound += payload.decks.length;

        this.error = payload.error;
        this.hasMore = payload.hasMore;
        this.page = payload.page;

        // hide loading
        this.loading = false;
        this.loadMoreLoading = false;

        this.emitChange();
    }
    displayError(){
        this.loading = false;
        this.loadMoreLoading = false;
        this.error = true;
        this.emitChange();
    }
    getState() {
        return {
            tag: this.tag,
            decks: this.decks,
            numFound: this.numFound,
            loading: this.loading,
            error: this.error,
            hasMore: this.hasMore,
            loadMoreLoading: this.loadMoreLoading,
            page: this.page
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.tag = state.tag;
        this.decks = state.decks;
        this.numFound = state.numFound;
        this.loading = state.loading;
        this.error = state.error;
        this.hasMore = state.hasMore;
        this.loadMoreLoading = state.loadMoreLoading;
        this.page = state.page;
    }
}

DeckFamilyStore.storeName = 'DeckFamilyStore';
DeckFamilyStore.handlers = {
    'LOAD_DECKFAMILY_DECKS': 'updateFamilyDecks',
    'LOAD_RESULTS_FAILURE': 'displayError',
    'DECKFAMILY_SHOW_LOADING': 'showLoading',
    'LOAD_MORE_DECKFAMILY_DECKS': 'loadMoreFamilyDecks',
    'DECKFAMILY_SHOW_LOAD_MORE_LOADING': 'showLoadMoreLoading'
};

export default DeckFamilyStore;
