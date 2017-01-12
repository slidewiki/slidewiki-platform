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
        this.sort = '';
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
        this.sort = params.sort;
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
        this.sort = '';
        this.fetch = true;
        this.emitChange();
        this.fetch = false;
    }
    getState() {
        return {
            queryparams: this.queryparams,
            searchstring: this.searchstring,
            entity: this.entity,
            language: this.language,
            // group: this.group,
            fields: this.fields,
            users: this.users,
            tags: this.tags,
            revisions: this.revisions,
            license: this.license,
            sort: this.sort,
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
        this.license = state.license;
        this.sort = state.sort;
        this.fetch = state.fetch;
    }
}

SearchParamsStore.storeName = 'SearchParamsStore';
SearchParamsStore.handlers = {
    'SET_PARAMS': 'setParams',
    'RESET_PARAMS': 'resetParams'
};

export default SearchParamsStore;
