import {BaseStore} from 'fluxible/addons';

class TranslationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.translations = [];
        this.currentLang = {};
        this.supportedLangs = [];
        this.inProgress = false;
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
    getState() {
        return {
            translations: this.translations,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs,
            inProgress: this.inProgress
        };
    }
    getSupportedLangs(){
        return {
            supportedLangs: this.supportedLangs
        };
    }
    dehydrate() {
        return {
            translations: this.translations,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs,
            inProgress: this.inProgress
        };
    }
    rehydrate(state) {
        this.translations = state.translations;
        this.currentLang = state.currentLang;
        this.supportedLangs = state.supportedLangs;
        this.inProgress = state.inProgress;
    }

}

TranslationStore.storeName = 'TranslationStore';
TranslationStore.handlers = {
    'LOAD_TRANSLATIONS_SUCCESS': 'updateTranslations',
    'LOAD_SUPPORTED_LANGS_SUCCESS': 'loadSupportedLangs',
    'START_TRANSLATION' : 'startTranslation',
    'END_TRANSLATION' : 'endTranslation'
};

export default TranslationStore;
