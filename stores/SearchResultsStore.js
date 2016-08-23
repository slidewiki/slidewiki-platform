import {BaseStore} from 'fluxible/addons';

class SearchResultsStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);

        this.queryparams = '';
        this.searchstring = '';
        this.entity = '';
        this.lang = '';
        this.group = '';
        this.fields = '';
        this.user = '';
        this.tags = '';
        this.revisions = '';

        // solr results
        this.numFound= '' ;
        this.docs = [];
        this.allDocs = [];

        // facets
        // this.filters = new Map();
        this.entities = [
            {'id': '1', 'description':'Slide', 'value':'slide'},
            {'id': '2', 'description':'Deck', 'value':'deck'},
            {'id': '3', 'description':'Answer', 'value':'answer'},
            {'id': '4', 'description':'Question', 'value':'question'},
            {'id': '5', 'description':'Comment', 'value':'comment'},
        ];
        this.languages = [
            {'id': '1', 'description':'English', 'value':'en'},
            {'id': '2', 'description':'Spanish', 'value':'es'},
            {'id': '3', 'description':'Greek', 'value':'gr'},
        ];

        this.error = '';
        this.loading = true;
    }
    updateResults(payload){
        // console.log("store: update results called");
        this.queryparams = payload.queryparams;
        this.searchstring = payload.searchstring;
        this.entity = payload.entity;
        this.lang = payload.lang;
        this.group = payload.group;
        this.fields = payload.fields;
        this.user = payload.user;
        this.tags = payload.tags;
        this.revisions = payload.revisions;
        this.numFound = payload.numFound;
        this.docs = payload.docs;
        this.allDocs = payload.docs;
        this.loading = false;
        // this.entities = payload.entities;
        // this.languages = payload.languages;

        this.emitChange();
        // //Filter by deckid
        // if(payload.deckid.substring(payload.deckid.indexOf('=')+1)!==''){
        //     this.results = this.filterByField(this.results, 'did', payload.deckid.substring(payload.deckid.indexOf('=')+1));
        // }
        // //Filter by userid
        // if(payload.userid.substring(payload.userid.indexOf('=')+1)!==''){
        //     this.results = this.filterByField(this.results, 'uid', payload.userid.substring(payload.userid.indexOf('=')+1));
        // }
        // //Filter by language
        // if(payload.searchlang.substring(payload.searchlang.indexOf('=')+1)!==''){
        //     this.results = this.filterByField(this.results, 'lang', payload.searchlang.substring(payload.searchlang.indexOf('=')+1));
        // }
        // //Filter by entity
        // if(payload.entity.substring(payload.entity.indexOf('=')+1)!==''){
            // this.results = this.filterByStringField(this.results, 'entity', payload.entity.substring(payload.entity.indexOf('=')+1));
        // }



    }
    setQueryParams(payload){
        this.queryparams = '';
        this.searchstring = '';
        this.entity = '';
        this.lang = '';
        this.group = '';
        this.fields = '';
        this.user = '';
        this.tags = '';
        this.revisions = '';

        // solr results
        this.numFound= '' ;
        this.docs = [];
        this.allDocs = [];
        this.loading = false;
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
    showLoading(){
        this.loading = true;
        this.emitChange();
    }

    getState() {
        return {
            queryparams: this.queryparams,
            searchstring: this.searchstring,
            entity: this.entity,
            lang: this.lang,
            group: this.group,
            fields: this.fields,
            user: this.user,
            tags: this.tags,
            revisions: this.revisions,
            numFound: this.numFound,
            docs: this.docs,
            entities: this.entities,
            languages: this.languages,
            loading: this.loading
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
        this.group = state.group;
        this.fields = state.fields;
        this.user = state.user;
        this.tags = state.tags;
        this.revisions = state.revisions;
        this.numFound = state.numFound;
        this.docs = state.docs;
        this.entities = state.entities;
        this.languages = state.languages;
        this.loading = state.loading;
    }
}

SearchResultsStore.storeName = 'SearchResultsStore';
SearchResultsStore.handlers = {
    'LOAD_RESULTS_SUCCESS': 'updateResults',
    'UPDATE_RESULTS_VISIBILITY': 'updateResultsVisibility',
    'NO_QUERY_PARAMS': 'setQueryParams',
    'SHOW_LOADING': 'showLoading'
};

export default SearchResultsStore;
