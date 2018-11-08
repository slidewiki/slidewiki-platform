import BaseStore from 'fluxible/addons/BaseStore';
import RouteStore from './RouteStore';

class ApplicationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.pageTitle = '';
        this.pageThumbnail = '/assets/images/slideWiki-logo-linear.png'; //can add a default image here
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
            this.pageThumbnail = '/thumbnail/slide/' + payload.thumbnailID;
            this.emitChange();
        });
    }
    getPageTitle() {
        return this.pageTitle;
    }
    getPageThumbnail() {
        return this.pageThumbnail;
    }
    dehydrate() {
        return {
            pageTitle: this.pageTitle,
            pageThumbnail: this.pageThumbnail
        };
    }
    rehydrate(state) {
        this.pageTitle = state.pageTitle;
        this.pageThumbnail = state.pageThumbnail;
    }
}

ApplicationStore.storeName = 'ApplicationStore';
ApplicationStore.handlers = {
    'UPDATE_PAGE_TITLE': 'handlePageTitle',
    'LOAD_DECK_METADATA_SUCCESS': 'updatePageMetadata'
};

export default ApplicationStore;
