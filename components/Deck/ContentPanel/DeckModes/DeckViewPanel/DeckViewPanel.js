import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckViewStore from '../../../../../stores/DeckViewStore';
import Thumbnail from '../../../../common/Thumbnail';
import CustomDate from '../../../util/CustomDate';
import ISO6391 from 'iso-639-1';
import cheerio from 'cheerio';
import lodash from 'lodash';
import {Microservices} from '../../../../../configs/microservices';
import {NavLink} from 'fluxible-router';

import { Dropdown, Menu, Flag } from 'semantic-ui-react';

import {navigateAction} from 'fluxible-router';

import ContentLikeStore from '../../../../../stores/ContentLikeStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import TranslationStore from '../../../../../stores/TranslationStore';
import ContentStore from '../../../../../stores/ContentStore';
import loadLikes from '../../../../../actions/activityfeed/loadLikes';

import TranslationPanel from '../../../TranslationPanel/TranslationPanel.js';

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
            height: this.props.DeckViewStore.deckViewPanelHeight + 'px'
        };
        const deckData = this.props.DeckViewStore.deckData;
        let slidesArr = [];
        if (this.props.DeckViewStore.slidesData && this.props.DeckViewStore.slidesData.children) {
            slidesArr = this.props.DeckViewStore.slidesData.children;
        }
        let tags = [];
        if (deckData && deckData.tags){
            tags = deckData.tags;
        }
        let currentRevision = 1;
        if(deckData.revisions){
            currentRevision = deckData.revisions.length === 1 ? deckData.revisions[0] : deckData.revisions.find((rev) => {
                return rev.id === deckData.active;
            });
        }

        const forkCount = deckData.forkCount;
        //const deckTheme = lodash.get(deckData, 'theme', 'Simple');
        const deckTheme = currentRevision.theme;
        const deckLicense = deckData.license;
        const deckTitle = currentRevision.title;
        const deckDate = CustomDate.format(deckData.timestamp, 'Do MMMM YYYY');
        const deckDescription = lodash.get(deckData, 'description', '');
        const deckCreator = this.props.DeckViewStore.creatorData.username;
        const deckOwner = this.props.DeckViewStore.ownerData.username;
        const originCreator = this.props.DeckViewStore.originCreatorData.username;

        // let deckLanguageCode = deckData.language === undefined ? 'en' : deckData.language;
        // let deckLanguage = deckLanguageCode === undefined ? '' : ISO6391.getName(deckLanguageCode);
        // // default English
        // deckLanguage = (deckLanguage === '' ? 'English' : deckLanguage);
        // //const deckLanguageCode = lodash.get(deckData, 'language', undefined);
        // //const deckLanguage = deckLanguageCode === undefined ? 'English' : ISO6391.getName(deckLanguageCode.substr(0, 2));
        // // TODO when flag code is available, remove the hard coded flag and update the respective JSX.
        // //const countryFlag = 'gb';
        //let translations = this.props.TranslationStore.translations;
        const totalSlides = lodash.get(this.props.DeckViewStore.slidesData, 'children.length', undefined);
        const maxSlideThumbnails = 3;

        const totalLikes = this.props.ContentLikeStore.usersWhoLikedDeck.length;

        const thumbnailURL = Microservices.file.uri;
        const deckURL = '/deck/' + this.props.selector.id;
        const creatorProfileURL = '/user/' + deckCreator;
        const ownerProfileURL = '/user/' + deckOwner;

        let originInfo = deckData.origin != null ? <div className="meta">Origin:&nbsp;
                <NavLink href={'/deck/' + deckData.origin.id + '-' + deckData.origin.revision}>{deckData.origin.title}</NavLink> by <a href={'/user/' + originCreator}>{originCreator}</a>
        </div> : '';

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
                            {originInfo}
                            <div className="meta">Revision Owner:&nbsp;
                                <a href={ownerProfileURL}>{deckOwner}</a>
                            </div>
                            <div className="meta">Date: {deckDate}</div>
                            <div className="meta">License: {deckLicense}</div>
                            <div className="description">Description: {deckDescription}</div>
                        </div>
                    </div>

                    <div className="column">

                        <div className="content">
                            <div className="ui hidden divider"></div>
                            <div className="meta">
                                <TranslationPanel/>
                                <div className="ui large label" tabIndex="0">
                                    <i className="block layout icon" aria-label="Number of slides"></i>{totalSlides}
                                </div>
                                <div className="ui large label" tabIndex="0">
                                    <i className="theme icon" aria-label="Theme"></i>{deckTheme}</div>
                                <div className="ui large label" tabIndex="0">
                                    <i className="fork icon" aria-label="Number of forks"></i>{forkCount}</div>
                                <div className="ui large label" tabIndex="0">
                                    <i className="thumbs up icon" aria-label="Number of likes"></i>{totalLikes}</div>
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
                                                       url={thumbnailURL + '/slideThumbnail/' + slide.id + '.jpeg'}
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

DeckViewPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

DeckViewPanel = connectToStores(DeckViewPanel, [DeckViewStore, ContentLikeStore, UserProfileStore, ContentStore, TranslationStore], (context, props) => {
    return {
        DeckViewStore: context.getStore(DeckViewStore).getState(),
        ContentLikeStore: context.getStore(ContentLikeStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        ContentStore: context.getStore(ContentStore).getState(),
        TranslationStore: context.getStore(TranslationStore).getState(),
    };
});
export default DeckViewPanel;
