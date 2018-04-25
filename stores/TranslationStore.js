import {BaseStore} from 'fluxible/addons';
import ISO6391 from 'iso-639-1';

class TranslationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.translations = [];
        this.currentLang = '';
        this.supportedLangs = [];
        this.inTranslationMode = false;
        this.originLanguage = '';
        this.nodeLanguage = '';

        this.supportedLangs = ISO6391.getAllNativeNames();
    }
    getState() {
        return {
            translations: this.translations,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs,
            inTranslationMode: this.inTranslationMode,
            originLanguage: this.originLanguage,
            nodeLanguage: this.nodeLanguage
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.translations = state.translations;
        this.currentLang = state.currentLang;
        this.supportedLangs = state.supportedLangs;
        this.inTranslationMode = state.inTranslationMode;
        this.originLanguage = state.originLanguage;
        this.nodeLanguage = state.nodeLanguage;
    }

    deckGotLoaded(data) {
        let deck = data.deckData;
        let revision = deck.revisions.find((r) => {
            return r.id === deck.active;
        }) || deck.revisions[0] || {};
        this.translations = revision.translations || [];
        this.originLanguage = this.shrinkLanguage(revision.language) || 'en';
        this.nodeLanguage = this.shrinkLanguage(this.originLanguage);
        this.emitChange();
        this.logState();
    }

    deckPropsGotLoaded(data) {
        this.translations = data.deckProps.translations;
        this.originLanguage = this.shrinkLanguage(data.deckProps.language);
        this.nodeLanguage = this.shrinkLanguage(data.deckProps.language);
        this.emitChange();
        this.logState();
    }

    changeCurrentLanguage(language) {
        if (!language)
            return;
        this.currentLang = this.shrinkLanguage(language);
        this.emitChange();
    }

    slideLoaded(data) {
        this.nodeLanguage = this.shrinkLanguage(data.slide.language);
        this.emitChange();
        this.logState();
    }

    logState() {
        console.log('TranslationStore state (this.translations, this.currentLang, this.inTranslationMode, this.originLanguage, this.nodeLanguage):', this.translations, ',', this.currentLang, ',', this.inTranslationMode, ',', this.originLanguage, ',', this.nodeLanguage);
    }

    shrinkLanguage(language) {
        try {
            return language.substring(0,2).toLowerCase();
        } catch (e) {
            return '';
        }
    }
}

TranslationStore.storeName = 'TranslationStore';
TranslationStore.handlers = {
    'LOAD_DECK_CONTENT_SUCCESS': 'deckGotLoaded',
    'TRANSLATION_CHANGE_CURRENT_LANGUAGE': 'changeCurrentLanguage',
    'LOAD_DECK_PROPS_SUCCESS': 'deckPropsGotLoaded',
    'LOAD_SLIDE_CONTENT_SUCCESS': 'slideLoaded',
    'LOAD_SLIDE_EDIT_SUCCESS': 'slideLoaded'
};

export default TranslationStore;
