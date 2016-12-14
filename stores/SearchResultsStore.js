import {BaseStore} from 'fluxible/addons';

class SearchResultsStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);

        // solr results
        this.numFound= '' ;
        this.docs = [];

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
        this.error = payload.error;

        // hide loading
        this.loading = false;

        this.emitChange();
    }
    resetParams(payload){
        // solr results
        this.numFound= '' ;
        this.docs = [];
        this.loading = false;
        this.error = false;

        this.emitChange();
    }
    displayError(){
        this.loading = false;
        this.error = true;
        this.emitChange();
    }

    // filterByStringField(resultsAll, fieldName, fieldValue){
    //     let filteredResults = [];
    //     if(fieldName==='entity'){
    //         resultsAll.forEach((result) => {
    //             console.log('type: '+result.type);
    //             console.log('fieldValue: '+fieldValue);
    //             if(result.type.indexOf(fieldValue) > -1){
    //                 filteredResults.push(result);
    //             }
    //         });
    //     }
    //
    //     return filteredResults;
    // }
    //
    // filterByField(resultsAll, fieldName, fieldValue){
    //     let filteredResults = [];
    //     if(fieldName==='did'){
    //         resultsAll.forEach((result) => {
    //             if(result.did === fieldValue){
    //                 filteredResults.push(result);
    //             }
    //         });
    //     }
    //     else if (fieldName==='uid') {
    //         resultsAll.forEach((result) => {
    //             if(result.uid === fieldValue){
    //                 filteredResults.push(result);
    //             }
    //         });
    //     }
    //     else if (fieldName==='lang') {
    //         resultsAll.forEach((result) => {
    //             if(result.lang === fieldValue){
    //                 filteredResults.push(result);
    //             }
    //         });
    //     }
    //
    //     return filteredResults;
    // }

    updateResultsVisibility(payload) {
        // console.log(JSON.stringify(this.docs));\

        // this.updateFilters(payload.field, payload.value);
        console.log('FACETS');
        // console.log("edw " + this.filters.contains(payload));
        // filteredDocs = this.filterByStringField();
        // this.results.find((s) => {console.log('type: '+s.type);});

        // console.log('field: '+payload.field);
        // console.log('value: '+payload.value);

        this.emitChange();
    }
    getState() {
        return {
            numFound: this.numFound,
            docs: this.docs,
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
        this.loading = state.loading;
        this.error = state.error;
    }
}

SearchResultsStore.storeName = 'SearchResultsStore';
SearchResultsStore.handlers = {
    'LOAD_RESULTS_SUCCESS': 'updateResults',
    'LOAD_RESULTS_FAILURE': 'displayError',
    'UPDATE_RESULTS_VISIBILITY': 'updateResultsVisibility',
    'RESET_PARAMS': 'resetParams',
    'SHOW_LOADING': 'showLoading'
};

export default SearchResultsStore;
