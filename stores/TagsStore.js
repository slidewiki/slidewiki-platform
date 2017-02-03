import {BaseStore} from 'fluxible/addons';

class TagsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.tags = [];
        this.showAllTags = false;
        this.tag = undefined;
        this.selectedIndex = -1;
        this.contentOwner = 0;
        this.selector = {};
    }
    loadTags(payload) {
        this.tags = payload.tags;
        this.selector = payload.selector;
        this.tag = undefined;
        this.selectedIndex = -1;
        this.contentOwner = payload.owner;
        this.emitChange();
    }
    loadTag(payload) {
        this.tag = this.tags[payload.dsindex];
        this.selectedIndex = payload.dsindex;
        this.emitChange();
    }
    updateTags(payload) {
        this.tags = payload.tags;
        this.tag = undefined;
        this.selectedIndex = -1;
        this.emitChange();
    }
    newTag() {
        this.tag = null;
        this.emitChange();
    }
    cancelEditTag() {
        this.tag = undefined;
        this.selectedIndex = -1;
        this.emitChange();
    }
    handleShowAllTags() {
        this.showAllTags = true;
        this.emitChange();
    }
    getState() {
        return {
            tags: this.tags,
            showAllTags: this.showAllTags,
            tag: this.tag,
            selectedIndex: this.selectedIndex,
            contentOwner: this.contentOwner,
            selector: this.selector,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.tags = state.tags;
        this.showAllTags = state.showAllTags;
        this.tag = state.tag;
        this.selectedIndex = state.selectedIndex;
        this.contentOwner = state.contentOwner;
        this.selector = state.selector;
    }
}

TagsStore.storeName = 'TagsStore';
TagsStore.handlers = {
    'LOAD_TAGS_SUCCESS': 'loadTags',
    'LOAD_TAG': 'loadTag',
    'NEW_TAG': 'newTag',
    'SHOW_ALL_TAGS': 'handleShowAllTags',
    'UPDATE_TAGS_SUCCESS': 'updateTags',
    'CANCEL_EDIT_TAGS': 'cancelEditTag'
};

export default TagsStore;
