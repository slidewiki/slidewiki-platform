import {BaseStore} from 'fluxible/addons';

class TranslationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.translations = [];
        this.currentLang = '';
        this.supportedLangs = ['sr-RS', 'es-ES', 'nl-NL', 'it-IT', 'pt-PT', 'el-GR', 'de-DE', 'en-GB'];
        this.inTranslationMode = false;
        this.originLanguage = '';
        this.nodeLanguage = '';
        this.treeLanguage = '';
        this.redirectToNewLanguage = false;
    }
    getState() {
        return {
            translations: this.translations,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs,
            inTranslationMode: this.inTranslationMode,
            originLanguage: this.originLanguage,
            nodeLanguage: this.nodeLanguage,
            treeLanguage: this.treeLanguage,
            redirectToNewLanguage: this.redirectToNewLanguage
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
        this.treeLanguage = state.treeLanguage;
        this.redirectToNewLanguage = state.redirectToNewLanguage;
    }

    deckGotLoaded(data) { //TODO only override if deck is root deck!
        let deck = data.deckData;
        let revision = deck.revisions.find((r) => {
            return r.id === deck.active;
        }) || deck.revisions[0] || {};
        // this.translations = revision.translations || [];
        this.originLanguage = this.shrinkLanguage(revision.language) || 'en';
        this.nodeLanguage = this.shrinkLanguage(this.originLanguage);
        this.emitChange();
        this.logState();
    }

    deckPropsGotLoaded(data) {
        // this.translations = data.deckProps.translations;
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

    translationsLoaded(translations) {
        this.translations = translations;
        this.emitChange();
        this.logState();
    }

    deckTreeGotLoaded(data) {
        this.treeLanguage = data.deckTree.language;
        this.emitChange();
        this.logState();
    }

    translationAdded(data) {
        this.translations.push(data.language);
        this.currentLang = data.language;
        this.inTranslationMode = true;
        this.redirectToNewLanguage = true;
        this.emitChange();
        this.redirectToNewLanguage = false;
    }

    //-- util functions --

    logState() {
        console.log('TranslationStore state (this.translations, this.currentLang, this.inTranslationMode, this.originLanguage, this.nodeLanguage, this.treeLanguage):', this.translations, ',', this.currentLang, ',', this.inTranslationMode, ',', this.originLanguage, ',', this.nodeLanguage, ',', this.treeLanguage);
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
    'LOAD_SLIDE_EDIT_SUCCESS': 'slideLoaded',
    'LOAD_DECK_TRANSLATIONS_SUCCESS': 'translationsLoaded',
    'LOAD_DECK_TREE_SUCCESS': 'deckTreeGotLoaded',
    'ADD_DECK_TRANSLATION_SUCCESS': 'translationAdded'
};

export default TranslationStore;
