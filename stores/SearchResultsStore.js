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
            queryparams: this.queryparams,
            searchstring: this.searchstring,
            entity: this.entity,
            lang: this.lang,
            // group: this.group,
            fields: this.fields,
            user: this.user,
            tags: this.tags,
            revisions: this.revisions,
            numFound: this.numFound,
            docs: this.docs,
            entities: this.entities,
            languages: this.languages,
            loading: this.loading,
            error: this.error
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.queryparams = state.queryparams;
        this.searchstring = state.searchstring;
        this.entity = state.entity;
        this.lang = state.lang;
        // this.group = state.group;
        this.fields = state.fields;
        this.user = state.user;
        this.tags = state.tags;
        this.revisions = state.revisions;
        this.numFound = state.numFound;
        this.docs = state.docs;
        this.entities = state.entities;
        this.languages = state.languages;
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
