import BaseStore from 'fluxible/addons/BaseStore';
import RouteStore from './RouteStore';

class ApplicationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.pageTitle = '';
        this.showActivationMessage = false;
        //this.frozen = false;
    }
    handlePageTitle(payload) {
        this.dispatcher.waitFor(RouteStore, () => {
            //if (!this.frozen || payload.allowUnfreeze) {
            this.pageTitle = payload.pageTitle;
            //    this.frozen = payload.frozen;
            //}
            this.emitChange();
        });
    }
    handleActivationMessage(payload) {
        this.showActivationMessage = true;
        this.emitChange();
    }
    getPageTitle() {
        return this.pageTitle;
    }
    getActivationMessage(){
        return this.showActivationMessage;
    }
    dehydrate() {
        return {
            pageTitle: this.pageTitle,
            showActivationMessage: this.showActivationMessage
        };
    }
    rehydrate(state) {
        this.pageTitle = state.pageTitle;
        this.showActivationMessage = state.showActivationMessage;
    }
}

ApplicationStore.storeName = 'ApplicationStore';
ApplicationStore.handlers = {
    'UPDATE_PAGE_TITLE': 'handlePageTitle',
    'SHOW_ACTIVATION_MESSAGE': 'handleActivationMessage'
};

export default ApplicationStore;
