import PropTypes from 'prop-types';
import React from 'react';
import {NavLink} from 'fluxible-router';
import {defineMessages} from 'react-intl';
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
            },
        });
    }
    render() {
        let decksMsg = this.context.intl.formatMessage(this.messages.myDecks);
        let sharedDecksMsg = this.context.intl.formatMessage(this.messages.sharedDecks);
        let deckCollectionsMsg = this.context.intl.formatMessage(this.messages.collections);
        let deckRecommendationsMsg = this.context.intl.formatMessage(this.messages.recommendedDecks);

        if(this.props.user.uname !== this.props.loggedinuser) {
            decksMsg = this.context.intl.formatMessage(this.messages.ownedDecks);
            deckCollectionsMsg = this.context.intl.formatMessage(this.messages.ownedCollections);
        }

        return (
          <div role="navigation">
              <div className="ui vertical fluid menu" role="menu">
                  <NavLink className="item" href={'/user/' + this.props.user.uname } activeStyle={this.styles} role="menuitem">
                      <p><i className="icon open folder"/> {decksMsg}</p>
                  </NavLink>
                  { (this.props.user.uname === this.props.loggedinuser) &&
                    <NavLink className="item" href={'/user/' + this.props.user.uname + '/decks/shared'} activeStyle={this.styles} role="menuitem">
                        <p><i className="icons">
                                    <i className="open folder icon"></i>
                                    <i className="corner users icon"></i>
                                </i> {sharedDecksMsg}</p>
                    </NavLink>
                  }
                  { (this.props.user.uname === this.props.loggedinuser && Microservices.analytics) &&
                    <NavLink className="item" href={'/user/' + this.props.user.uname + '/recommendations'} activeStyle={this.styles}>
                        <p><i className="icons">
                            <i className="open folder icon"></i>
                            <i className="corner thumbs up icon"></i>
                        </i> {deckRecommendationsMsg}</p>
                    </NavLink>
                  }
                  <NavLink className="item" href={'/user/' + this.props.user.uname + '/playlists'} activeStyle={this.styles} role="menuitem">
                      <p><i className="icon grid layout"/> {deckCollectionsMsg}</p>
                  </NavLink>
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
