import {BaseStore} from 'fluxible/addons';

class SearchResultsStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.query = 'RDF';
        this.results = [];
        this.entities = [];
        this.languages = [];
    }
    updateResults(payload) {
        this.results = payload.results;
        this.entities = payload.entities;
        this.languages = payload.languages;
        this.emitChange();
    }
    updateResultsVisibility(payload) {

        this.emitChange();
    }

    getState() {
        return {
            results: this.results,
            entities: this.entities,
            languages: this.languages,
            query: this.query
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.results = state.results;
        this.entities = state.entities;
        this.languages = state.languages;
        this.query = state.query;
    }

}

SearchResultsStore.storeName = 'SearchResultsStore';
SearchResultsStore.handlers = {
    'LOAD_RESULTS_SUCCESS': 'updateResults',
    'UPDATE_RESULTS_VISIBILITY': 'updateResultsVisibility'
};

export default SearchResultsStore;
