import {BaseStore} from 'fluxible/addons';

class ContributorsStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.contributors = [];
        this.creator = [];
        this.translators = [];
        this.listName = '';
        this.selector = {};
        this.loadingIndicator = false;
    }
    loading(payload){
        this.loadingIndicator = payload.loadingIndicator;
        this.emitChange();
    }
    updateContributors(payload) {
        this.contributors = this.getContributors(payload.contributors);
        this.creator = this.getCreator(payload.contributors);
        this.translators = this.getTranslators(payload.contributors);
        this.listName = payload.listName;
        this.selector = payload.selector;
        this.loadingIndicator = false;
        this.emitChange();
    }

    getState() {
        return {
            contributors: this.contributors,
            creator: this.creator,
            translators: this.translators,
            selector: this.selector,
            loadingIndicator: this.loadingIndicator
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.contributors = state.contributors;
        this.creator = state.creator;
        this.translators = state.translators;
        this.selector = state.selector;
        this.loadingIndicator = state.loadingIndicator;
    }

    getBasedonRole(role, list) {
        let output = [];
        list.forEach((contributor) => {
            if(contributor.type === role){
                output.push(contributor);
            }
        });
        return output;
    }
    getCreator(contributorsAll){
        return this.getBasedonRole('creator', contributorsAll);
    }
    getContributors(contributorsAll){
        return this.getBasedonRole('contributor', contributorsAll);

    }
    getTranslators(contributorsAll){
        return this.getBasedonRole('translator', contributorsAll);
    }
}

ContributorsStore.storeName = 'ContributorsStore';
ContributorsStore.handlers = {
    'LOAD_CONTRIBUTORS_SUCCESS': 'updateContributors',
    'LOAD_CONTRIBUTORS_LOAD': 'loading'
};

export default ContributorsStore;
