import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckViewStore from '../../../../../stores/DeckViewStore';
import Thumbnail from '../../../../common/Thumbnail';
import CustomDate from '../../../util/CustomDate';
import {getLanguageName} from '../../../../../common';
import cheerio from 'cheerio';
import lodash from 'lodash';
import {Microservices} from '../../../../../configs/microservices';
import {NavLink} from 'fluxible-router';

import { Dropdown, Menu } from 'semantic-ui-react';

import {navigateAction} from 'fluxible-router';

import ContentLikeStore from '../../../../../stores/ContentLikeStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import ContentStore from '../../../../../stores/ContentStore';
import loadLikes from '../../../../../actions/activityfeed/loadLikes';
import Util from '../../../../common/Util';
import MobileDetect from 'mobile-detect/mobile-detect';

import {getEducationLevel} from '../../../../../lib/isced.js';

class DeckViewPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isMobile: false};
    }

    getTextFromHtml(html) {
        let text = cheerio.load(html).text();
        if (text.length > 25) {
            text = text.substr(0, 21) + '...';
        }
        return text;
    }

    componentDidMount() {
        let userAgent = window.navigator.userAgent;
        let mobile = new MobileDetect(userAgent);
        this.setState({isMobile: (mobile.phone() !== null) ? true : false});
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

        const forkCount = deckData.forkCount;
        const shareCount = deckData.shareCount;
        const downloadCount = deckData.downloadCount;

        //const deckTheme = lodash.get(deckData, 'theme', 'Simple');
        let deckTheme = deckData.theme;
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
        const deckTitle = deckData.title;
        const lastUpdate = CustomDate.format(deckData.lastUpdate, 'Do MMMM YYYY');
        const deckDescription = lodash.get(deckData, 'description', '');
        const deckCreator = this.props.DeckViewStore.creatorData.username;
        const deckCreatorDisplayName = this.props.DeckViewStore.creatorData.displayName || deckCreator;
        const deckOwner = this.props.DeckViewStore.ownerData.username;
        const originCreator = this.props.DeckViewStore.originCreatorData.username;
        if (deckData.language) deckData.language = deckData.language.substring(0, 2);

        let deckLanguageCode = deckData.language;
        let deckLanguage = deckLanguageCode === undefined ? '' : getLanguageName(deckLanguageCode);
        // default English
        deckLanguage = (deckLanguage === '' ? 'English' : deckLanguage);
        //const deckLanguageCode = lodash.get(deckData, 'language', undefined);
        //const deckLanguage = deckLanguageCode === undefined ? 'English' : ISO6391.getName(deckLanguageCode.substr(0, 2));
        // // TODO when flag code is available, remove the hard coded flag and update the respective JSX.
        // //const countryFlag = 'gb';
        const totalSlides = lodash.get(this.props.DeckViewStore.slidesData, 'children.length', undefined);
        const maxSlideThumbnails = 3;

        const totalLikes = this.props.ContentLikeStore.usersWhoLikedDeck.length;

        const creatorProfileURL = '/user/' + deckCreator;
        const ownerProfileURL = '/user/' + deckOwner;

        const user = this.props.UserProfileStore.userid;
        const deckTopics = deckData.topics || [];

        let originInfo = deckData.origin != null ? <div className="meta" tabIndex="0"><strong>Origin:&nbsp;</strong>
                <NavLink href={['/deck', deckData.origin.id + '-' + deckData.origin.revision, deckData.origin.slug].join('/')}>{deckData.origin.title}</NavLink> by <a href={'/user/' + originCreator}>{originCreator}</a>{/* TODO check if this URL is working with languages! */}
        </div> : '';

        return (
            <div ref="deckViewPanel" id='deckViewPanel' className="ui bottom attached" style={heightStyle}>
                    <div className="ui segment" style={heightStyle}>
                            {(deckTitle === undefined) ? <div className="ui active dimmer">
                                <div className="ui text loader">Loading</div></div> : ''}
                            <h2 className="ui header">{deckTitle}
                                <div className={`ui label ${deckData.hidden ? 'red' : 'green'}`} tabIndex="0">{deckData.hidden ? 'Unlisted' : 'Published'}</div>
                            </h2>
                        <div className="ui stackable grid container">
                            <div className="two column row">
                                <div className="column">
                                    <div className="item">
                                        <div className="meta"><strong>Creator:&nbsp;</strong>
                                            <NavLink href={creatorProfileURL}>{deckCreatorDisplayName}</NavLink>
                                        </div>
                                        {originInfo}
                                        <div className="meta"><strong>Last Modified:&nbsp;</strong>{lastUpdate}</div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="sr-only">"Deck metadata"</div>
                                    <div className="row">
                                               <div className="ui medium labels" >
                                                <div className="ui label" >
                                                    <i className="comments icon" aria-label="Default language"></i>{deckLanguage}
                                                </div>
                                                <div className="ui label" >
                                                    <i className="block layout icon" aria-label="Number of slides"></i>{totalSlides}
                                                </div>
                                                { deckData.educationLevel &&
                                                <div className="ui label" >
                                                    <i className="university icon" aria-label="Education Level"></i>{getEducationLevel(deckData.educationLevel)}
                                                </div>
                                                }
                                                </div>
                                    </div>
                                    <div className="row">
                                        <div className="ui medium labels">
                                                <div className="ui label" >
                                                    <i className="fork icon" aria-label="Number of forks"></i>{forkCount}</div>
                                                <div className="ui label" >
                                                    <i className="thumbs up icon" aria-label="Number of likes"></i>{totalLikes}</div>
                                                <div className="ui label" >
                                                    <i className="share alternate icon" aria-label="Number of shares"></i>{shareCount}</div>
                                                <div className="ui label" >
                                                    <i className="download icon" aria-label="Number of downloads"></i>{downloadCount}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row" >
                                { deckDescription &&
                                    <div className="item">
                                        <div className="meta"><strong>Description:</strong>
                                            <div className="description" >{deckDescription}</div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="row" >
                                { deckTopics.length > 0 &&
                                    <div className="item">
                                        <div className="meta"><strong>Subject:&nbsp;</strong>
                                            <div className="description">
                                            { deckTopics.map((t, i) => 
                                                <span key={i}>
                                                    { !!i && ',\xa0' }
                                                    <a target="_blank" href={`/deckfamily/${t.tagName}`}>{t.defaultName || t.tagName}</a>
                                                </span>
                                            ) }
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="ui section divider"></div>
                        <div key={this.props.slideIndex} className="ui container three cards">
                            {/* Read https://slidewiki.atlassian.net/wiki/display/SWIK/How+To+Use+Slide+Thumbnail to know the details */}
                            {slidesArr.map((slide, index) => {
                                let thumbnailURL = `${Microservices.file.uri}/thumbnail/slide/${slide.id}`;
                                let thumbnailAlt = slide.title === undefined ? slide.id : slide.title + ' | ' + slide.id;
                                if (slide.theme) {
                                    thumbnailURL += '/' + slide.theme;
                                }
                                if (this.state.isMobile) {
                                    const slideURL = Util.makeNodeURL({
                                        id: this.props.selector ? this.props.selector.id : deckData.id,
                                        stype: 'slide',
                                        sid: slide.id
                                    }, 'deck', '', this.props.deckSlug);
                                    return (
                                        <div key={index} className="ui card">
                                            <a href={slideURL} className="ui image"
                                               tabIndex="-1">
                                                <img key={index} src={thumbnailURL} alt={thumbnailAlt} tabIndex={-1}/>
                                            </a>
                                        </div>
                                    );
                                }
                                else if (index < maxSlideThumbnails) {
                                    const slideURL = Util.makeNodeURL({
                                        id: this.props.selector ? this.props.selector.id : deckData.id,
                                        stype: 'slide',
                                        sid: slide.id
                                    }, 'deck', '', this.props.deckSlug);
                                    return (
                                        <div key={index} className="ui card">
                                            <a href={slideURL} className="ui image"
                                               tabIndex="-1">
                                                <img key={index} src={thumbnailURL} alt={thumbnailAlt} tabIndex={-1} aria-hidden="true"/>
                                            </a>
                                            <div className="content" tabIndex="-1">
                                                <a href={slideURL}
                                                   className='header' tabIndex="0" aria-describedby={'slide-no-'+index}>{this.getTextFromHtml(slide.title)}</a>
                                                <div className="description" id={'slide-no-'+index}>Slide {index + 1} of {totalSlides}</div>
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
    executeAction: PropTypes.func.isRequired
};

DeckViewPanel = connectToStores(DeckViewPanel, [DeckViewStore, ContentLikeStore, UserProfileStore, ContentStore], (context, props) => {
    return {
        DeckViewStore: context.getStore(DeckViewStore).getState(),
        ContentLikeStore: context.getStore(ContentLikeStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        ContentStore: context.getStore(ContentStore).getState()
    };
});
export default DeckViewPanel;
