import React from 'react';
import classNames from 'classnames/bind';
import { connectToStores } from 'fluxible-addons-react';
import DeckListStore from '../../stores/DeckListStore';
import DeckViewPanel from '../Deck/ContentPanel/DeckModes/DeckViewPanel/DeckViewPanel';
import CustomDate from '../Deck/util/CustomDate';
import { getLanguageName, getLanguageNativeName } from '../../common';
import cheerio from 'cheerio';
import lodash from 'lodash';
import { Microservices } from '../../configs/microservices';
import { NavLink } from 'fluxible-router';
import { FormattedMessage, defineMessages } from 'react-intl';

class DeckList extends React.Component {

    render() {
        let result = this.props.scope === 'featured' ? <FormattedMessage id='decklist.featured.notavailable' defaultMessage='No featured decks available' /> : <FormattedMessage id='decklist.recent.notavailable' defaultMessage='No recent decks available' />;
        let decks_to_show = this.props.scope === 'featured' ? this.props.DeckListStore.featured : this.props.DeckListStore.recent;
        let limit = this.props.limit !== undefined ? this.props.limit : 0;
        
        decks_to_show = limit !== 0 ? decks_to_show.slice(0, limit) : decks_to_show;
        
        if (decks_to_show.length) {
            result =
                decks_to_show.map((deck) => {
                    let deckDate = CustomDate.format(deck.timestamp, 'Do MMMM YYYY');
                    let deckLanguage = getLanguageName(deck.language || 'en') || 'English';
                    let theme = deck.theme !== undefined ? '/' + deck.theme : '';
                    return (
                        <div className="ui vertical segment " key={'deck_meta' + deck._id}>
                            <div className="ui three column stackable grid">
                                <div className="three wide column">
                                    <div className="ui medium image bordered">
                                        <NavLink href={['/deck', deck._id, deck.slug,].join('/')}>
                                            <img src={`${Microservices.file.uri}/thumbnail/slide/${deck.firstSlide}${theme}`} alt="Featured Image" style={{ maxHeight: '290px', height: 'initial'}} />
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="item">
                                        <h2 className="ui header"><NavLink href={['/deck', deck._id, deck.slug,].join('/')}>{deck.title}</NavLink></h2>
                                        <div className="meta"><FormattedMessage id='decklist.meta.creator' defaultMessage='Creator' />: <NavLink href={'/user/' + deck.username}>{deck.username}</NavLink></div>
                                        <div className="meta"><FormattedMessage id='decklist.meta.date' defaultMessage='Last Modified' />: {deckDate}</div>
                                    </div>
                                </div>
                                <div className="column right aligned">
                                    <div className="ui label" >
                                        <FormattedMessage id="decklist.decklanguage" defaultMessage='Default language' aria-label="Default language">
                                            {
                                                (label) => <i className="ui comments outline icon" aria-label={label}></i>
                                            }
                                        </FormattedMessage> {deckLanguage}
                                    </div>
                                    <div className="ui label"  >
                                        <FormattedMessage id="decklist.forkcount" defaultMessage='Number of forks'>
                                            {
                                                (label) => <i className="fork icon" aria-label={label}></i>
                                            }
                                        </FormattedMessage> {deck.forkCount}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                });
        }

        return (
            <div ref="DeckListpanel" className="ui segment" key="Deckspanel">
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
