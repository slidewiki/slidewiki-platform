import PropTypes from 'prop-types';
import React from 'react';
import {NavLink} from 'fluxible-router';
import { FormattedMessage, defineMessages } from 'react-intl';

class Menu extends React.Component {
    constructor(props){
        super(props);
        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
        this.messages = this.getIntlMessages();
    }
    getIntlMessages(){
        return defineMessages({
            members: {
                id: 'GroupMenu.members',
                defaultMessage: 'Members'
            },
            sharedDecks: {
                id: 'GroupMenu.sharedDecks',
                defaultMessage: 'Shared Decks'
            },
            collections: {
                id: 'GroupMenu.collections',
                defaultMessage: 'Playlists'
            },
            goBack: {
                id: 'GroupMenu.goBack',
                defaultMessage: 'Back to list'
            }
        });
    }
    render() {
        let memberMsg = this.context.intl.formatMessage(this.messages.members);
        let sharedDecksMsg = this.context.intl.formatMessage(this.messages.sharedDecks);
        let deckCollectionsMsg = this.context.intl.formatMessage(this.messages.collections);
        let goBackMsg = this.context.intl.formatMessage(this.messages.goBack);

        return (
          <div role="navigation">
              <div className="ui vertical fluid menu" role="menu">
                  <NavLink className="item" href={'/usergroup/' + this.props.group._id + '/settings' } activeStyle={this.styles} role="menuitem">
                      <p><i className="icon users"/> {memberMsg}</p>
                  </NavLink>
                  <NavLink className="item" href={'/usergroup/' + this.props.group._id + '/decks'} activeStyle={this.styles} role="menuitem">
                        <p><i className="icons">
                                    <i className="yellow open folder icon"></i>
                                    <i className="corner users icon"></i>
                                </i> {sharedDecksMsg}</p>
                    </NavLink>
                  <NavLink className="item" href={'/usergroup/' + this.props.group._id + '/playlists'} activeStyle={this.styles} role="menuitem">
                      <p><i className="icon grid layout"/> {deckCollectionsMsg}</p>
                  </NavLink><NavLink className="item" href={'/user/' + this.props.username + '/groups/overview'} activeStyle={this.styles} role="menuitem">
                      <p><i className="icon users"/> {goBackMsg}</p>
                  </NavLink>
              </div>
          </div>
        );
    }
}

Menu.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default Menu;
