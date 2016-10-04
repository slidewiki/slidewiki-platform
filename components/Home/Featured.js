import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import HomePageStore from '../../stores/HomePageStore';
import DeckViewPanel from '../Deck/ContentPanel/DeckModes/DeckViewPanel/DeckViewPanel';
import ISO6391 from 'iso-639-1';
import cheerio from 'cheerio';
import lodash from 'lodash';
import { Microservices } from '../../configs/microservices';

class Featured extends React.Component {

    render() {
        const heightStyle = {
            height: '150px'
        };


        return (
            <div ref="featuredDeckspanel" className="ui compact segments" style={heightStyle}>
                {/* Read https://slidewiki.atlassian.net/wiki/display/SWIK/How+To+Use+Slide+Thumbnail to know the details */}
                {this.props.HomePageStore.featured.map((deck, index) => {
                    let deckCreator = 'darya'; //TODO
                    let deckDate = ''; //TODO
                    let deckLanguageCode = deck.language === undefined ? 'en' : deck.language;
                    let deckLanguage = deckLanguageCode === undefined ? '' : ISO6391.getName(deckLanguageCode);
                    // default English
                    deckLanguage = (deckLanguage === '' ? 'English' : deckLanguage);
                    // TODO when flag code is available, remove the hard coded flag
                    let countryFlag = deckLanguageCode;
                    let totalSlides = '1000'; //TODO
                    let deckTheme = deck.theme === undefined ? 'Simple' : deck.theme;

                    return (
                            <div className="ui segment attached">
                                <div className="ui two column grid container">
                                    <div className="column">
                                        <div className="content">
                                            <h3 className="ui header">{deck.title}</h3>
                                            <div className="meta">Creator: {deckCreator}</div>
                                            <div className="meta">Date: {deckDate}</div>
                                            <div className="description">
                                                <p></p>
                                                <p>{deck.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="column">

                                        <div className="content">
                                            <div className="ui hidden divider"></div>
                                            <div className="meta">
                                                <div className="ui large label" >
                                                    <i className={countryFlag + ' flag'} aria-label="Language"></i>{deckLanguage}</div>
                                                <div className="ui large label" tabIndex="0" >
                                                    <i className="block layout icon" aria-label="Number of slides"></i>{totalSlides}</div>
                                                <div className="ui large label" tabIndex="0" >
                                                    <i className="theme icon" aria-label="Theme"></i>{deckTheme}</div>
                                                <div className="ui large label" tabIndex="0" >
                                                    <i className="fork icon" aria-label="Number of versions"></i>{deck.countRevisions}</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>


                    );

                })}
            </div>


        );


        // {this.props.DeckViewStore.slidesData.children.map((slide, index) => {
        //     if (index < maxSlideThumbnails) {
        //         return (<div key={index} className="column">
        //                     <div className="ui fluid card">
        //                         <div className="content" tabIndex="0">
        //                             <a href={deckURL + '/slide/' + slide.id} className="ui medium image" tabIndex="-1">
        //                                 <Thumbnail key={index} url={thumbnailURL + slide.user + '/thumbnails/' + slide.id + '.png'} slideId={slide.id} />
        //                             </a>
        //                             <a href={deckURL + '/slide/' + slide.id} className='header'>{this.getTextFromHtml(slide.title)}</a>
        //                             <div className="description">Slide {index + 1} of {totalSlides}</div>
        //                         </div>
        //                     </div>
        //                 </div>
        //         );
        //     }
        // });};
    }
}

Featured = connectToStores(Featured, [HomePageStore], (context, props) => {
    return {
        HomePageStore: context.getStore(HomePageStore).getState()
    };
});
export default Featured;
