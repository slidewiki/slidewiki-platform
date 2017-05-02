import {BaseStore} from 'fluxible/addons';
import { isLocalStorageOn } from '../common.js';

class ContentModulesStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.moduleType = 'questions';
        this.moduleCount = {'questions': 0, 'datasource': 0, 'comments': 0, 'tags': 0};
        this.selector = {};
    }
    updateContentModules(payload) {
        this.moduleType = payload.moduleType;
        this.selector = payload.selector;
        this.emitChange();
    }
    updateModuleType(payload) {
        this.moduleType = payload.moduleType;
        this.emitChange();
    }
    updateDataSourceCount(payload) {
        this.moduleCount.datasource = payload.count;
        this.emitChange();
    }
    updateTagCount(payload) {
        let lastRevision = payload.slide.revisions[payload.slide.revisions.length - 1];
        this.moduleCount.tags = lastRevision.tags? 
            lastRevision.tags.length : 0;

        this.emitChange();
    }
    updateTagCountDeck(payload) {
        let lastRevision = payload.deckData.revisions[payload.deckData.revisions.length - 1];
        this.moduleCount.tags = lastRevision.tags?
            lastRevision.tags.length : 0;

        this.emitChange();
    }
    updateQuestionsCount(payload){
        this.moduleCount.questions = payload.count;
        this.emitChange();
    }
    updateCommentsCount(payload) {
        this.moduleCount.comments = payload.count;
        this.emitChange();
    }
    addCommentSuccess() {
        this.moduleCount.comments++;
        if (isLocalStorageOn()) {
            localStorage.setItem('commentsCount', this.moduleCount.comments);// save this to compare it later with rehydrated data
        }
        this.emitChange();
    }
    addTagSuccess() {
        this.moduleCount.tags++;
        this.emitChange();
    }
    removeTagSuccess() {
        this.moduleCount.tags--;
        this.emitChange();
    }
    updateDataSourcesSuccess(payload) {
        this.moduleCount.datasource = payload.dataSources.length;

        if (isLocalStorageOn()) {
            localStorage.setItem('sourcesCount', this.moduleCount.datasource);// save this to compare it later with rehydrated data
        }

        this.emitChange();
    }
    getState() {
        return {
            moduleType: this.moduleType,
            selector: this.selector,
            moduleCount: this.moduleCount
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.moduleType = state.moduleType;
        this.selector = state.selector;
        this.moduleCount = state.moduleCount;
    }
}

ContentModulesStore.storeName = 'ContentModulesStore';
ContentModulesStore.handlers = {
    'LOAD_CONTENT_MODULES_SUCCESS': 'updateContentModules',
    'UPDATE_MODULE_TYPE_SUCCESS': 'updateModuleType',
    'LOAD_AMOUNT_OF_DATA_SOURCES_SUCCESS': 'updateDataSourceCount',
    'LOAD_AMOUNT_OF_QUESTIONS_SUCCESS': 'updateQuestionsCount',
    'LOAD_AMOUNT_OF_COMMENTS_SUCCESS': 'updateCommentsCount',
    'LOAD_SLIDE_CONTENT_SUCCESS': 'updateTagCount',
    'LOAD_DECK_CONTENT_SUCCESS': 'updateTagCountDeck',
    'ADD_REPLY_SUCCESS': 'addCommentSuccess',
    'REMOVE_TAG': 'removeTagSuccess',
    'NEW_TAG': 'addTagSuccess',
    'ADD_COMMENT_SUCCESS': 'addCommentSuccess',
    'UPDATE_DATASOURCES_SUCCESS': 'updateDataSourcesSuccess',
    'LOAD_DATASOURCES_SUCCESS': 'updateDataSourcesSuccess'
};

export default ContentModulesStore;
