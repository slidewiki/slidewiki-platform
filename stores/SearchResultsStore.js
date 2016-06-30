import {BaseStore} from 'fluxible/addons';

class SearchResultsStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.searchstring = '';
        this.searchlang='';
        this.entity = '';
        this.deckid = '';
        this.userid = '';
        this.results = [];
        this.entities = [];
        this.languages = [];
    }
    updateResults(payload) {

        this.searchstring = payload.searchstring;
        this.searchlang = payload.searchlang;
        this.deckid = payload.deckid;
        this.userid = payload.userid;
        this.entity = payload.entity;
        this.results = payload.results;

        //Filter by deckid
        if(payload.deckid.substring(payload.deckid.indexOf('=')+1)!==''){
            this.results = this.filterByField(this.results, 'did', payload.deckid.substring(payload.deckid.indexOf('=')+1));
        }
        //Filter by userid
        if(payload.userid.substring(payload.userid.indexOf('=')+1)!==''){
            this.results = this.filterByField(this.results, 'uid', payload.userid.substring(payload.userid.indexOf('=')+1));
        }
        //Filter by language
        if(payload.searchlang.substring(payload.searchlang.indexOf('=')+1)!==''){
            this.results = this.filterByField(this.results, 'lang', payload.searchlang.substring(payload.searchlang.indexOf('=')+1));
        }
        //Filter by entity
        if(payload.entity.substring(payload.entity.indexOf('=')+1)!==''){
            this.results = this.filterByStringField(this.results, 'entity', payload.entity.substring(payload.entity.indexOf('=')+1));
        }


        this.entities = payload.entities;
        this.languages = payload.languages;

        this.emitChange();
    }

    filterByStringField(resultsAll, fieldName, fieldValue){
        let filteredResults = [];
        if(fieldName==='entity'){
            resultsAll.forEach((result) => {
                console.log('type: '+result.type);
                console.log('fieldValue: '+fieldValue);
                if(result.type.indexOf(fieldValue) > -1){
                    filteredResults.push(result);
                }
            });
        }

        return filteredResults;
    }

    filterByField(resultsAll, fieldName, fieldValue){
        let filteredResults = [];
        if(fieldName==='did'){
            resultsAll.forEach((result) => {
                if(result.did === fieldValue){
                    filteredResults.push(result);
                }
            });
        }
        else if (fieldName==='uid') {
            resultsAll.forEach((result) => {
                if(result.uid === fieldValue){
                    filteredResults.push(result);
                }
            });
        }
        else if (fieldName==='lang') {
            resultsAll.forEach((result) => {
                if(result.lang === fieldValue){
                    filteredResults.push(result);
                }
            });
        }

        return filteredResults;
    }


    updateResultsVisibility(payload) {

        console.log('FACETS!!!!');

        this.results.find((s) => {console.log('type: '+s.type);});

        console.log('field: '+payload.field);
        console.log('value: '+payload.value);

        this.emitChange();
    }

    getState() {
        return {
            results: this.results,
            entities: this.entities,
            languages: this.languages,

            searchstring: this.searchstring,
            searchlang: this.searchlang,
            entity: this.entity,
            deckid: this.deckid,
            userid: this.userid
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.results = state.results;
        this.entities = state.entities;
        this.languages = state.languages;

        this.searchstring = state.searchstring;
        this.searchlang = state.searchlang,
        this.entity = state.entity;
        this.deckid = state.deckid;
        this.userid = state.userid;
    }

}

SearchResultsStore.storeName = 'SearchResultsStore';
SearchResultsStore.handlers = {
    'LOAD_RESULTS_SUCCESS': 'updateResults',
    'UPDATE_RESULTS_VISIBILITY': 'updateResultsVisibility'
};

export default SearchResultsStore;
