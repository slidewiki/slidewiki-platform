import PropTypes from 'prop-types';
import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import { FormattedMessage, defineMessages } from 'react-intl';
import {Microservices} from '../../../../configs/microservices';

class UserMenu extends React.Component {
    constructor(props){
        super(props);
        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
        this.messages = this.getIntlMessages();
    }
    getIntlMessages(){
        return defineMessages({
            myDecks: {
                id: 'UserMenu.myDecks',
                defaultMessage: 'My Decks'
            },
            ownedDecks: {
                id: 'UserMenu.ownedDecks',
                defaultMessage: 'Owned Decks'
            },
            sharedDecks: {
                id: 'UserMenu.sharedDecks',
                defaultMessage: 'Shared Decks'
            },
            collections: {
                id: 'UserMenu.collections',
                defaultMessage: 'Playlists'
            },
            ownedCollections: {
                id: 'UserMenu.ownedCollections',
                defaultMessage: 'Owned Playlists'
            },
            recommendedDecks: {
                id: 'UserMenu.recommendedDecks',
                defaultMessage: 'Recommended Decks'
            }
        });
    }
    render() {
        let deckRecommendationsMsg = this.context.intl.formatMessage(this.messages.recommendedDecks);
        let deckRecommendationNavLink = (
            <NavLink className="item" href={'/user/' + this.props.user.uname + '/recommendations'} activeStyle={this.styles}>
                <p><i className="icons">
                    <i className="yellow open folder icon"></i>
                    <i className="corner thumbs up icon"></i>
                </i> {deckRecommendationsMsg}</p>
            </NavLink>
        );

        let decksMsg = this.context.intl.formatMessage(this.messages.myDecks);
        let sharedDecksMsg = this.context.intl.formatMessage(this.messages.sharedDecks);
        let deckCollectionsMsg = this.context.intl.formatMessage(this.messages.collections);

        //Remove link if it's not user's own page //Until recommendation service is properly integrated into the system, show only on experimental
        if(this.props.user.uname !== this.props.loggedinuser || Microservices.recommendation === undefined || Microservices.recommendation.uri !== 'http://slidewiki.imp.bg.ac.rs') {
            decksMsg = this.context.intl.formatMessage(this.messages.ownedDecks);
            deckCollectionsMsg = this.context.intl.formatMessage(this.messages.ownedCollections);
            deckRecommendationNavLink = '';
        }

        return (
          <div role="navigation">
              <div className="ui vertical fluid menu" role="menu">
                  <NavLink className="item" href={'/user/' + this.props.user.uname } activeStyle={this.styles} role="menuitem">
                      <p><i className="yellow icon open folder"/> {decksMsg}</p>
                  </NavLink>
                  { (this.props.user.uname === this.props.loggedinuser) &&
                    <NavLink className="item" href={'/user/' + this.props.user.uname + '/decks/shared'} activeStyle={this.styles} role="menuitem">
                        <p><i className="icons">
                                    <i className="yellow open folder icon"></i>
                                    <i className="corner users icon"></i>
                                </i> {sharedDecksMsg}</p>
                    </NavLink>
                  }
                  <NavLink className="item" href={'/user/' + this.props.user.uname + '/playlists'} activeStyle={this.styles} role="menuitem">
                      <p><i className="icon grid layout"/> {deckCollectionsMsg}</p>
                  </NavLink>
                  {deckRecommendationNavLink}
              </div>

          </div>
        );
    }
}

UserMenu.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default UserMenu;
