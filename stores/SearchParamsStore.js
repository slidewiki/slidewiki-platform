import {BaseStore} from 'fluxible/addons';

class SearchParamsStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);

        this.queryparams = '';
        this.searchstring = '';
        this.entity = '';
        this.language = '';
        // this.group = '';
        this.fields = '';
        this.users = '';
        this.tags = '';
        this.revisions = false;
        this.license = '';
        this.fetch = false;

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
            {'id': '2', 'description':'German', 'value':'de'},
            {'id': '3', 'description':'Greek', 'value':'gr'},
            {'id': '4', 'description':'Italian', 'value':'it'},
            {'id': '5', 'description':'Portugese', 'value':'pt'},
            {'id': '6', 'description':'Serbian', 'value':'sr'},
            {'id': '7', 'description':'Spanish', 'value':'es'},
        ];
    }
    getUriParams(qstr){
        let query = {};
        let a = qstr.split('&');
        for (let i = 0; i < a.length; i++) {
            let b = a[i].split('=');

            // handle multiple key values
            if(query.hasOwnProperty(decodeURIComponent(b[0]))){
                let arr = [];
                arr.push(query[decodeURIComponent(b[0])]);
                arr.push(decodeURIComponent(b[1] || ''));
                query[decodeURIComponent(b[0])] = arr;
            }
            else{
                query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
            }
        }
        return query;
    }
    setParams(payload){
        let params = this.getUriParams(payload.params.queryparams);

        // fetch results
        this.queryparams = payload.params.queryparams;
        this.searchstring = (params.q || '');
        this.entity = (params.entity || '');
        this.language = (params.language || '');
        // this.group = params.group;
        this.fields = (params.fields || '');
        this.users = (params.users || '');
        this.tags = (params.tags || '');
        this.revisions = params.revisions;
        this.license = params.license;
        this.fetch = true;
        this.emitChange();
        this.fetch = false;
    }
    resetParams(payload){
        this.queryparams = '';
        this.searchstring = '';
        this.entity = '';
        this.language = '';
        // this.group = '';
        this.fields = '';
        this.users = '';
        this.tags = '';
        this.revisions = false;
        this.license = '';
        this.fetch = true;
        this.emitChange();
        this.fetch = false;
    }
    getState() {
        return {
            queryparams: this.queryparams,
            searchstring: this.searchstring,
            entity: this.entity,
            lang: this.language,
            // group: this.group,
            fields: this.fields,
            users: this.users,
            tags: this.tags,
            revisions: this.revisions,
            entities: this.entities,
            languages: this.languages,
            license: this.license,
            fetch: this.fetch
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.queryparams = state.queryparams;
        this.searchstring = state.searchstring;
        this.entity = state.entity;
        this.language = state.language;
        // this.group = state.group;
        this.fields = state.fields;
        this.users = state.users;
        this.tags = state.tags;
        this.revisions = state.revisions;
        this.entities = state.entities;
        this.languages = state.languages;
        this.license = state.license;
        this.fetch = state.fetch;
    }
}

SearchParamsStore.storeName = 'SearchParamsStore';
SearchParamsStore.handlers = {
    'SET_PARAMS': 'setParams',
    'RESET_PARAMS': 'resetParams'
};

export default SearchParamsStore;
