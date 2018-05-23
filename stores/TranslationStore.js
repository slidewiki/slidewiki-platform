import {BaseStore} from 'fluxible/addons';

class TranslationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.translations = [];
        this.currentLang = '';
        this.supportedLangs = ['sr-RS', 'es-ES', 'nl-NL', 'it-IT', 'pt-PT', 'el-GR', 'de-DE', 'en-GB', 'lt-LT', 'fr-FR'];
        this.inTranslationMode = false;
        this.originLanguage = '';
        this.nodeLanguage = '';
        this.treeLanguage = '';
        this.isLoading = false;
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
            isLoading: this.isLoading
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
        this.isLoading = state.isLoading;
    }

    deckGotLoaded(data) {
        let deck = data.deckData;
        let revision = deck.revisions.find((r) => {
            return r.id === deck.active;
        }) || deck.revisions[0] || {};
        console.log('TranslationStore deckGotLoaded deckdata', data.deckData, '\n', revision);
        this.nodeLanguage = revision.language.replace('_', '-') || 'en-GB';

        if (data.isRootDeck)
            this.getAndSetOriginalLanguage(revision.variants, this.nodeLanguage);

        this.emitChange();
        this.logState('deckGotLoaded');
    }

    deckPropsGotLoaded(data) {
        console.log('TranslationStore deckPropsGotLoaded deckdata', data.deckProps);
        this.nodeLanguage = data.deckProps.language.replace('_', '-') ;
        this.emitChange();
        this.logState('deckPropsGotLoaded');
    }

    changeCurrentLanguage(language) {
        if (!language)
            return;
        this.currentLang = language.replace('_', '-');
        if (this.originLanguage) {
            if (this.currentLang !== this.originLanguage)
                this.inTranslationMode = true;
            else
                this.inTranslationMode = false;
        }
        else {
            this.inTranslationMode = this.translations.indexOf(this.currentLang) !== -1;
        }

        this.emitChange();
        this.logState('changeCurrentLanguage');
    }

    slideLoaded(data) {
        console.log('TranslationStore slideLoaded slide', data.slide);
        this.nodeLanguage = data.slide.language.replace('_', '-') ;
        this.emitChange();
        this.logState('slideLoaded');
    }

    translationsLoaded(translations) {
        this.translations = translations.reduce((arr, cur) => {
            arr.push(cur.replace('_', '-'));
            return arr;
        }, []);
        this.emitChange();
        this.logState('translationsLoaded');
    }

    deckTreeGotLoaded(data) {
        console.log('TranslationStore deckTreeGotLoaded decktreedata', data.deckTree, '\n', data.deckTree.children[1]);
        this.treeLanguage = data.deckTree.language.replace('_', '-') ;

        let updateTranslationMode = false;
        if (!this.originLanguage) {
            updateTranslationMode = true;
        }

        this.getAndSetOriginalLanguage(data.deckTree.variants, this.treeLanguage);

        if (updateTranslationMode) {
            if (this.currentLang !== this.originLanguage)
                this.inTranslationMode = true;
            else
                this.inTranslationMode = false;
        }

        this.emitChange();
        this.logState('deckTreeGotLoaded');
    }

    newLoadingState(state) {
        this.isLoading = state;
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
            this.originLanguage = variant.language.replace('_', '-') ;
        else
            this.originLanguage = fallback.replace('_', '-')  || 'en-GB';

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
    'TRANSLATION_NEW_LOADING_STATE': 'newLoadingState'
};

export default TranslationStore;
