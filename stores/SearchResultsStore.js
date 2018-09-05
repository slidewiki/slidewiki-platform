import {BaseStore} from 'fluxible/addons';

class SearchResultsStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);

        // solr results
        this.numFound = '';
        this.docs = [];
        this.spellcheck = [];
        this.facets = {}; 

        this.error = false;
        this.loading = false;

        this.loadMoreLoading = false;
        this.hasMore = false;
        this.links = {};
        this.queryparams = {};
        this.fetch = false;
    }
    showLoading(payload){
        this.loading = true;
        this.fetch = true;
        this.emitChange();
        this.fetch = false;
    }
    showLoadMoreLoading(payload){
        this.loadMoreLoading = true;
        this.emitChange();
    }
    updateResults(payload){
        this.numFound = payload.numFound;
        this.docs = payload.docs;
        this.spellcheck = payload.spellcheck;
        this.facets = payload.facets;
        this.error = payload.error;
        this.hasMore = payload.hasMore;
        this.links = payload.links;

        // hide loading
        this.loading = false;
        this.loadMoreLoading = false;

        this.emitChange();
    }
    loadMoreResults(payload){
        this.numFound = payload.numFound;
        this.docs = this.docs.concat(payload.docs);     // append more results
        this.spellcheck = payload.spellcheck;
        this.facets = payload.facets;
        this.error = payload.error;
        this.hasMore = payload.hasMore;
        this.links = payload.links;

        // hide loading
        this.loading = false;
        this.loadMoreLoading = false;

        this.emitChange();
    }
    resetParams(payload){
        // solr results
        this.numFound= '' ;
        this.docs = [];
        this.spellcheck = [];
        this.facets = {};
        this.loading = false;
        this.error = false;
        this.hasMore = false;
        this.loadMoreLoading = false;
        this.links = 1;
        this.queryparams = {};
        this.fetch = false;

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
            numFound: this.numFound,
            docs: this.docs,
            spellcheck: this.spellcheck,
            facets: this.facets,
            loading: this.loading,
            error: this.error,
            hasMore: this.hasMore,
            loadMoreLoading: this.loadMoreLoading,
            links: this.links, 
            queryparams: this.queryparams,
            fetch: this.fetch,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.numFound = state.numFound;
        this.docs = state.docs;
        this.spellcheck = state.spellcheck;
        this.facets = state.facets;
        this.loading = state.loading;
        this.error = state.error;
        this.hasMore = state.hasMore;
        this.loadMoreLoading = state.loadMoreLoading;
        this.links = state.links;
        this.queryparams = state.queryparams;
        this.fetch = state.fetch;
    }
    setSearchParams(payload) {
        this.queryparams = payload;

        // convert user ids to integers
        if (this.queryparams.user) {
            this.queryparams.user = this.queryparams.user.map( (u) => {
                return parseInt(u);
            });
        }
        this.fetch = true;
        this.emitChange();
        this.fetch = false;
    }
}

SearchResultsStore.storeName = 'SearchResultsStore';
SearchResultsStore.handlers = {
    'LOAD_RESULTS_SUCCESS': 'updateResults',
    'LOAD_RESULTS_FAILURE': 'displayError',
    'RESET_PARAMS': 'resetParams',
    'SHOW_LOADING': 'showLoading',
    'LOAD_MORE_RESULTS_SUCCESS': 'loadMoreResults',
    'SHOW_LOAD_MORE_LOADING': 'showLoadMoreLoading', 
    'SET_SEARCH_PARAMS': 'setSearchParams',
};

export default SearchResultsStore;
