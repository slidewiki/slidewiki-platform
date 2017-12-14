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
    //opens a modal with the info about translation cronjob
    toggleCronjobModal(){
        this.isCronjobModalOpen = !this.isCronjobModalOpen;
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



    getState() {
        return {
            translations: this.translations,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs,
            inProgress: this.inProgress,
            slideToPreview: this.slideToPreview,
            isCronjobModalOpen: this.isCronjobModalOpen,
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
        };
    }
    rehydrate(state) {
        this.translations = state.translations;
        this.currentLang = state.currentLang;
        this.supportedLangs = state.supportedLangs;
        this.inProgress = state.inProgress;
        this.slideToPreview = state.slideToPreview;
        this.isCronjobModalOpen = state.isCronjobModalOpen;
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
};

export default TranslationStore;
