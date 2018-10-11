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
        let pic = (this.props.UserProfileStore.userpicture === undefined) ? '' : this.props.UserProfileStore.userpicture;
        const alarmClassName = (this.props.UserNotificationsStore.newNotificationsCount > 0) ? 'alarm red icon' : 'alarm outline icon';
        const alarmIcon = (this.props.UserNotificationsStore.newNotificationsCount > 0) ? (<i className="ui small outline alarm icon" style={{'marginTop':'0.5em'}}/>) : '';

        return(
            <AriaMenuButton.Wrapper
              onSelection={this.onHandleSelection}>
               <AriaMenuButton.Button >
                <div style={{'display': 'inline-flex'}} >
                 <UserPicture picture={ pic } username={ this.props.UserProfileStore.username } avatar={ true } width= { 30 } />
                  {alarmIcon}
                  <i className="ui caret down icon" style={{'marginTop':'0.5em'}}></i>
                 </div>

               </AriaMenuButton.Button>
               <AriaMenuButton.Menu className='ui menu vertical'
                style={{'position':'absolute', 'zIndex':'3', 'right':'0px', 'display': 'flex !important'}} >
                  <AriaMenuButton.MenuItem
                   className='item'
                   key= {0}
                   tag='li'
                   value={'/user/' + this.props.UserProfileStore.username}
                   text='My Decks'>
                   <span style={{color:'black'}}>
                   <i className="user icon link"  aria-hidden={true} />Decks</span>
                  </AriaMenuButton.MenuItem>
                  <AriaMenuButton.MenuItem
                   className='item'
                   key= {5}
                   tag='li'
                   value={'/user/' + this.props.UserProfileStore.username + '/playlists'}
                   text='My Playlists'>
                   <span style={{color:'black'}}>
                   <i className="grid layout icon"  aria-hidden={true} />Playlists</span>
                  </AriaMenuButton.MenuItem>
                  <AriaMenuButton.MenuItem
                   className='item'
                   key= {1}
                   tag='li'
                   value={'/user/' + this.props.UserProfileStore.username + '/groups/overview'}
                   text='My Groups'>
                   <span style={{color:'black'}}>
                   <i className="icon users" aria-hidden={true} />Groups </span>
                  </AriaMenuButton.MenuItem>
                  <AriaMenuButton.MenuItem
                   className="item"
                   key= {2}
                   tag='li'
                   value={'/user/' + this.props.UserProfileStore.username + '/settings/profile'}
                   text=' My Settings'>
                    <span style={{color:'black'}}>
                   <i className="setting icon" aria-hidden={true} />Settings
                   </span>
                  </AriaMenuButton.MenuItem>
                  <AriaMenuButton.MenuItem
                   className="item"
                   key= {3}
                   tag='li'
                   value={'/notifications'}
                   text='My Notifications'>
                   <span style={{color:'black'}}>
                   <i className={alarmClassName} aria-hidden={true} />Notifications
                   </span>
                  </AriaMenuButton.MenuItem>
                  <AriaMenuButton.MenuItem
                   className="item"
                   key= {4}
                   tag='li'
                   value={'logout'}
                   text='Sign Out'>
                   <span style={{color:'black'}}>
                    <i className="sign out icon" aria-hidden={true} /> Sign Out
                    </span>
                  </AriaMenuButton.MenuItem>
                </AriaMenuButton.Menu>
            </AriaMenuButton.Wrapper>
        );
    }
}

UserMenuDropdown.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

UserMenuDropdown = connectToStores(UserMenuDropdown, [UserProfileStore, UserNotificationsStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        UserNotificationsStore: context.getStore(UserNotificationsStore).getState()
    };
});
export default UserMenuDropdown;
