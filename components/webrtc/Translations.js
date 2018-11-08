import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import ISO6391 from 'iso-639-1';
import { Microservices } from '../../configs/microservices';
import { isEmpty } from '../../common';

class Translations extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            translationsAvailable: false,
        };
        this.translationArray = [];//Array( A<Map( B<String> --> C<String> )> --> //[Map( lang --> slideID )]
        this.translationMapByLanguage = new Map();//Map( X<String> --> Y<Map( B<String> --> C<String> )>) --> //(slideID --> Map( lang --> slideID))
        this.languages = [];
        this.deckLanguage = undefined;
        this.chosenLanguage = undefined;
        this.primaryLanguage = undefined;
    }

    createTranslationMap(deckID, deckLanguage, deck = undefined) {//NOTE deck is an optional argument

        if(deck === undefined){
            this.getDeckTranslations(deckID, deckLanguage, this.createTranslationMap.bind(this));
            return;//NOTE stop execution as createTranslationMap is called async with the deck param
        }

        let translationArray = [];

        translationArray = deck.children.map((el) => {
            let tmp = new Map();
            el.variants.forEach((el) => {
                tmp.set(el.language,el.id);
            });
            return tmp;
        });

        this.primaryLanguage = this.getPrimaryLang(deck);
        this.languages = deck.variants.map((variant) => variant.language);
        this.deckLanguage = (deckLanguage) ? deckLanguage : this.primaryLanguage;
        this.chosenLanguage = this.deckLanguage; //NOTE default lang is the deck lang

        if(!isEmpty(translationArray) && translationArray[0].size > 1) {
            //at least two langs are available
            this.translationArray = translationArray;
            this.setTranslationMapWithInitialLanguage(this.deckLanguage);
            console.log(this.translationArray);
            console.log(this.translationMapByLanguage);
            this.setState({translationsAvailable: true});
            this.openChooseLanguageModal();
        } else {
            //NOTE only primary langauge available
        }
    }

    getDeckTranslations(deckID, deckLanguage, toCallOnSuccess) {
        $.getJSON(Microservices.deck.uri + '/decktree/' + deckID + '/translations').done((deck) => {
            console.log(deck);
            toCallOnSuccess(deckID, deckLanguage, deck);
        }).fail((jqxhr, status, error) => console.log(status, error));
    }

    getPrimaryLang(deck) {
        let primary = deck.variants.filter((obj) => Object.keys(obj).includes('original'));
        return (primary.length > 0) ? primary[0].language : 'en';
    }

    setTranslationMapWithInitialLanguage(lang) {
        let translationMapByLanguage = new Map();
        this.translationArray.forEach((el) => {
            let key = (el.has(lang)) ? el.get(lang) : el.get(this.primaryLanguage);
            let value = new Map(el);
            translationMapByLanguage.set(key, value);
        });
        this.translationMapByLanguage = translationMapByLanguage;
    }

    modifyURLtoLoad(url){
        if(this.chosenLanguage === this.deckLanguage)
            return url;
        //TODO the following code is a bit hacky
        let currentSlide = url.split('slide-')[1];
        if(url.includes('language='))
            url = url.replace('language=' + this.deckLanguage, 'language=' + this.chosenLanguage);
        else {
            let tmp = url.split('#/');
            url= tmp[0] + '?language=' + this.chosenLanguage + '#/' + tmp[1];
        }
        let newURL = url.split('#/slide-')[0] + '#/slide-' + this.translationMapByLanguage.get(currentSlide).get(this.chosenLanguage);

        return newURL;
    }

    changeLanguage(lang){
        console.log('Changing language to ', lang);
        this.chosenLanguage = lang;
        this.props.triggerReloadIframe();//BUG due to a bug of SlideWiki reveal usage, the slideshow will always start on the first slide - WORKAROUND on changing the language the changeSlide method is explicitely loading the lastRemoteSlide
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
            html: '<p>Translations of this deck are available. You may choose one of these to view the slides in this langauge instead of the langauge the presenter chose to present (<strong>'+ISO6391.getName(this.deckLanguage)+'</strong>). You can change your decision at any time. Please keep in mind that not all slides might be translated to your chosen language.</p>',
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
