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
    }
    getState() {
        return {
            translations: this.translations,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs,
            inTranslationMode: this.inTranslationMode,
            originLanguage: this.originLanguage,
            nodeLanguage: this.nodeLanguage,
            treeLanguage: this.treeLanguage
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
    }

    deckGotLoaded(data) {
        let deck = data.deckData;
        let revision = deck.revisions.find((r) => {
            return r.id === deck.active;
        }) || deck.revisions[0] || {};
        console.log('TranslationStore deckGotLoaded deckdata', data, '\n', data.deckData, '\n', revision);
        this.nodeLanguage = revision.language || 'en-GB';

        if (data.isRootDeck)
            this.getAndSetOriginalLanguage(revision.variants, this.nodeLanguage);

        this.emitChange();
        this.logState('deckGotLoaded');
    }

    deckPropsGotLoaded(data) {
        console.log('TranslationStore deckPropsGotLoaded deckdata', data.deckProps);
        this.nodeLanguage = data.deckProps.language;
        this.emitChange();
        this.logState('deckPropsGotLoaded');
    }

    changeCurrentLanguage(language) {
        if (!language)
            return;
        this.currentLang = language;
        if (this.currentLang !== this.originLanguage)
            this.inTranslationMode = true;
        else
            this.inTranslationMode = false;
        this.emitChange();
    }

    slideLoaded(data) {
        this.nodeLanguage = data.slide.language;
        this.emitChange();
        this.logState('slideLoaded');
    }

    translationsLoaded(translations) {
        this.translations = translations;
        this.emitChange();
        this.logState('translationsLoaded');
    }

    deckTreeGotLoaded(data) {
        console.log('TranslationStore deckTreeGotLoaded decktreedata', data.deckTree);
        this.treeLanguage = data.deckTree.language;

        this.getAndSetOriginalLanguage(data.deckTree.variants, data.deckTree.language);

        this.emitChange();
        this.logState('deckTreeGotLoaded');
    }

    translationAdded(data) {
        this.translations.push(data.language);
        this.currentLang = data.language;
        this.inTranslationMode = true;
        this.emitChange();
    }

    addedSlideTranslation(data) {
        this.nodeLanguage = node.language;
        this.emitChange();
    }

    //-- util functions --

    logState(functionName = '') {
        console.log('TranslationStore state (this.translations, this.currentLang, this.inTranslationMode, this.originLanguage, this.nodeLanguage, this.treeLanguage):', this.translations, ',', this.currentLang, ',', this.inTranslationMode, ',', this.originLanguage, ',', this.nodeLanguage, ',', this.treeLanguage, 'by', functionName);
    }

    getAndSetOriginalLanguage(variants, fallback) {
        let variant = variants.find((variant) => {
            return variant.original;
        });
        if (variant && variant.language)
            this.originLanguage = variant.language;
        else
            this.originLanguage = fallback || 'en-GB';

        return this.originLanguage;
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
    'ADD_DECK_TRANSLATION_SUCCESS': 'translationAdded',
    'ADD_SLIDE_TRANSLATION_SUCCESS': 'addedSlideTranslation'
};

export default TranslationStore;
