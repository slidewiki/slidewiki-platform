import {BaseStore} from 'fluxible/addons';

class TranslationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.translations = [];
        this.currentLang = {};
        this.supportedLangs = [];
        this.inProgress = false;
        this.slideToPreview = null;
        this.isCronjobModalOpen = false;
        this.translationProgress = 0;
        this.newId = null;
    }
    startTranslation(payload){
        this.inProgress = true;
        this.emitChange();
    }
    endTranslation(payload){
        this.inProgress = false;
        this.emitChange();
    }
    updateTranslations(payload) {
        this.translations = payload.translations;
        this.currentLang = payload.currentLang;
        this.emitChange();
    }
    loadSupportedLangs(payload) {
        this.supportedLangs = payload.supportedLangs;
        this.emitChange();
    }
    loadSlidePreview(payload) {
        this.slideToPreview = payload.slide;
        this.emitChange();
    }
    updateTranslationProgressBar(payload){
        this.translationProgress = payload.noofslides/payload.totalslides*100;
        this.emitChange();
    }
    //opens a modal with the info about translation cronjob
    toggleCronjobModal(){
        this.isCronjobModalOpen = !this.isCronjobModalOpen;
        this.emitChange();
    }
    setNewId(payload){
        this.newId = payload.newId;
        this.emitChange();
    }


    getSupportedLangs(){
        return {
            supportedLangs: this.supportedLangs
        };
    }
    getSlideToPreview(){
        return {
            slideToPreview: this.slideToPreview
        };
    }

    resetStore(){
        this.inProgress = false;
        this.translationProgress = 0;
        this.newId = null;
    }



    getState() {
        return {
            translations: this.translations,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs,
            inProgress: this.inProgress,
            slideToPreview: this.slideToPreview,
            isCronjobModalOpen: this.isCronjobModalOpen,
            translationProgress: this.translationProgress,
            newId: this.newId,
        };
    }

    dehydrate() {
        return {
            translations: this.translations,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs,
            inProgress: this.inProgress,
            slideToPreview: this.slideToPreview,
            isCronjobModalOpen: this.isCronjobModalOpen,
            translationProgress: this.translationProgress,
            newId: this.newId,
        };
    }
    rehydrate(state) {
        this.translations = state.translations;
        this.currentLang = state.currentLang;
        this.supportedLangs = state.supportedLangs;
        this.inProgress = state.inProgress;
        this.slideToPreview = state.slideToPreview;
        this.isCronjobModalOpen = state.isCronjobModalOpen;
        this.translationProgress = state.translationProgress;
        this.newId = state.newId;
    }

}

TranslationStore.storeName = 'TranslationStore';
TranslationStore.handlers = {
    'LOAD_TRANSLATIONS_SUCCESS': 'updateTranslations',
    'LOAD_SUPPORTED_LANGS_SUCCESS': 'loadSupportedLangs',
    'START_TRANSLATION' : 'startTranslation',
    'END_TRANSLATION' : 'endTranslation',
    'LOAD_SLIDE_PREVIEW_SUCCESS': 'loadSlidePreview',
    'TOGGLE_CRONJOB_MODAL': 'toggleCronjobModal',
    'UPDATE_TRANSLATION_PROGRESS_BAR': 'updateTranslationProgressBar',
    'SET_NEW_ID' : 'setNewId',
    'RESET_TRANSLATION_STORE' : 'resetStore',
};

export default TranslationStore;
