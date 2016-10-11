import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import DeckViewStore from '../../../../../stores/DeckViewStore';
import Thumbnail from '../../../../Thumbnail/Thumbnail';
import CustomDate from '../../../util/CustomDate';
import ISO6391 from 'iso-639-1';
import cheerio from 'cheerio';
import lodash from 'lodash';
import { Microservices } from '../../../../../configs/microservices';

class DeckViewPanel extends React.Component {
    getTextFromHtml(html) {
        let text = cheerio.load(html).text();
        if (text.length > 25) {
            text = text.substr(0, 21) + '...';
        }
        return text;
    }

    getDeckTitle(activeVersion, revisions) {
        for (let index of revisions) {
            if (index.id === activeVersion)
                return index.title;
        }
    }

    render() {
        const heightStyle = {
            height: '450px'
        };
        let slidesArr =[];
        if(this.props.DeckViewStore.slidesData && this.props.DeckViewStore.slidesData.children){
            slidesArr = this.props.DeckViewStore.slidesData.children;
        }
        let tags= [];
        if (this.props.DeckViewStore.deckData && this.props.DeckViewStore.deckData.tags)
            tags = this.props.DeckViewStore.deckData.tags;

        const activeVersion = lodash.get(this.props.DeckViewStore.deckData, 'active', undefined);
        const totalRevisions = lodash.get(this.props.DeckViewStore.deckData, 'revisions.length', undefined);
        // Theme information is not available in deck service yet. Remove hard coded 'Simple' when it becomes available.
        const deckTheme = lodash.get(this.props.DeckViewStore.deckData, 'theme', 'Simple');
        const deckTitle = activeVersion === undefined ? '' : this.getDeckTitle(activeVersion, this.props.DeckViewStore.deckData.revisions);
        const deckDate = CustomDate.format(this.props.DeckViewStore.deckData.timestamp, 'Do MMMM YYYY');
        const deckDescription = lodash.get(this.props.DeckViewStore.deckData, 'description', '');
        const deckCreator = lodash.get(this.props.DeckViewStore.userData, 'username', undefined);
        const deckUserId = this.props.DeckViewStore.userData._id;
        const deckLanguageCode = lodash.get(this.props.DeckViewStore.deckData, 'language', undefined);
        const deckLanguage = deckLanguageCode === undefined ? 'English' : ISO6391.getName(deckLanguageCode.substr(0, 2));
        const totalSlides = lodash.get(this.props.DeckViewStore.slidesData, 'children.length', undefined);
        const maxSlideThumbnails = 3;

        const thumbnailURL = Microservices.file.uri + '/';
        const host = this.props.DeckViewStore.deckData.host;
        const deckId = this.props.DeckViewStore.deckData._id;
        const deckURL = host === undefined ? '' : 'http://' + host + '/deck/' + deckId + '-' + activeVersion;
        const userProfileURL = host === undefined ? '' : 'http://' + host + '/user/' + deckCreator;


        return (
            <div ref="deckViewPanel" className="ui container bottom attached" style={heightStyle}>
                <div className="ui segment" style={heightStyle}>
                    <div className="ui two column grid container">
                        <div className="column">
                            <div className="content">
                                <h3 className="ui header">{deckTitle}</h3>
                                <div className="meta">Creator:&nbsp;
                                    <a href={userProfileURL}>{deckCreator}</a>
                                </div>
                                <div className="meta">Date: {deckDate}</div>
                                <div className="description">
                                    <p></p>
                                    <p>{deckDescription}</p>
                                </div>
                            </div>
                        </div>

                        <div className="column">

                            <div className="content">
                                <div className="ui hidden divider"></div>
                                <div className="meta">
                                    <div className="ui large label" >
                                        {/*<i className={countryFlag + ' flag'} aria-label="Language"></i>*/}{deckLanguage}</div>
                                    <div className="ui large label" tabIndex="0" >
                                        <i className="block layout icon" aria-label="Number of slides"></i>{totalSlides}</div>
                                    <div className="ui large label" tabIndex="0" >
                                        <i className="theme icon" aria-label="Theme"></i>{deckTheme}</div>
                                    <div className="ui large label" tabIndex="0" >
                                        <i className="fork icon" aria-label="Number of versions"></i>{totalRevisions}</div>
                                </div>
                                {tags.length > 0 ? <div className="ui divider"></div>: ''}
                                <div className="ui tag labels large meta">
                                    {tags.map((tag, index) => {
                                        return <a className="ui label" key={index} tabIndex="0" >{tag}</a>;
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="ui  divider"></div>
                    <div key={this.props.slideIndex} className="ui three column grid container">
                        {/* Read https://slidewiki.atlassian.net/wiki/display/SWIK/How+To+Use+Slide+Thumbnail to know the details */}
                        {slidesArr.map((slide, index) => {
                            if (index < maxSlideThumbnails) {
                                return (<div key={index} className="column">
                                            <div className="ui fluid card">
                                                <div className="content" tabIndex="0">
                                                    <a href={deckURL + '/slide/' + slide.id} className="ui medium image" tabIndex="-1">
                                                        <Thumbnail key={index} url={thumbnailURL + slide.user + '/thumbnails/' + slide.id + '.png'} slideId={slide.id} />
                                                    </a>
                                                    <a href={deckURL + '/slide/' + slide.id} className='header'>{this.getTextFromHtml(slide.title)}</a>
                                                    <div className="description">Slide {index + 1} of {totalSlides}</div>
                                                </div>
                                            </div>
                                        </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

DeckViewPanel = connectToStores(DeckViewPanel, [DeckViewStore], (context, props) => {
    return {
        DeckViewStore: context.getStore(DeckViewStore).getState()
    };
});
export default DeckViewPanel;
