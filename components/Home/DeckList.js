import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import DeckListStore from '../../stores/DeckListStore';
import DeckViewPanel from '../Deck/ContentPanel/DeckModes/DeckViewPanel/DeckViewPanel';
import CustomDate from '../Deck/util/CustomDate';
import {getLanguageName, getLanguageNativeName} from '../../common';
import {FormattedMessage, defineMessages} from 'react-intl';
import cheerio from 'cheerio';
import lodash from 'lodash';
import { Microservices } from '../../configs/microservices';
import { NavLink } from 'fluxible-router';

class DeckList extends React.Component {

    render() {
        let result = this.props.scope === 'featured' ? 'No featured decks available' : 'No recent decks available';
        let decks_to_show = this.props.scope === 'featured' ? this.props.DeckListStore.featured : this.props.DeckListStore.recent;
        let limit = this.props.limit !== undefined ? this.props.limit : 0;
        
        decks_to_show = limit !== 0 ? decks_to_show.slice(0, limit) : decks_to_show;
        
        if (decks_to_show.length){
            result =
                decks_to_show.map((deck) => {
                    let deckDate = CustomDate.format(deck.timestamp, 'Do MMMM YYYY');
                    let deckLanguage = getLanguageName(deck.language || 'en') || 'English';
                    let theme = deck.theme !== undefined ? '/' + deck.theme : '';
                    
                    return (
                        <div key={'deck_meta' + deck._id} className="ui vertical segment clearing">
                            <div className="featured-img">
                                <NavLink href={['/deck', deck._id, deck.slug,].join('/')}>
                                    <img src={`${Microservices.file.uri}/thumbnail/slide/${deck.firstSlide}${theme}`} alt="Featured Image" style={{ maxHeight: '290px', height: 'initial'}} /> {/* TODO change this in css file */}
                                </NavLink>
                            </div>
                            <div className="featured-content">
                                {this.props.scope === 'featured' ? <h4><FormattedMessage id='DeckList.title.featured' defaultMessage='Featured deck'/></h4> : ''}
                                <div className="featured-post">
                                    <h5><NavLink href={['/deck', deck._id, deck.slug,].join('/')}>{deck.title}</NavLink></h5>
                                    <p>{deck.description}</p>
                                    <NavLink href={['/deck', deck._id, deck.slug,].join('/')}><FormattedMessage id='DeckList.link.readmore' defaultMessage='Read more'/>...</NavLink>
                                </div>
                                <div className="post-desc">
                                    <p><FormattedMessage id='DeckList.desc.creator' defaultMessage='Creator'/>&#58; <NavLink href={'/user/' + deck.username}>{deck.username}</NavLink></p>
                                    <p><FormattedMessage id='DeckList.desc.date' defaultMessage='Date'/>&#58;<span> {deckDate}</span></p>
                                </div>
                                <div className="post-button">
                                    <NavLink href={['/deck', deck._id, deck.slug,].join('/')} className="left-btn"><i className="thumbs up icon"></i>{deck.likes}</NavLink>
                                    <NavLink href={['/deck', deck._id, deck.slug,].join('/')} className="right-btn"><i className="fork icon"></i>{deck.forkCount}</NavLink>
                                </div>
                            </div>
                        </div>
                    );
                });
        }
        
        let classes = this.props.inline !== 'true' ? 'ui segment' : '';

        return (
            <div>
                <div ref="DeckListpanel" key = "Deckspanel" className={classes}>
                    {result}
                </div>
                {this.props.inline !== 'true' ?
                <div className="ui hidden divider"></div>
                : ''}
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
