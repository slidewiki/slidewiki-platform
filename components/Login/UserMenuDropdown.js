import PropTypes from 'prop-types';
import React from 'react';
import { NavLink, navigateAction } from 'fluxible-router';
import UserPicture from '../common/UserPicture';
import { connectToStores } from 'fluxible-addons-react';
import userSignOut from '../../actions/user/userSignOut';
import loadNewUserNotificationsCount from '../../actions/user/notifications/loadNewUserNotificationsCount';
import UserProfileStore from '../../stores/UserProfileStore';
import UserNotificationsStore from '../../stores/UserNotificationsStore';
import fetchUser from '../../actions/user/userprofile/fetchUser';
import AriaMenuButton from 'react-aria-menubutton';
import {FormattedMessage, defineMessages} from 'react-intl';
import {Microservices} from '../../configs/microservices';
import styled from 'styled-components';

const ButtonStyled = styled(AriaMenuButton.Button)`
    cursor: pointer;
    transition: 0.2s background;
    background:#1e78bb;
    margin:-3px 0;

    &:hover {
        background:#18659f;
    }
`;

const NotificationLabel = styled.div`
    border-radius:50px;
    width:25px;
    height:25px;
    margin-top:4px!important;
`;

const NotificationLabelInline = styled.div`
    margin: -3px 2px!important;
`;

const InnerButton = styled.div`
    display:inline-flex;
    margin:3px 5px;
`;

const MenuItemStyled = styled(AriaMenuButton.MenuItem)`
    cursor: pointer;
    transition: 0.2s background;

    &:hover {
        background: #f4f4f4!important;
    }
`;

class UserMenuDropdown extends React.Component {
    constructor(props){
        super(props);
        this.userDropDown = undefined;
        this.state ={
            userMenuButtonExpanded : false
        };
        this.onHandleSelection = this.onHandleSelection.bind(this);

    }
    componentDidMount(){
        if(this.props.UserProfileStore.userpicture === undefined)
            this.context.executeAction(fetchUser,{ params: {username: this.props.UserProfileStore.username}, onlyPicture: true});

        this.context.executeAction(loadNewUserNotificationsCount, { uid: this.props.UserProfileStore.userid });
    }

    componentDidUpdate() {

        if(this.props.UserProfileStore.userpicture === undefined)
            this.context.executeAction(fetchUser, { params: {username: this.props.UserProfileStore.username}, onlyPicture: true});
    }

    onHandleSelection(value, event) {
        if(value === 'logout')
            this.context.executeAction(userSignOut, {username: this.props.UserProfileStore.username});
        else
            this.context.executeAction(navigateAction, {url: value});

    }

