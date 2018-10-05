import {BaseStore} from 'fluxible/addons';
import {translationLanguages, compareLanguageCodes} from '../common';

class TranslationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.translations = [];
        this.nodeVariants = [];
        this.currentLang = '';
        this.supportedLangs = translationLanguages;
        this.inTranslationMode = false;
        this.originLanguage = '';
        this.nodeLanguage = '';
        this.treeLanguage = '';
        this.treeTranslations = [];
    }
    getState() {
        return {
            translations: this.translations,
            nodeVariants: this.nodeVariants,
            currentLang: this.currentLang,
            supportedLangs: this.supportedLangs,
            inTranslationMode: this.inTranslationMode,
            originLanguage: this.originLanguage,
            nodeLanguage: this.nodeLanguage,
            treeLanguage: this.treeLanguage,
            treeTranslations: this.treeTranslations
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.translations = state.translations;
        this.nodeVariants = state.nodeVariants;
        this.currentLang = state.currentLang;
        this.supportedLangs = state.supportedLangs;
        this.inTranslationMode = state.inTranslationMode;
        this.originLanguage = state.originLanguage;
        this.nodeLanguage = state.nodeLanguage;
        this.treeLanguage = state.treeLanguage;
        this.treeTranslations = state.treeTranslations;
    }

    deckGotLoaded(data) {
        // console.log('TranslationStore deckGotLoaded deckdata', data.deckData);
        this.nodeLanguage = data.deckData.language.replace('_', '-');

        this.emitChange();
        // this.logState('deckGotLoaded');
    }

    deckPropsGotLoaded(data) {
        // console.log('TranslationStore deckPropsGotLoaded deckdata', data.deckProps);
        this.nodeLanguage = data.deckProps.language.replace('_', '-');

        this.emitChange();
        // this.logState('deckPropsGotLoaded');
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

    slideLoaded(data) {
        // console.log('TranslationStore slideLoaded slide', data.slide);
        this.nodeLanguage = data.slide.language.replace('_', '-') ;

        this.emitChange();
        // this.logState('slideLoaded');
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
        let primaryVariant = payload.translations.find((v) => v.original);
        if (primaryVariant) {
            this.originLanguage = primaryVariant.language.replace('_', '-');
        }

        // update translations
        this.translations = payload.translations.filter((v) => !v.original).map((cur) => cur.language.replace('_', '-'));
        this.nodeVariants = payload.translations;

        // check if current language is part of translations...
        if (!this.currentLang || this.translations.indexOf(this.currentLang) < 0) {
            // set to original if not
            this.nodeLanguage = this.originLanguage;
        } else {
            // otherwise it's it
            this.nodeLanguage = this.currentLang;
        }

        // always recompute translation mode based on current language
        this.inTranslationMode = this.recomputeTranslationMode();

        this.emitChange();
        // this.logState('translationsLoaded');
    }

    deckTreeGotLoaded(data) {
        this.treeLanguage = data.deckTree.variants.find((v) => v.original).language;
        this.treeTranslations = data.deckTree.variants.filter((v) => !v.original).map((cur) => cur.language.replace('_', '-'));

        this.emitChange();
        // this.logState('deckTreeGotLoaded');
    }

    //-- util functions --

    logState(functionName = '') {
        console.log(functionName, this.getState());
    }

}

TranslationStore.storeName = 'TranslationStore';
TranslationStore.handlers = {
    'LOAD_DECK_CONTENT_SUCCESS': 'deckGotLoaded',
    'LOAD_DECK_PROPS_SUCCESS': 'deckPropsGotLoaded',
    'LOAD_SLIDE_CONTENT_SUCCESS': 'slideLoaded',
    'LOAD_SLIDE_EDIT_SUCCESS': 'slideLoaded',
    'LOAD_TRANSLATIONS_SUCCESS': 'translationsLoaded',
    'LOAD_DECK_TREE_SUCCESS': 'deckTreeGotLoaded',
};

export default TranslationStore;
