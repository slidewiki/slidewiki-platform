import {BaseStore} from 'fluxible/addons';

class AdvancedSearchStore extends BaseStore {

    // constructor(dispatcher) {
    //     super(dispatcher);
    //
    //     this.searchstring ='';
    //     this.deckid ='';
    //     this.userid ='';
    //
    // }
    //
    // loadAdvancedSearchResults(payload){
    //     alert("edw adv store");
    //     console.log('333');
    //     this.searchstring = payload.searchstring;
    //     this.deckid = payload.deckid;
    //     this.userid = payload.userid;
    //
    //     console.log('searchstring: '+payload.searchstring);
    //     console.log('deckid: '+payload.deckid);
    //     console.log('userid: '+payload.userid);
    //
    //     this.emitChange();
    // }
    //
    // getState() {
    //     return {
    //         searchstring: this.searchstring,
    //         deckid: this.deckid,
    //         userid: this.userid
    //     };
    // }
    // dehydrate() {
    //     return this.getState();
    // }
    // rehydrate(state) {
    //     this.searchstring = state.searchstring;
    //     this.deckid = state.deckid;
    //     this.userid = state.userid;
    // }
    constructor(dispatcher){
        super(dispatcher);
        this.collapseState = true;
    }

    collapseExtraSearchFields(){

        this.collapseState = !this.collapseState;


        console.log('adv store ' + this.collapseState);
        this.emitChange();
    }
    enableExtraSearchFields(){
        this.collapseState = false;
        this.emitChange();
    }
    disableExtraSearchFields(){
        this.collapseState = true;
        this.emitChange();
    }
    getState(){
        return {
            collapseState: this.collapseState
        };
    }

    dehydrate(){
        return this.getState();
    }

    rehydrate(state){
        this.collapseState = state.collapseState;
    }
}

AdvancedSearchStore.storeName = 'AdvancedSearchStore';
AdvancedSearchStore.handlers = {
    // 'LOAD_ADVANCED_SEARCH_RESULTS_SUCCESS': 'loadAdvancedSearchResults'
    'COLLAPSE_EXTRA_SEARCH_FIELDS': 'collapseExtraSearchFields'
};

export default AdvancedSearchStore;
