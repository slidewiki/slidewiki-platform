import {BaseStore} from 'fluxible/addons';

class ContributorsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.contributors = [];
    }
    updateContributors(payload) {
        this.contributors = payload.contributors;
        this.emitChange();
    }
    getState() {
        return {
            contributors: this.contributors
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.contributors = state.contributors;
    }
}

ContributorsStore.storeName = 'ContributorsStore';
ContributorsStore.handlers = {
    'LOAD_CONTRIBUTORS_SUCCESS': 'updateContributors'
};

export default ContributorsStore;
