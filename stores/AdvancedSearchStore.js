import {BaseStore} from 'fluxible/addons';

class AdvancedSearchStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);

        this.searchstring ='';
        this.deckid ='';
        this.userid ='';

        console.log('111');
    }

    loadAdvancedSearchResults(payload){
        console.log('333');
        this.searchstring = payload.searchstring;
        this.deckid = payload.deckid;
        this.userid = payload.userid;

        this.emitChange();
    }

    getState() {
        return {
            searchstring: this.searchstring,
            deckid: this.deckid,
            userid: this.userid
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.searchstring = state.searchstring;
        this.deckid = state.deckid;
        this.userid = state.userid;
    }

}

AdvancedSearchStore.storeName = 'AdvancedSearchStore';
AdvancedSearchStore.handlers = {
    'LOAD_ADVANCED_SEARCH_RESULTS_SUCCESS': 'loadAdvancedSearchResults'
};

export default AdvancedSearchStore;
