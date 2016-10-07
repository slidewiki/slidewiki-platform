import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import HomePageStore from '../../stores/HomePageStore';
import DeckViewPanel from '../Deck/ContentPanel/DeckModes/DeckViewPanel/DeckViewPanel';
import CustomDate from '../Deck/util/CustomDate';
import ISO6391 from 'iso-639-1';
import cheerio from 'cheerio';
import lodash from 'lodash';
import { Microservices } from '../../configs/microservices';

class Featured extends React.Component {

    render() {
        return (
            <div ref="featuredDeckspanel" className="ui segment" key = "featuredDeckspanel">
                {/* Read https://slidewiki.atlassian.net/wiki/display/SWIK/How+To+Use+Slide+Thumbnail to know the details */}
                {this.props.HomePageStore.featured.map((deck, index) => {
                    let deckCreatorid = deck.user;
                    let deckCreator = deck.username;
                    let deckIdAndrevision = deck._id + '-' + deck.featured_revision;
                    let deckDate = CustomDate.format(deck.timestamp, 'Do MMMM YYYY');
                    let deckLanguageCode = deck.language === undefined ? 'gb' : deck.language;
                    let deckLanguage = deckLanguageCode === undefined ? '' : ISO6391.getName(deckLanguageCode);
                    // default English
                    deckLanguage = (deckLanguage === '' ? 'English' : deckLanguage);
                    let countryFlag = deckLanguageCode;
                    //let totalSlides = '1000'; //TODO
                    let deckTheme = deck.theme === undefined ? 'Simple' : deck.theme;

                    return (
                        <div className="ui vertical segment " key={'deck_meta' + deck._id}>
                            <div className="ui two column stackable grid">
                                <div className="column">
                                    <h3 className="ui header"><a href={'./deck/' + deck._id}>{deck.title}</a></h3>
                                    <div className="meta">Creator: <a href={'./user/' + deckCreatorid}>{deckCreator}</a></div>
                                    <div className="meta">Date: {deckDate}</div>
                                </div>
                                <div className="column right aligned">
                                        <div className="ui large label" >
                                            <i className={countryFlag + ' flag'} aria-label="Language"></i>{deckLanguage}</div>
                                        {/*<div className="ui large label" tabIndex="0" >
                                            <i className="block layout icon" aria-label="Number of slides"></i>{totalSlides}</div>*/}
                                       <div className="ui large label" tabIndex="0" >
                                            <i className="fork icon" aria-label="Number of versions"></i>{deck.countRevisions}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>


        );


    }
}

Featured = connectToStores(Featured, [HomePageStore], (context, props) => {
    return {
        HomePageStore: context.getStore(HomePageStore).getState()
    };
});
export default Featured;
