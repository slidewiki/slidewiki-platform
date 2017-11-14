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
            //height: this.props.DeckViewStore.deckViewPanelHeight + 'px',
            minHeight: this.props.DeckViewStore.deckViewPanelHeight,
            overflowY: 'auto',
            overflowX: 'auto'
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
        const shareCount = deckData.shareCount;
        const downloadCount = deckData.downloadCount;

        //const deckTheme = lodash.get(deckData, 'theme', 'Simple');
        let deckTheme = currentRevision.theme;
        switch (deckTheme) {
            case 'default':
                deckTheme = 'White - Default';
                break;
            case 'beige':
                deckTheme = 'Cream';
                break;
            case 'black':
                deckTheme = 'Black';
                break;
            case 'league':
                deckTheme = 'Black';
                break;
            case 'sky':
                deckTheme = 'sky';
                break;
            case 'solarized':
                deckTheme = 'Beige';
                break;
            case 'moon':
                deckTheme = 'Dark Slate Blue';
                break;
            case 'night':
                deckTheme = 'High Contrast 1';
                break;
            case 'blood':
                deckTheme = 'High Contrast 2';
                break;
            case 'serif':
                deckTheme = 'Serif';
                break;
            case 'simple':
                deckTheme = 'Simple';
                break;
            case 'openuniversity':
                deckTheme = 'Open University';
                break;
            case 'odimadrid':
                deckTheme = 'ODI Madrid';
                break;
            case 'oeg':
                deckTheme = 'OEG';
                break;
            default:                
        }
        const deckLicense = deckData.license;
        const deckTitle = currentRevision.title;
        const deckDate = CustomDate.format(deckData.timestamp, 'Do MMMM YYYY');
        const deckDescription = lodash.get(deckData, 'description', '');
        const deckCreator = this.props.DeckViewStore.creatorData.username;
        const deckOwner = this.props.DeckViewStore.ownerData.username;
        const originCreator = this.props.DeckViewStore.originCreatorData.username;

        let deckLanguageCode = deckData.language === undefined ? 'en' : deckData.language;
        let deckLanguage = deckLanguageCode === undefined ? '' : ISO6391.getName(deckLanguageCode);
        // default English
        deckLanguage = (deckLanguage === '' ? 'English' : deckLanguage);
        //const deckLanguageCode = lodash.get(deckData, 'language', undefined);
        //const deckLanguage = deckLanguageCode === undefined ? 'English' : ISO6391.getName(deckLanguageCode.substr(0, 2));
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

        const user = this.props.UserProfileStore.userid;

        let originInfo = deckData.origin != null ? <div className="meta" tabIndex="0"><strong>Origin:&nbsp;</strong>
                <NavLink href={'/deck/' + deckData.origin.id + '-' + deckData.origin.revision}>{deckData.origin.title}</NavLink> by <a href={'/user/' + originCreator}>{originCreator}</a>
        </div> : '';

        return (
        <div ref="deckViewPanel" id='deckViewPanel' className="ui container bottom attached" style={heightStyle}>

                <main role="main">
            <div className="ui segment" style={heightStyle}>
            {(this.props.TranslationStore.inProgress) ? <div className="ui active dimmer"><div className="ui text loader">Translating</div></div> : ''}
                <div className="ui two column grid container">
                {(deckTitle === undefined) ? <div className="ui active dimmer">
                        <div className="ui text loader">Loading</div></div> : ''}
                    <div className="column">
                        <div className="item">
                        <div className="content">
                            <h2 className="ui header" aria-describedby="decktitle">{deckTitle}</h2>
                            <div className="sr-only" id="decktitle">Deck Title:</div>
                            <div className="meta"><strong>Creator:&nbsp;</strong>
                                <a href={creatorProfileURL}>{deckCreator}</a>
                            </div>
                            {originInfo}
                            <div className="meta"><strong>Date:&nbsp;</strong>{deckDate}</div>
                            <div className="meta"><strong>Description:</strong>
                                <div className="description" tabIndex="0" aria-label="deck description">{deckDescription}</div>
                        </div>
                    </div>
                    </div>
                    </div>
                    <div className="right aligned column">

                            <div className="ui hidden divider"></div>

                            <div className="meta">
                                {/*<div className="ui label" tabIndex="0">
                                    <i className="comments icon" aria-label="Language"></i>{deckLanguage}
                                </div>
                                */}
                                <TranslationPanel/>
                                <div className="ui large label" tabIndex="0">
                                    <i className="block layout icon" aria-label="Number of slides"></i>{totalSlides}
                                </div>
                                <div className="ui  label" tabIndex="0">
                                    <i className="theme icon" aria-label="Theme"></i>{deckTheme}</div>
                                <div className="ui large label" tabIndex="0">
                                    <i className="fork icon" aria-label="Number of forks"></i>{forkCount}</div>
                                <div className="ui label" tabIndex="0">
                                    <i className="thumbs up icon" aria-label="Number of likes"></i>{totalLikes}</div>
                                <div className="ui label" tabIndex="0">
                                    <i className="share alternate icon" aria-label="Number of shares"></i>{shareCount}</div>
                                <div className="ui label" tabIndex="0">
                                    <i className="download icon" aria-label="Number of downloads"></i>{downloadCount}</div>
                            </div>
                            {tags.length > 0 ? <div className="ui divider"></div> : ''}
                            <div className="ui tag labels large meta">
                                {tags.map((tag, index) => {
                                    return <a className="ui label" key={index} tabIndex="0">{tag}</a>;
                                })}
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
                                    <div className="content" tabIndex="-1">
                                        <a href={deckURL + '/slide/' + slide.id} className="ui medium image"
                                           tabIndex="-1">
                                            <Thumbnail key={index}
                                                       url={thumbnailURL + '/slideThumbnail/' + slide.id + '.jpeg'}
                                                       slideId={slide.id} alt={''} abIndex={-1}/>
                                        </a>
                                        <a href={deckURL + '/slide/' + slide.id}
                                           className='header' tabIndex="0" aria-describedby={'slide-no-'+index}>{this.getTextFromHtml(slide.title)}</a>
                                        <div className="description" id={'slide-no-'+index}>Slide {index + 1} of {totalSlides}</div>
                                    </div>
                                </div>
                            </div>
                            );
                        }
                    })}
                </div>
            </div>
                </main>
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
