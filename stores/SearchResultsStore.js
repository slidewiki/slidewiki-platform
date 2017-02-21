import {BaseStore} from 'fluxible/addons';

class SearchResultsStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);

        // solr results
        this.numFound = '';
        this.docs = [];
        this.spellcheck = '';

        this.error = false;
        this.loading = false;
    }
    showLoading(payload){
        this.loading = true;
        this.emitChange();
    }
    updateResults(payload){
        this.numFound = payload.numFound;
        this.docs = payload.docs;
        this.spellcheck = payload.spellcheck;
        this.error = payload.error;

        // hide loading
        this.loading = false;

        this.emitChange();
    }
    resetParams(payload){
        // solr results
        this.numFound= '' ;
        this.docs = [];
        this.spellcheck = '';
        this.loading = false;
        this.error = false;

        this.emitChange();
    }
    displayError(){
        this.loading = false;
        this.error = true;
        this.emitChange();
    }
    getState() {
        return {
            numFound: this.numFound,
            docs: this.docs,
            spellcheck: this.spellcheck,
            loading: this.loading,
            error: this.error
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.numFound = state.numFound;
        this.docs = state.docs;
        this.spellcheck = state.spellcheck;
        this.loading = state.loading;
        this.error = state.error;
    }
}

SearchResultsStore.storeName = 'SearchResultsStore';
SearchResultsStore.handlers = {
    'LOAD_RESULTS_SUCCESS': 'updateResults',
    'LOAD_RESULTS_FAILURE': 'displayError',
    'RESET_PARAMS': 'resetParams',
    'SHOW_LOADING': 'showLoading'
};

export default SearchResultsStore;
