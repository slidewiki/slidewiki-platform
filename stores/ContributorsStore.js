import {BaseStore} from 'fluxible/addons';

class ContributorsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.contributors = [];
        this.creator = [];
        this.translators = [];
    }
    updateContributors(payload) {
        this.contributors = this.getContributors(payload.contributors);//payload.contributors;
        this.creator = this.getCreator(payload.contributors);
        this.translators = this.getTranslators(payload.contributors);
        this.emitChange();
    }
    getState() {
        return {
            contributors: this.contributors, 
            creator: this.creator,
            translators: this.translators
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.contributors = state.contributors;
        this.creator = state.creator;
        this.translators = state.translators;
    }
    getCreator(contributorsAll){
    	let creator = [];
    	for (var i in contributorsAll) {
    		if(contributorsAll[i]["type"]==='creator'){
    			creator.push(contributorsAll[i]);
    		}
    	}
    	return creator;
    }
    getContributors(contributorsAll){
    	let contributors = [];
    	for (var i in contributorsAll) {
    		if(contributorsAll[i]["type"]==='contributor'){
    			contributors.push(contributorsAll[i]);
    		}
    	}
    	return contributors;
    }
    getTranslators(contributorsAll){
    	let translators = [];
    	for (var i in contributorsAll) {
    		if(contributorsAll[i]["type"]==='translator'){
    			translators.push(contributorsAll[i]);
    		}
    	}
    	return translators;
    }
    

}

ContributorsStore.storeName = 'ContributorsStore';
ContributorsStore.handlers = {
    'LOAD_CONTRIBUTORS_SUCCESS': 'updateContributors'
};

export default ContributorsStore;
