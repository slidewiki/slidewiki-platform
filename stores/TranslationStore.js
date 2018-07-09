import {BaseStore} from 'fluxible/addons';
import {translationLanguages, compareLanguageCodes} from '../common';

class TranslationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.translations = [];
        this.variants = [];
        this.currentLang = '';
        this.supportedLangs = translationLanguages;
        this.inTranslationMode = false;
        this.originLanguage = '';
        this.nodeLanguage = '';
        this.treeLanguage = '';
        this.isLoading = false;
        this.invalidLanguage = false;
        this.treeTranslations = [];
    }
    getState() {
        return {
            translations: this.translations,
            variants: this.variants,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs,
            inTranslationMode: this.inTranslationMode,
            originLanguage: this.originLanguage,
            nodeLanguage: this.nodeLanguage,
            treeLanguage: this.treeLanguage,
            isLoading: this.isLoading,
            invalidLanguage: this.invalidLanguage,
            treeTranslations: this.treeTranslations
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.translations = state.translations;
        this.variants = state.variants;
        this.currentLang = state.currentLang;
        this.supportedLangs = state.supportedLangs;
        this.inTranslationMode = state.inTranslationMode;
        this.originLanguage = state.originLanguage;
        this.nodeLanguage = state.nodeLanguage;
        this.treeLanguage = state.treeLanguage;
        this.isLoading = state.isLoading;
        this.invalidLanguage = state.invalidLanguage;
        this.treeTranslations = state.treeTranslations;
    }

    // TODO remove this
    deckGotLoaded(data) {
        let deck = data.deckData;
        // console.log('TranslationStore deckGotLoaded deckdata', data.deckData);
        this.nodeLanguage = deck.language.replace('_', '-');

        // if (data.isRootDeck)
        //     this.getAndSetOriginalLanguage(deck.variants || [], this.nodeLanguage);

        this.invalidLanguage = false;

        this.emitChange();
        this.logState('deckGotLoaded');
    }

    // TODO remove this
    deckPropsGotLoaded(data) {
        console.log('TranslationStore deckPropsGotLoaded deckdata', data.deckProps);
        this.nodeLanguage = data.deckProps.language.replace('_', '-');
        this.invalidLanguage = false;
        this.emitChange();
        // this.logState('deckPropsGotLoaded');
    }

    // TODO remove this
    changeCurrentLanguage(language) {
        if (!language) {
            this.currentLang = '';
            this.emitChange();
            this.logState('changeCurrentLanguage');
            return;
        }

        this.currentLang = language.replace('_', '-');
        this.inTranslationMode = this.recomputeTranslationMode();

        this.emitChange();
        this.logState('changeCurrentLanguage');
    }

    recomputeTranslationMode() {
        if (!this.currentLang) return false;

        if (this.originLanguage) {
            if (compareLanguageCodes(this.currentLang, this.originLanguage))
                return false;
            else
                return true;
        }
        else if (this.translations.length) {
            let translation = this.translations.find(this.current);
            return this.translations.indexOf(this.currentLang) > -1;
        }
        else {
            return false;
        }
    }

    // TODO remove this
    slideLoaded(data) {
        // console.log('TranslationStore slideLoaded slide', data.slide);
        this.nodeLanguage = data.slide.language.replace('_', '-') ;
        this.invalidLanguage = false;
        this.emitChange();
        this.logState('slideLoaded');
    }

    translationsLoaded(payload) {
        // console.log('TranslationStore translationsLoaded node', payload);

        // get selected language (if any)
        if (!payload.language) {
            this.currentLang = '';
        } else {
            this.currentLang = payload.language.replace('_', '-');
        }

        // set primary language
        let primaryVariant = payload.translations.find((v) => !!v.original);
        if (primaryVariant) {
            this.originLanguage = primaryVariant.language.replace('_', '-');
        } else {
            this.originLanguage = 'en';
        }

        // update translations
        this.translations = payload.translations.filter((v) => !v.original).map((cur) => cur.language.replace('_', '-'));
        this.variants = payload.translations;

        // check if current language is part of translations...
        if (!this.currentLang || this.translations.indexOf(this.currentLang) < 0) {
            // set to original if not
            this.nodeLanguage = this.originLanguage;
        } else {
            console.log(this.translations.indexOf(this.currentLang));
            // otherwise it's it
            this.nodeLanguage = this.currentLang;
        }

        // also reset the invalid flag
        this.invalidLanguage = false;

        // always recompute translation mode based on current language
        this.inTranslationMode = this.recomputeTranslationMode();

        this.emitChange();
        this.logState('translationsLoaded');
    }

    deckTreeGotLoaded(data) {
        console.log('TranslationStore deckTreeGotLoaded decktreedata', data.deckTree, '\n', data.deckTree.children[1]);
        this.treeLanguage = data.deckTree.language.replace('_', '-');

        this.treeTranslations = data.deckTree.variants.filter((v) => !v.original).map((cur) => cur.language.replace('_', '-'));

        this.emitChange();
        // this.logState('deckTreeGotLoaded');
    }

    // TODO remove this
    newLoadingState(state) {
        this.isLoading = state;
        this.emitChange();
    }

    // TODO remove this
    reset() {
        this.translations = [];
        this.variants = [];
        this.currentLang = '';
        this.inTranslationMode = false;
        this.originLanguage = '';
        this.nodeLanguage = '';
        this.treeLanguage = '';
        this.isLoading = false;
        this.invalidLanguage = false;
    }

    // TODO remove this
    validateLanguage(language) {
        // console.log('validateLanguage got', language, 'and has', this.originLanguage, this.translations);
        if (!language)
            language = this.currentLang;
        if (language && language !== this.originLanguage && this.translations.indexOf(language) === -1) {
            this.invalidLanguage = true;
            this.emitChange();
        }
    }

    //-- util functions --

    logState(functionName = '') {
        console.log(functionName, this.getState());
    }

    // TODO remove this
    getAndSetOriginalLanguage(variants = [], fallback) {
        let variant = variants.find((variant) => {
            return variant.original;
        });
        if (variant && variant.language)
            this.originLanguage = variant.language.replace('_', '-');
        else
            this.originLanguage = fallback.replace('_', '-');

        // also reset the invalid flag
        this.invalidLanguage = false;
    }

}

TranslationStore.storeName = 'TranslationStore';
TranslationStore.handlers = {
    // 'LOAD_DECK_CONTENT_SUCCESS': 'deckGotLoaded',
    // 'TRANSLATION_CHANGE_CURRENT_LANGUAGE': 'changeCurrentLanguage',
    // 'LOAD_DECK_PROPS_SUCCESS': 'deckPropsGotLoaded',
    // 'LOAD_SLIDE_CONTENT_SUCCESS': 'slideLoaded',
    // 'LOAD_SLIDE_EDIT_SUCCESS': 'slideLoaded',
    'LOAD_TRANSLATIONS_SUCCESS': 'translationsLoaded',
    'LOAD_DECK_TREE_SUCCESS': 'deckTreeGotLoaded',
    // 'TRANSLATION_NEW_LOADING_STATE': 'newLoadingState',
    // 'TRANSLATION_RESET': 'reset',
    // 'TRANSLATION_VALIDATE_LANGUAGE': 'validateLanguage'
};

export default TranslationStore;
