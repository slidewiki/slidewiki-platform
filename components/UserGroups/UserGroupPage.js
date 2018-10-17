import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import UserGroupsStore from '../../stores/UserGroupsStore';
import UserProfileStore from '../../stores/UserProfileStore';
import Info from './Info';
import Menu from './Menu';
import Details from './Details';
import Decks from './Decks';
import GroupCollections from '../DeckCollection/GroupCollections';
import { FormattedMessage, defineMessages } from 'react-intl';
import {navigateAction} from 'fluxible-router';
import { NavLink } from 'fluxible-router';

class UserGroupPage extends React.Component {
    constructor(props){
        super(props);
    }

    showDecks(){
        let group = this.props.UserGroupsStore.currentUsergroup;
        const isCreator = group.creator && group.creator.userid === this.props.UserProfileStore.userid;
        const isAdmin = group.members && group.members.find((m) => {
            return m.userid === this.props.UserProfileStore.userid && (m.role && m.role[0] === 'admin');
        });

        return <Decks decks={this.props.UserProfileStore.userDecks}
            decksMeta={this.props.UserProfileStore.userDecksMeta}
            loadMoreLoading={this.props.UserProfileStore.nextUserDecksLoading}
            loadMoreError={this.props.UserProfileStore.nextUserDecksError}
            user={this.props.UserProfileStore.user}
            loggedinuser={this.props.UserProfileStore.username}
            groupid={this.props.UserGroupsStore.currentUsergroup.id}
            isAdmin={ isAdmin }
            isCreator={ isCreator } />;
    }

    showCollections(){
        let group = this.props.UserGroupsStore.currentUsergroup;
        const isCreator = group.creator && group.creator.userid === this.props.UserProfileStore.userid;
        const isAdmin = group.members && group.members.find((m) => {
            return m.userid === this.props.UserProfileStore.userid && (m.role && m.role[0] === 'admin');
        });

        return <GroupCollections group={this.props.UserGroupsStore.currentUsergroup}
            isAdmin={ isAdmin }
            isCreator={ isCreator } />;
    }

    showDetails(){
        let group = this.props.UserGroupsStore.currentUsergroup;
        const isCreator = group.creator && group.creator.userid === this.props.UserProfileStore.userid;
        const isAdmin = group.members && group.members.find((m) => {
            return m.userid === this.props.UserProfileStore.userid && (m.role && m.role[0] === 'admin');
        });
        const isMember = group.members && group.members.find((m) => {
            return m.userid === this.props.UserProfileStore.userid;
        });
        return <Details currentUsergroup={ this.props.UserGroupsStore.currentUsergroup }
            isAdmin={ isAdmin } isCreator={ isCreator } isMember={isMember}
            saveUsergroupError={this.props.UserGroupsStore.saveUsergroupError}
            username={this.props.UserProfileStore.username}
            displayName={this.props.UserProfileStore.user.displayName}
            user={this.props.UserProfileStore.user}
            userid={this.props.UserProfileStore.userid}
            saveUsergroupIsLoading={this.props.UserGroupsStore.saveUsergroupIsLoading}
            picture={this.props.UserProfileStore.user.picture} />;
    }

    chooseView(){
        // console.log('chooseView', this.props.UserGroupsStore.category);
        switch(this.props.UserGroupsStore.category){
            case 'settings':
                return this.showDetails();
            case 'decks':
            case undefined:
                return this.showDecks();
            case 'playlists':
                return this.showCollections();
            default:
                return this.showDetails();
        }
    }

    handleGoBack() {
        this.context.executeAction(navigateAction, {url: `/user/${this.props.UserProfileStore.username}/groups/overview`});
    }

    render() {
        let profileClasses = classNames({
            'tablet': true,
            'computer': true,
            'only': true,
            'sixteen': true,
            'wide': true,
            'column': true
        });
        const messages = defineMessages({
            goBack: {
                id: 'UserGroupPage.goBack',
                defaultMessage: 'My Groups',
            },
        });
        return (
          <div className = "ui vertically padded stackable grid container" >
              <div className = "four wide column" >
                <div className = "ui stackable grid ">
                  <div className = {profileClasses}>
                      <Info group={ this.props.UserGroupsStore.currentUsergroup } />
                  </div>
                  <div className = "sixteen wide column">
                      {(this.props.UserGroupsStore.currentUsergroup._id && this.props.UserGroupsStore.currentUsergroup._id > 0) ?
                        (<div><Menu group={ this.props.UserGroupsStore.currentUsergroup } username={this.props.UserProfileStore.username} />
                        <br /></div>)
                      : ''}
                      <div className="ui vertical fluid menu">
                        <NavLink className="item" href={`/user/${this.props.UserProfileStore.username}/groups/overview`} activeStyle={this.styles}>
                          <p>
                            <i className="icon users"/>
                            {this.context.intl.formatMessage(messages.goBack)}
                          </p>
                        </NavLink>
                      </div>
                  </div>
                </div>
              </div>
              <div className = "twelve wide column" >
                  {this.chooseView()}
              </div>
              <div className="ui tab" data-tab="activity"></div>
          </div>
        );
    }
}

UserGroupPage.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

UserGroupPage = connectToStores(UserGroupPage, [UserGroupsStore, UserProfileStore], (context, props) => {
    return {
        UserGroupsStore: context.getStore(UserGroupsStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default UserGroupPage;
