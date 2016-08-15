import {BaseStore} from 'fluxible/addons';

class ContributorsStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.contributors = [];
        this.creator = [];
        this.translators = [];
        this.listName = '';
    }
    updateContributors(payload) {
        this.contributors = this.getContributors(payload.contributors);
        this.creator = this.getCreator(payload.contributors);
        this.translators = this.getTranslators(payload.contributors);
        this.listName = payload.listName;
        this.emitChange();
    }

    getState() {
        return {
            contributors: this.contributors,
            creator: this.creator,
            translators: this.translators,
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
    'LOAD_CONTRIBUTORS_SUCCESS': 'updateContributors'
};

export default ContributorsStore;
