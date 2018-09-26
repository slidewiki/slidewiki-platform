import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import ISO6391 from 'iso-639-1';
import {Microservices} from '../../configs/microservices';

class Translations extends React.Component {

/*
  1. GET deckservice/decktree/:ID and extract variants[]:language
  2. GET deckservice/decktree/:ID?language=... and make sure each language in children[]:language is the requested one (100% translated)
  3. Offer dialog to user
  3. Build up a MAP (id(primary) --> MAP(lang --> slideID)) and use Map.get(sid).get(lang) to retreive the sid of the translated slide
  4. New URI comes in - use map and modify the URI to use the correct sid
*/

    constructor(props) {
        super(props);

        this.state = {
            translationsAvailable: false,
        };
        this.translationMap = new Map();
        this.translationMapByLanguage = new Map();
        this.languages = [];
        this.deckLanguage = undefined;
        this.chosenLanguage = undefined;
    }

    createTranslationMap(deckID, deckLanguage) {

        let translationMap = new Map();
        let languages = [];

        let result = this.processPrimaryLangauge(deckID, translationMap, languages); //translationMap: MAP{INT -> MAP{LANG -> slideID}}
        this.deckLanguage = (deckLanguage) ? deckLanguage : result[0];
        this.chosenLanguage = this.deckLanguage;
        languages = result[1];
        translationMap = result[2];

        console.log(languages, this.deckLanguage, translationMap);

        languages.forEach((lang) => {
            translationMap = this.processTranslation(translationMap, lang);
        });


        if(translationMap.get(0).size >= 1) {
            //translations are available
            this.translationMap = translationMap;
            this.setTranslationMapWithInitialLanguage(this.deckLanguage);
            console.log(this.translationMap);
            console.log(this.translationMapByLanguage);
            this.setState({translationsAvailable: true});
            this.openChooseLanguageModal();
        } else {
            //only primary langauge available
        }
    }

    processPrimaryLangauge(deckID, translationMap, languages) {
        //GET e.g. deckservice/decktree/4492
        console.log(Microservices.deck + '/decktree/' + deckID);
        $.get(Microservices.deck.uri + '/decktree/' + deckID).done((deckTree) => {
            console.log(deckTree);
        }).fail((jqxhr, status, error) => console.log(status, error));
        let deckTree = {'type':'deck','id':'4492-1','revisionId':1,'latestRevisionId':1,'title':'Translation Test Deck','language':'en','theme':'default','allowMarkdown':false,'variants':[{'language':'de','title':'Übersetzungst-Deck','description':'Test Beschreibung'},{'language':'es'},{'language':'en','title':'Translation Test Deck','original':true}],'children':[{'type':'slide','id':'37645-3','title':'New slide','language':'en','theme':'default','allowMarkdown':false},{'type':'slide','id':'37647-2','title':'New slide','language':'en','theme':'default','allowMarkdown':false}]};

        let primaryLanguage = deckTree.language;
        languages = deckTree.variants.map((variant) => variant.language);
        this.languages = deckTree.variants.map((variant) => variant.language);
        deckTree.children.forEach((el, index) => {
            let tmp = new Map();
            tmp.set(deckTree.language, el.id);
            translationMap.set(index, tmp);
        });
        languages = languages.filter((el) => el !== primaryLanguage); //remove processed lang from array
        return [primaryLanguage, languages, translationMap];
    }

    processTranslation(translationMap, languageToProcess) {
        //Get language from server, e.g. - GET deckservice/decktree/4492?language=de
        let deckTree;
        if(languageToProcess === 'de')
            deckTree = {'type':'deck','id':'4492-1','revisionId':1,'latestRevisionId':1,'title':'Übersetzungst-Deck','language':'de','theme':'default','allowMarkdown':false,'variants':[{'language':'en','title':'Translation Test Deck','original':true},{'language':'de','title':'Übersetzungst-Deck','description':'Test Beschreibung'}],'children':[{'type':'slide','id':'37646-2','title':'New slide','language':'de','theme':'default','allowMarkdown':false},{'type':'slide','id':'37648-2','title':'New slide','language':'de','theme':'default','allowMarkdown':false}]};
        else
            deckTree = {'type':'deck','id':'4492-1','revisionId':1,'latestRevisionId':1,'title':'Translation Test Deck','language':'es','theme':'default','allowMarkdown':false,'variants':[{'language':'en','original':true},{'language':'de','title':'Übersetzungst-Deck','description':'Test Beschreibung'},{'language':'es'}],'children':[{'type':'slide','id':'40985-2','title':'New slide','language':'es','theme':'default','allowMarkdown':false},{'type':'slide','id':'40986-2','title':'New slide','language':'es','theme':'default','allowMarkdown':false}]};
        let currentLanguage = deckTree.language;
        let slideLanguages = deckTree.children.map((slide) => slide.language);
        if(slideLanguages.every((el) => el === currentLanguage)) {
            deckTree.children.forEach((child, index) => {
                translationMap.get(index).set(deckTree.language, child.id);
            });
        }
        return translationMap;
    }

    setTranslationMapWithInitialLanguage(lang) {
        let translationMapByLanguage = new Map();
        this.translationMap.forEach((el, index) => {
            let key = el.get(lang);
            let value = new Map(el);
            value.delete(lang);
            translationMapByLanguage.set(key, value);
        });
        this.translationMapByLanguage = translationMapByLanguage;//translationMap: MAP{slideID(ofLanguage) -> MAP{LANG -> slideID}}*/
    }

    modifyURLtoLoad(url){
        if(this.chosenLanguage === this.deckLanguage)
            return url;
        let currentSlide = url.split('slide-')[1];
        let newURL = url.split('slide-')[0] + 'slide-' + this.translationMapByLanguage.get(currentSlide).get(this.chosenLanguage);
        newURL = newURL.replace('language='+this.deckLanguage, 'language='+this.chosenLanguage);
        return newURL;
    }

    changeLanguage(lang){
        console.log(lang);
        this.chosenLanguage = lang;
        this.props.triggerReloadIframe();
    }

    openChooseLanguageModal() {

        let that = this;
        let tmp = {};
        ISO6391.getAllCodes().forEach((code) => {
            if(this.languages.includes(''+code))
                tmp[''+code] = '' + ISO6391.getName(code) + (((''+code) === that.deckLanguage) ? ' (default)' : '');
        });

        let dialog = {
            titleText: 'Choose your preferred language',
            html: '<p>Translations of this deck are available. You may choose one of these to view the slides in this langauge instead of the langauge the presenter chose to present (<strong>'+ISO6391.getName(this.deckLanguage)+'</strong>). You can change your decision at any time.</p>',
            type: 'info',
            input: 'select',
            inputValue: this.chosenLanguage,
            inputOptions: tmp,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Okay',
            cancelButtonText: 'Cancel',
            allowOutsideClick: false,
            allowEscapeKey: false,
            preConfirm: function (lang) {
                return new Promise((resolve, reject) => {
                    that.changeLanguage(lang);
                    resolve();
                });
            }
        };
        if(swal.isVisible())
            swal.insertQueueStep(dialog);
        else
          swal(dialog);
    }

    render() {
        let toRender = '';
        if(this.props.isInitiator === false && this.state.translationsAvailable)
            toRender = <Button content='Choose other language' labelPosition='right' icon='language' color='blue' role="button" aria-label="Choose other language" onClick={this.openChooseLanguageModal.bind(this)} style={{textAlign: 'left'}}/>;

        return (
          <div>
            {toRender}
          </div>
        );
    }
}

export default Translations;
