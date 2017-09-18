import {BaseStore} from 'fluxible/addons';

class SearchParamsStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);

        this.queryparams = '';
        this.searchstring = '';
        this.kind = '';
        this.language = '';
        this.field = '';
        this.user = '';
        this.tag = '';
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
        this.keywords = (params.keywords || '');
        this.kind = (params.kind || '');
        this.language = (params.language || '');
        this.field = (params.field || '');
        this.user = (params.user || '');
        this.tag = (params.tag || '');
        this.sort = (params.sort || 'score');
        this.fetch = true;
        this.emitChange();
        this.fetch = false;
    }
    resetParams(payload){
        this.queryparams = '';
        this.keywords = '';
        this.kind = '';
        this.language = '';
        this.field = '';
        this.user = '';
        this.tag = '';
        this.sort = '';
        this.fetch = true;
        this.emitChange();
        this.fetch = false;
    }
    getState() {
        return {
            queryparams: this.queryparams,
            keywords: this.keywords,
            kind: this.kind,
            language: this.language,
            field: this.field,
            user: this.user,
            tag: this.tag,
            sort: this.sort,
            fetch: this.fetch
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.queryparams = state.queryparams;
        this.keywords = state.keywords;
        this.kind = state.kind;
        this.language = state.language;
        this.field = state.field;
        this.user = state.user;
        this.tag = state.tag;
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
