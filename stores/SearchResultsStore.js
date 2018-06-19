import {BaseStore} from 'fluxible/addons';

class SearchResultsStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);

        // solr results
        this.numFound = '';
        this.docs1 = [];
        this.docs2 = [];
        this.spellcheck = [];
        this.facets = {}; 

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
    updateResults(payload){
        this.numFound = payload.res1.numFound;
        this.docs1 = payload.res1.docs;
        this.docs2 = payload.res2.docs;
        this.spellcheck = payload.res1.spellcheck;
        this.facets = payload.res1.facets;
        this.error = payload.res1.error;
        this.hasMore = payload.res1.hasMore;
        this.page = payload.res1.page;

        // hide loading
        this.loading = false;
        this.loadMoreLoading = false;

        this.emitChange();
    }
    loadMoreResults(payload){
        this.numFound = payload.res1.numFound;
        this.docs1 = this.docs1.concat(payload.res1.docs || []);     // append more results
        this.docs2 = this.docs2.concat(payload.res2.docs || []);     // append more results

        this.spellcheck = payload.res1.spellcheck;
        this.facets = payload.res1.facets;
        this.error = payload.res1.error;
        this.hasMore = payload.res1.hasMore;
        this.page = payload.res1.page;

        // hide loading
        this.loading = false;
        this.loadMoreLoading = false;

        this.emitChange();
    }
    resetParams(payload){
        // solr results
        this.numFound= '' ;
        this.docs1 = [];
        this.docs2 = [];
        this.spellcheck = [];
        this.facets = {};
        this.loading = false;
        this.error = false;
        this.hasMore = false;
        this.loadMoreLoading = false;
        this.page = 1;
        
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
            docs1: this.docs1,
            docs2: this.docs2,
            spellcheck: this.spellcheck,
            facets: this.facets,
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
        this.numFound = state.numFound;
        this.docs1 = state.docs1;
        this.docs2 = state.docs2;
        this.spellcheck = state.spellcheck;
        this.facets = state.facets;
        this.loading = state.loading;
        this.error = state.error;
        this.hasMore = state.hasMore;
        this.loadMoreLoading = state.loadMoreLoading;
        this.page = state.page;
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
