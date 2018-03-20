import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
<<<<<<< HEAD
=======
import { FormattedMessage, defineMessages } from 'react-intl';
>>>>>>> master

class UserMenu extends React.Component {
    constructor(props){
        super(props);
        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
<<<<<<< HEAD
    }

    render() {
        let decksMsg = 'My Decks';
        let deckCollectionsMsg = 'My Deck Collections';

        if(this.props.user.uname !== this.props.loggedinuser){
            decksMsg = 'Owned Decks';
            deckCollectionsMsg = 'Owned Deck Collections';
        }

        return (
          <div>
              <div className="ui vertical fluid menu">
                  <NavLink className="item" href={'/user/' + this.props.user.uname } activeStyle={this.styles}>
                      <p><i className="icon open folder"/> {decksMsg}</p>
                  </NavLink>
                  <NavLink className="item" href={'/user/' + this.props.user.uname + '/collections'} activeStyle={this.styles}>
=======
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
                defaultMessage: 'Decks shared with me'
            },
            collections: {
                id: 'UserMenu.collections', 
                defaultMessage: 'My Deck Collections'
            },
            ownedCollections: {
                id: 'UserMenu.ownedCollections', 
                defaultMessage: 'Owned Deck Collections'
            }
        });
    }
    render() {
        let decksMsg = this.context.intl.formatMessage(this.messages.myDecks);
        let sharedDecksMsg = this.context.intl.formatMessage(this.messages.sharedDecks);
        let deckCollectionsMsg = this.context.intl.formatMessage(this.messages.collections);

        if(this.props.user.uname !== this.props.loggedinuser){
            decksMsg = this.context.intl.formatMessage(this.messages.ownedDecks);
            deckCollectionsMsg = this.context.intl.formatMessage(this.messages.ownedCollections);
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
                  <NavLink className="item" href={'/user/' + this.props.user.uname + '/collections'} activeStyle={this.styles} role="menuitem">
>>>>>>> master
                      <p><i className="icon grid layout"/> {deckCollectionsMsg}</p>
                  </NavLink>
              </div>

          </div>
        );
    }
}

UserMenu.contextTypes = {
<<<<<<< HEAD
    executeAction: React.PropTypes.func.isRequired
=======
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
>>>>>>> master
};

export default UserMenu;
