import {BaseStore} from 'fluxible/addons';

class TranslationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.translations = [];
        this.currentLang = '';
        this.supportedLangs = [];
    }
    getState() {
        return {
            translations: this.translations,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs
        };
    }
    dehydrate() {
        return {
            translations: this.translations,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs
        };
    }
    rehydrate(state) {
        this.translations = state.translations;
        this.currentLang = state.currentLang;
        this.supportedLangs = state.supportedLangs;
    }

}

TranslationStore.storeName = 'TranslationStore';
TranslationStore.handlers = {
    
};

export default TranslationStore;
