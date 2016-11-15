import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckViewStore from '../../../../../stores/DeckViewStore';
import Thumbnail from '../../../../common/Thumbnail';
import CustomDate from '../../../util/CustomDate';
import ISO6391 from 'iso-639-1';
import cheerio from 'cheerio';
import lodash from 'lodash';
import {Microservices} from '../../../../../configs/microservices';

class DeckViewPanel extends React.Component {
    getTextFromHtml(html) {
        let text = cheerio.load(html).text();
        if (text.length > 25) {
            text = text.substr(0, 21) + '...';
        }
        return text;
    }

    render() {
        const heightStyle = {
            height: '450px'
        };
        const deckData = this.props.DeckViewStore.deckData;
        let slidesArr = [];
        if (this.props.DeckViewStore.slidesData && this.props.DeckViewStore.slidesData.children) {
            slidesArr = this.props.DeckViewStore.slidesData.children;
        }
        let tags = [];
        if (deckData && deckData.tags)
            tags = deckData.tags;

        const currentRevision = deckData.revisions.length === 1 ? deckData.revisions[0] : deckData.revisions.find((rev) => {
            return rev.id === deckData.active;
        });
        const totalRevisions = deckData.revisionCount;
        // Theme information is not available in deck service yet. Remove hard coded 'Simple' when it becomes available.
        const deckTheme = lodash.get(deckData, 'theme', 'Simple');
        const deckTitle = currentRevision.title;
        const deckDate = CustomDate.format(deckData.timestamp, 'Do MMMM YYYY');
        const deckDescription = lodash.get(deckData, 'description', '');
        const deckCreator = this.props.DeckViewStore.creatorData.username;
        const deckOwner = this.props.DeckViewStore.ownerData.username;
        const deckLanguageCode = lodash.get(deckData, 'language', undefined);
        const deckLanguage = deckLanguageCode === undefined ? 'English' : ISO6391.getName(deckLanguageCode.substr(0, 2));
        // TODO when flag code is available, remove the hard coded flag and update the respective JSX.
        //const countryFlag = 'gb';
        const totalSlides = lodash.get(this.props.DeckViewStore.slidesData, 'children.length', undefined);
        const maxSlideThumbnails = 3;

        const thumbnailURL = Microservices.file.uri + '/';
        const deckURL = '/deck/' + this.props.selector.id;
        const creatorProfileURL = '/user/' + deckCreator;
        const ownerProfileURL = '/user/' + deckOwner;

        return (
        <div ref="deckViewPanel" className="ui container bottom attached" style={heightStyle}>
            <div className="ui segment" style={heightStyle}>
                <div className="ui two column grid container">
                    <div className="column">
                        <div className="content">
                            <h3 className="ui header">{deckTitle}</h3>
                            <div className="meta">Creator:&nbsp;
                                <a href={creatorProfileURL}>{deckCreator}</a>
                            </div>
                            <div className="meta">Revision Owner:&nbsp;
                                <a href={ownerProfileURL}>{deckOwner}</a>
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
                                <div className="ui large label">
                                <i className="ui comments outline icon"></i>
                                    {/*<i className={countryFlag + ' flag'} aria-label="Language"></i>*/}{deckLanguage}</div>
                                <div className="ui large label" tabIndex="0">
                                    <i className="block layout icon" aria-label="Number of slides"></i>{totalSlides}
                                </div>
                                <div className="ui large label" tabIndex="0">
                                    <i className="theme icon" aria-label="Theme"></i>{deckTheme}</div>
                                <div className="ui large label" tabIndex="0">
                                    <i className="fork icon" aria-label="Number of versions"></i>{totalRevisions}</div>
                            </div>
                            {tags.length > 0 ? <div className="ui divider"></div> : ''}
                            <div className="ui tag labels large meta">
                                {tags.map((tag, index) => {
                                    return <a className="ui label" key={index} tabIndex="0">{tag}</a>;
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
                                        <a href={deckURL + '/slide/' + slide.id} className="ui medium image"
                                           tabIndex="-1">
                                            <Thumbnail key={index}
                                                       url={thumbnailURL + slide.user + '/thumbnails/' + slide.id + '.png'}
                                                       slideId={slide.id}/>
                                        </a>
                                        <a href={deckURL + '/slide/' + slide.id}
                                           className='header'>{this.getTextFromHtml(slide.title)}</a>
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
