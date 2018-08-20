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
        this.page = 1;
        this.queryparams = {};
    }
    showLoading(payload){
        this.loading = true;
        this.emitChange();
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
        this.page = payload.page;
        this.queryparams = payload.queryparams;

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
        this.page = payload.page;
        this.queryparams = payload.queryparams;

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
        this.page = 1;
        this.queryparam = {};

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
            page: this.page, 
            queryparams: this.queryparams,
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
        this.page = state.page;
        this.queryparams = state.queryparams;
    }
}

SearchResultsStore.storeName = 'SearchResultsStore';
SearchResultsStore.handlers = {
    'LOAD_RESULTS_SUCCESS': 'updateResults',
    'LOAD_RESULTS_FAILURE': 'displayError',
    'RESET_PARAMS': 'resetParams',
    'SHOW_LOADING': 'showLoading',
    'LOAD_MORE_RESULTS_SUCCESS': 'loadMoreResults',
    'SHOW_LOAD_MORE_LOADING': 'showLoadMoreLoading'
};

export default SearchResultsStore;