    render() {
        const messages = defineMessages({
            myDecks: {
                id: 'UserMenuDropdown.mydecks',
                defaultMessage: 'My Decks'
            },
            decks: {
                id: 'UserMenuDropdown.decks',
                defaultMessage: 'Decks'
            },
            myPlaylists: {
                id: 'UserMenuDropdown.myplaylists',
                defaultMessage: 'My Playlists'
            },
            playlists: {
                id: 'UserMenuDropdown.playlists',
                defaultMessage: 'Playlists'
            },
            myGroups: {
                id: 'UserMenuDropdown.mygroups',
                defaultMessage: 'My Groups'
            },
            groups: {
                id: 'UserMenuDropdown.groups',
                defaultMessage: 'Groups'
            },
            mySettings: {
                id: 'UserMenuDropdown.mySettings',
                defaultMessage: 'My Settings'
            },
            settings: {
                id: 'UserMenuDropdown.settings',
                defaultMessage: 'Settings'
            },
            myNotifications: {
                id: 'UserMenuDropdown.myNotifications',
                defaultMessage: 'My Notifications'
            },
            notifications: {
                id: 'UserMenuDropdown.notifications',
                defaultMessage: 'Notifications'
            },
            signout: {
                id: 'UserMenuDropdown.signout',
                defaultMessage: 'Sign Out'
            },            
        });

        let pic = (this.props.UserProfileStore.userpicture === undefined) ? '' : this.props.UserProfileStore.userpicture;
        const notificationCount = this.props.UserNotificationsStore.newNotificationsCount;
        const alarmClassName = (notificationCount > 0) ? 'alarm red icon' : 'alarm outline icon';
        
        return(
            <AriaMenuButton.Wrapper
              onSelection={this.onHandleSelection}>
               <ButtonStyled aria-label='User menu' className="sw-usermenu">
                <InnerButton>
                 <UserPicture picture={ pic } username={ this.props.UserProfileStore.username } avatar={ true } width= { 30 } />
                  <NotificationLabel className="ui label pink circular">{notificationCount}</NotificationLabel>
                  <i className="ui caret down icon" style={{'marginTop':'0.5em'}}></i>
                  
                 </InnerButton>

               </ButtonStyled>
               <AriaMenuButton.Menu className='ui menu vertical'
                style={{'position':'absolute', 'zIndex':'3', 'right':'0px', 'display': 'flex !important'}} >
                  <MenuItemStyled
                   className='item'
                   tag='li'
                   value={'/user/' + this.props.UserProfileStore.username}
                   text= {this.context.intl.formatMessage(messages.myDecks)}
                   >
                   <span style={{color:'black'}}>
                   <i className="user icon link"  aria-hidden={true} />{<FormattedMessage{...messages.decks} />}
                   </span>
                  </MenuItemStyled>
                  <MenuItemStyled
                   className='item'
                   tag='li'
                   value={'/user/' + this.props.UserProfileStore.username + '/playlists'}
                   text={this.context.intl.formatMessage(messages.myPlaylists)}>
                   <span style={{color:'black'}}>
                   <i className="grid layout icon"  aria-hidden={true} />{<FormattedMessage{...messages.playlists} />}
                   </span>
                  </MenuItemStyled>
                  <MenuItemStyled
                   className='item'
                   tag='li'
                   value={'/user/' + this.props.UserProfileStore.username + '/groups/overview'}
                   text={this.context.intl.formatMessage(messages.myGroups)}>
                   <span style={{color:'black'}}>
                   <i className="icon users" aria-hidden={true} />{<FormattedMessage{...messages.groups} />} 
                   </span>
                  </MenuItemStyled>
                  <MenuItemStyled
                   className="item"
                   tag='li'
                   value={'/user/' + this.props.UserProfileStore.username + '/settings/profile'}
                   text={this.context.intl.formatMessage(messages.mySettings)}>
                    <span style={{color:'black'}}>
                   <i className="setting icon" aria-hidden={true} />{<FormattedMessage{...messages.settings} />}
                   </span>
                  </MenuItemStyled>
                  { Microservices.analytics &&
                    <MenuItemStyled
                     className="item"
                     tag='li'
                     value={'/user/' + this.props.UserProfileStore.username + '/analytics/performanceprediction'}
                     text='Analytics'>
                     <span style={{color:'black'}}>
                     <i className="icon chart bar" aria-hidden={true} />Analytics
                     </span>
                    </MenuItemStyled>
                  }
                  <MenuItemStyled
                   className="item"
                   tag='li'
                   value={'/notifications'}
                   text={this.context.intl.formatMessage(messages.myNotifications)}>
                   <span style={{color:'black'}}>
                   <i className={alarmClassName} aria-hidden={true} />{<FormattedMessage{...messages.notifications}/>} <NotificationLabelInline className="ui label pink circular">{notificationCount}</NotificationLabelInline>
                   </span>
                  </MenuItemStyled>
                  <MenuItemStyled
                   className="item"
                   tag='li'
                   value={'logout'}
                   text={this.context.intl.formatMessage(messages.signout)}>
                   <span style={{color:'black'}}>
                    <i className="sign out icon" aria-hidden={true} />{<FormattedMessage{...messages.signout}/>}
                    </span>
                  </MenuItemStyled>
                </AriaMenuButton.Menu>
            </AriaMenuButton.Wrapper>
        );
    }
}

UserMenuDropdown.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

UserMenuDropdown = connectToStores(UserMenuDropdown, [UserProfileStore, UserNotificationsStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        UserNotificationsStore: context.getStore(UserNotificationsStore).getState()
    };
});
export default UserMenuDropdown;
