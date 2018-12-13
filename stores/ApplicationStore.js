import BaseStore from 'fluxible/addons/BaseStore';
import RouteStore from './RouteStore';
import { Microservices } from '../configs/microservices';

class ApplicationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.pageTitle = '';
        this.pageThumbnail = '/assets/images/slideWiki-logo-linear.png'; //can add a default image here
        this.pageDescription = '';
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
    updatePageMetadata(payload) {
        this.dispatcher.waitFor(RouteStore, () => {
            let thumbnailTheme = payload.thumbnailTheme || 'default';
            this.pageThumbnail = Microservices.file.uri + '/thumbnail/slide/' + payload.thumbnailID + '/' + thumbnailTheme;
            this.pageDescription = payload.description;
            console.warn('!!! thumbnail:', this.pageThumbnail);
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
    getPageThumbnail() {
        return this.pageThumbnail;
    }
    getPageDescription() {
        // remove line breaks for page description
        return this.pageDescription.replace(/(\r\n\t|\n|\r\t)/gm,' ');
    }
    getActivationMessage(){
        return this.showActivationMessage;
    }
    dehydrate() {
        return {
            pageTitle: this.pageTitle,
            pageThumbnail: this.pageThumbnail,
            pageDescription: this.pageDescription,
            showActivationMessage: this.showActivationMessage,
        };
    }
    rehydrate(state) {
        this.pageTitle = state.pageTitle;
        this.pageThumbnail = state.pageThumbnail;
        this.pageDescription = state.pageDescription;
        this.showActivationMessage = state.showActivationMessage;
    }
}

ApplicationStore.storeName = 'ApplicationStore';
ApplicationStore.handlers = {
    'UPDATE_PAGE_TITLE': 'handlePageTitle',
    'LOAD_DECK_METADATA_SUCCESS': 'updatePageMetadata',
    'SHOW_ACTIVATION_MESSAGE': 'handleActivationMessage'
};

export default ApplicationStore;
