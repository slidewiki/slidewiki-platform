import {BaseStore} from 'fluxible/addons';
import {translationLanguages, compareLanguageCodes} from '../common';

class TranslationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.translations = [];
        this.nodeVariants = [];
        this.currentLang = '';
        this.supportedLangs = translationLanguages;
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
        this.originLanguage = state.originLanguage;
        this.nodeLanguage = state.nodeLanguage;
        this.treeLanguage = state.treeLanguage;
        this.treeTranslations = state.treeTranslations;
    }

    deckGotLoaded(data) {
        // console.log('TranslationStore deckGotLoaded deckdata', data.deckData);
        if (data.deckData.language) {
            this.nodeLanguage = data.deckData.language.substring(0, 2);

            this.emitChange();
        }
        
        // this.logState('deckGotLoaded');
    }

    deckPropsGotLoaded(data) {
        // console.log('TranslationStore deckPropsGotLoaded deckdata', data.deckProps);
        if (data.deckProps.language) {
            this.nodeLanguage = data.deckProps.language.substring(0, 2);

            this.emitChange();
        }
        
        // this.logState('deckPropsGotLoaded');
    }

    slideLoaded(data) {
        // console.log('TranslationStore slideLoaded slide', data.slide);
        if (data.slide.language) {
            this.nodeLanguage = data.slide.language.substring(0, 2) ;

            this.emitChange();
        }
        
        // this.logState('slideLoaded');
    }

    translationsLoaded(payload) {
        // console.log('TranslationStore translationsLoaded node', payload);

        // get selected language (if any)
        if (!payload.language) {
            this.currentLang = '';
        } else {
            this.currentLang = payload.language.substring(0, 2);
        }

        // set primary language
        let primaryVariant = payload.translations.find((v) => v.original);
        if (primaryVariant && primaryVariant.language) {
            this.originLanguage = primaryVariant.language.substring(0, 2);
        }

        // update translations
        this.translations = payload.translations.filter((v) => !v.original && v.language).map((cur) => cur.language.substring(0, 2));
        this.nodeVariants = payload.translations;

        this.emitChange();
        // this.logState('translationsLoaded');
    }

    deckTreeGotLoaded(data) {
        this.treeLanguage = data.deckTree.variants.find((v) => v.original).language;
        this.treeTranslations = data.deckTree.variants.filter((v) => !v.original && v.language).map((cur) => cur.language.substring(0, 2));

        this.emitChange();
        // this.logState('deckTreeGotLoaded');
    }

    //-- util functions --

    logState(functionName = '') {
        let state = this.getState();
        delete state.supportedLangs;
        console.log(functionName, state);
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
