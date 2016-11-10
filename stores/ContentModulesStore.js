import {BaseStore} from 'fluxible/addons';

class ContentModulesStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.moduleType = 'questions';
        this.moduleCount = {'questions': 0, 'datasource': 0, 'comments': 0};
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
        this.emitChange();
    }
    updateDataSourcesSuccess(payload) {
        this.moduleCount.datasource = payload.dataSources.length;
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
    'ADD_REPLY_SUCCESS': 'addCommentSuccess',
    'ADD_COMMENT_SUCCESS': 'addCommentSuccess',
    'UPDATE_DATASOURCES_SUCCESS': 'updateDataSourcesSuccess'
};

export default ContentModulesStore;
