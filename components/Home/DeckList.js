import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import DeckListStore from '../../stores/DeckListStore';
import DeckViewPanel from '../Deck/ContentPanel/DeckModes/DeckViewPanel/DeckViewPanel';
import CustomDate from '../Deck/util/CustomDate';
import ISO6391 from 'iso-639-1';
import cheerio from 'cheerio';
import lodash from 'lodash';
import { Microservices } from '../../configs/microservices';
import { NavLink } from 'fluxible-router';

class DeckList extends React.Component {

    render() {
        let result = this.props.scope === 'featured' ? 'No featured decks available' : 'No recent decks available';
        let decks_to_show = this.props.scope === 'featured' ? this.props.DeckListStore.featured : this.props.DeckListStore.recent;
        if (decks_to_show.length){
            result =
                decks_to_show.map((deck, index) => {
                    let deckCreatorid = deck.user;
                    let deckCreator = deck.username;
                    let deckIdAndrevision = deck._id; //not used for now
                    let deckDate = CustomDate.format(deck.timestamp, 'Do MMMM YYYY');
                    let deckLanguageCode = deck.language === undefined ? 'en' : deck.language;
                    let deckLanguage = deckLanguageCode === undefined ? '' : ISO6391.getName(deckLanguageCode);
                    // default English
                    deckLanguage = (deckLanguage === '' ? 'English' : deckLanguage);
                    //let countryFlag = deckLanguageCode === 'en' ? 'gb' : deckLanguageCode;
                    let deckTheme = deck.theme === undefined ? 'Simple' : deck.theme;

                    return (
                        <div className="ui vertical segment " key={'deck_meta' + deck._id}>
                            <div className="ui two column stackable grid">
                                <div className="column">
                                    <div className="ui header"><NavLink href={'./deck/' + deck._id}>{deck.title}</NavLink></div>
                                    <div className="meta">Creator: <NavLink href={'./user/' + deckCreatorid}>{deckCreator}</NavLink></div>
                                    <div className="meta">Date: {deckDate}</div>
                                </div>
                                <div className="column right aligned">
                                    <div className="ui large label" tabIndex="0">
                                        <i className="ui comments outline icon" aria-label="Deck language"></i>
                                        {/*<i className={countryFlag + ' flag'} aria-label="Language"></i>*/}{deckLanguage}</div>
                                    {/*<div className="ui large label" tabIndex="0" >
                                            <i className="block layout icon" aria-label="Number of slides"></i>{totalSlides}</div>*/}
                                    <div className="ui large label" tabIndex="0" >
                                        <i className="fork icon" aria-label="Number of forks"></i>{deck.forkCount}</div>
                                </div>
                            </div>
                        </div>
                    );
                });
        }

        return (
            <div ref="DeckListpanel" className="ui segment" key = "Deckspanel">
                {result}
            </div>
        );
    }
}

DeckList = connectToStores(DeckList, [DeckListStore], (context, props) => {
    return {
        DeckListStore: context.getStore(DeckListStore).getState()
    };
});
export default DeckList;
