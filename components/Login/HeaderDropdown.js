import React from 'react';
import { NavLink, navigateAction } from 'fluxible-router';
import UserPicture from '../common/UserPicture';
import { connectToStores } from 'fluxible-addons-react';
import userSignOut from '../../actions/user/userSignOut';
import loadNewUserNotifications from '../../actions/user/notifications/loadNewUserNotifications';
import UserProfileStore from '../../stores/UserProfileStore';
import UserNotificationsStore from '../../stores/UserNotificationsStore';
import fetchUser from '../../actions/user/userprofile/fetchUser';

class HeaderDropdown extends React.Component {
    componentDidMount(){
        $(this.refs.userDropDown).dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false});
        if(this.props.UserProfileStore.userpicture === undefined)
            this.context.executeAction(fetchUser,{ params: {username: this.props.UserProfileStore.username}, onlyPicture: true});

        this.context.executeAction(loadNewUserNotifications, { uid: this.props.UserProfileStore.userid });
    }

    componentDidUpdate() {
        $(this.refs.userDropDown).dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false});
        if(this.props.UserProfileStore.userpicture === undefined)
            this.context.executeAction(fetchUser, { params: {username: this.props.UserProfileStore.username}, onlyPicture: true});
    }

    onEnterAndClick(text, value) {
        if(value === 'logout')
            this.context.executeAction(userSignOut, {username: this.props.UserProfileStore.username});
        else
            this.context.executeAction(navigateAction, {url: value});
        $(this.refs.userDropDown).dropdown('hide');
        return false;
    }

    render() {
        let pic = (this.props.UserProfileStore.userpicture === undefined) ? '' : this.props.UserProfileStore.userpicture;
        return(
            <div className="ui top right pointing dropdown" ref="userDropDown">
                <div className="text">
                    <i className="icons"><UserPicture picture={ pic } username={ this.props.UserProfileStore.username } avatar={ true } width= { 30 }/>
                    {this.props.UserNotificationsStore.newNotifications.length ? <span className="ui mini circular floating red label ">{this.props.UserNotificationsStore.newNotifications.length}</span> : ''}
                  </i>
                </div>
                <i className="ui big left floated aligned dropdown icon"></i>
                <div className="menu">
                    <div className="header">
                        {this.props.UserProfileStore.username}
                    </div>
                    <div className="divider"></div>
                    <div className="item" data-value={'/user/' + this.props.UserProfileStore.username}>
                        <i className="user icon link"/> My Decks
                    </div>
                    <div className="item" data-value={'/user/' + this.props.UserProfileStore.username + '/settings/profile'}>
                        <i className="setting icon"/> My Settings
                    </div>
                    <div className="item" data-value={'/notifications'}>
                        <i className="icons">
                        <i className="newspaper icon"/>
                            {this.props.UserNotificationsStore.newNotifications.length ? <span className="ui mini circular floating red label ">{this.props.UserNotificationsStore.newNotifications.length}</span> : ''}
                        </i> My Notifications
                    </div>
                    <div className="item" data-value={'logout'}>
                        <i className="sign out icon"/> Sign Out
                    </div>
                </div>
            </div>
        );
    }
}

HeaderDropdown.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

HeaderDropdown = connectToStores(HeaderDropdown, [UserProfileStore, UserNotificationsStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        UserNotificationsStore: context.getStore(UserNotificationsStore).getState()
    };
});
export default HeaderDropdown;
