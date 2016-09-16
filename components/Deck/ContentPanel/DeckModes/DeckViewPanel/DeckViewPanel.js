import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import DeckViewStore from '../../../../../stores/DeckViewStore';
import ThumbnailShow from '../../../../Thumbnail/ThumbnailShow';
import CustomDate from '../../../util/CustomDate';
let ISO6391 = require('iso-639-1');
let jsdom = require('jsdom').jsdom;

class DeckViewPanel extends React.Component {
    getTextFromHtml(html) {
        let doc = jsdom(html);
        let text = doc.documentElement.textContent.trim();
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
        // Uncomment the below line if you want to test with sample tags
        //this.props.DeckViewStore.deckData.tags = ['linked data', 'information extraction', 'presentation'];

        const activeVersion = this.props.DeckViewStore.deckData.active;
        const totalRevisions = this.props.DeckViewStore.deckData.revisions.length;
        // Theme information is not available in deck service yet. Remove hard coded 'Simple' when it becomes available.
        const deckTheme = 'Simple'; //this.props.DeckViewStore.deckData.theme;
        const deckTitle = this.getDeckTitle(activeVersion, this.props.DeckViewStore.deckData.revisions);
        console.log(deckTitle);
        const deckDate = CustomDate.format(this.props.DeckViewStore.deckData.timestamp, 'Do MMMM YYYY');
        const deckDescription = this.props.DeckViewStore.deckData.description;
        const deckCreator = this.props.DeckViewStore.userData.username;
        const deckLanguageCode = this.props.DeckViewStore.deckData.language;
        let deckLanguage = ISO6391.getName(deckLanguageCode);
        // If deckLanguageCode is not as per ISO-639-1 (e.g. en-EN is incorrect but I found it in deckservice data) and first two letters are 'en' then use English
        deckLanguage = deckLanguage === '' && deckLanguageCode.substr(0, 2) === 'en'? 'English': deckLanguage;
        const totalSlides = this.props.DeckViewStore.slidesData.children.length;
        const maxSlideThumbnails = 3;
        const deckURL = 'http://' + this.props.DeckViewStore.deckData.host + '/deck/' + this.props.DeckViewStore.deckData._id + '-' + activeVersion;

        return (
            <div ref="deckViewPanel" className="ui container bottom attached" style={heightStyle}>
                <div className="ui segment" style={heightStyle}>
                    <div className="ui two column grid container">
                        <div className="column">
                            <div className="content">
                                <h3 className="ui header">{deckTitle}</h3>
                                <div className="meta">Creator: {deckCreator}</div>
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
                                        <i className="gb flag" aria-label="Language"></i>{deckLanguage}</div>
                                    <div className="ui large label" tabIndex="0" >
                                        <i className="block layout icon" aria-label="Number of slides"></i>{totalSlides}</div>
                                    <div className="ui large label" tabIndex="0" >
                                        <i className="theme icon" aria-label="Theme"></i>{deckTheme}</div>
                                    <div className="ui large label" tabIndex="0" >
                                        <i className="fork icon" aria-label="Number of versions"></i>{totalRevisions}</div>
                                </div>
                                {this.props.DeckViewStore.deckData.tags.length > 0 ? <div className="ui divider"></div>: ''}
                                <div className="ui tag labels large meta">
                                    {this.props.DeckViewStore.deckData.tags.map((tag, index) => {
                                        return <a className="ui label" key={index} tabIndex="0" >{tag}</a>;
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="ui  divider"></div>
                    <div key={this.props.slideIndex} className="ui three column grid container">
                        {/* Read https://slidewiki.atlassian.net/wiki/display/SWIK/How+To+Use+Slide+Thumbnail to know the details */}
                        {this.props.DeckViewStore.slidesData.children.map((slide, index) => {
                            if (index < maxSlideThumbnails) {
                                return (<div key={index} className="column">
                                            <div className="ui fluid card">
                                                <div className="content" tabIndex="0">
                                                    <a href={deckURL + '/slide/' + slide.id} className="ui medium image" tabIndex="-1">
                                                        <ThumbnailShow key={index}
                                                            slideId={slide.id}
                                                            slideTitle={slide.title}
                                                            slideContent={slide.content}
                                                            action="new"
                                                        />
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
