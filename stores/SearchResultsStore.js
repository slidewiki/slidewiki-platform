import {BaseStore} from 'fluxible/addons';

class SearchResultsStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.results = [{'id': '1', 'type':'slide', 'sid': '12', 'did': '56', 'dtitle':'RDF Cookbook', 'description':'RDF is a standard model for data', 'stitle':'Introuction', 'lang':'EN'},
                        {'id': '2', 'type':'deck', 'did': '23', 'dtitle':'RDF for beginners', 'description':'RDF was designed to provide', 'lang':'EN'},
                        {'id': '3', 'type':'deck_revision', 'did': '26', 'dtitle':'All about RDF', 'abstract':'What Is RDF by rewriting it from', 'lang':'EN'},
                        {'id': '4', 'type':'deck_revision', 'did': '31', 'dtitle':'RDF in a nutshell', 'comment':'Introduction RDF is one of', 'lang':'EN'},
                        {'id': '5', 'type':'answer', 'aid': '87', 'qid':'33', 'qtitle':'What is RDF', 'explanation':'Introduction to RDF including', 'lang':'ES'}
                      ];
        this.entities = [{'id': '1', 'description':'slide'}, {'id': '2', 'description':'deck'}, {'id': '3', 'description':'answer'}];
        this.languages = [{'id': '1', 'description':'EN'}, {'id': '2', 'description':'ES'}];


        this.query = 'RDF';
        // this.results = [];
        console.log('111');
    }
    updateResults(payload) {
        this.results = payload.res;
        console.log('222');
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
    'LOAD_RESULTS_SUCCESS': 'updateResults'
};

export default SearchResultsStore;
