import {BaseStore} from 'fluxible/addons';

class TranslationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.translations = [];
        this.currentLang = {};
        this.supportedLangs = [];
        this.inProgress = false;
        this.slideToPreview = null;
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

    getState() {
        return {
            translations: this.translations,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs,
            inProgress: this.inProgress,
            slideToPreview: this.slideToPreview,
        };
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
    dehydrate() {
        return {
            translations: this.translations,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs,
            inProgress: this.inProgress,
            slideToPreview: this.slideToPreview,
        };
    }
    rehydrate(state) {
        this.translations = state.translations;
        this.currentLang = state.currentLang;
        this.supportedLangs = state.supportedLangs;
        this.inProgress = state.inProgress;
        this.slideToPreview = state.slideToPreview;
    }

}

TranslationStore.storeName = 'TranslationStore';
TranslationStore.handlers = {
    'LOAD_TRANSLATIONS_SUCCESS': 'updateTranslations',
    'LOAD_SUPPORTED_LANGS_SUCCESS': 'loadSupportedLangs',
    'START_TRANSLATION' : 'startTranslation',
    'END_TRANSLATION' : 'endTranslation',
    'LOAD_SLIDE_PREVIEW_SUCCESS': 'loadSlidePreview'
};

export default TranslationStore;
