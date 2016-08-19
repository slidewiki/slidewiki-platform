import {BaseStore} from 'fluxible/addons';

class SearchResultsStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.searchstring = '';
        // this.searchlang='';
        this.entity = '';
        // this.deckid = '';
        // this.userid = '';
        this.searchstatus='';

        this.numFound='';
        this.docs=[];

        // this.results = [];
        this.entities = [];
        this.languages = [];
        this.open = false;
    }
    updateResults(payload) {
        // console.log('HELLO!!!!!!!!');
        // console.log('NUMBER: '+payload.numFound);

        // console.log(' - store : searchstring - ' + payload.searchstring);

        this.searchstring = payload.searchstring;
        // this.searchlang = payload.searchlang;
        // this.deckid = payload.deckid;
        // this.userid = payload.userid;
        this.entity = payload.entity;
        this.searchstatus= payload.searchstatus;
        // this.results = payload.results;

        this.numFound = payload.numFound;
        this.docs = payload.docs;

        // console.log('RESULTS: '+this.results);

        console.log('DOCS: '+this.docs + ' '  + this.numFound);

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


        this.entities = payload.entities;
        this.languages = payload.languages;
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

        console.log('FACETS!!!!');

        // this.results.find((s) => {console.log('type: '+s.type);});

        // console.log('field: '+payload.field);
        // console.log('value: '+payload.value);

        this.emitChange();
    }

    getState() {
        return {
            // results: this.results,
            entities: this.entities,
            languages: this.languages,

            searchstring: this.searchstring,
            // searchlang: this.searchlang,
            entity: this.entity,
            // deckid: this.deckid,
            // userid: this.userid,
            searchstatus: this.searchstatus,

            numFound: this.numFound,
            docs: this.docs,
            // open: this.open
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        // this.results = state.results;
        this.entities = state.entities;
        this.languages = state.languages;

        this.searchstring = state.searchstring;
        // this.searchlang = state.searchlang,
        this.entity = state.entity;
        // this.deckid = state.deckid;
        // this.userid = state.userid;
        this.searchstatus = state.searchstatus;

        this.numFound = state.numFound;
        this.docs = state.docs;
        // this.open = state.open;
        console.log('- state  reh:' + this.open);
    }

}

SearchResultsStore.storeName = 'SearchResultsStore';
SearchResultsStore.handlers = {
    'LOAD_RESULTS_SUCCESS': 'updateResults',
    'UPDATE_RESULTS_VISIBILITY': 'updateResultsVisibility'
};

export default SearchResultsStore;
