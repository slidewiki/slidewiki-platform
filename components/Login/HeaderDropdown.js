import React from 'react';
import { NavLink, navigateAction } from 'fluxible-router';
import UserPicture from '../common/UserPicture';
import { connectToStores } from 'fluxible-addons-react';
import userSignOut from '../../actions/user/userSignOut';
import loadNewUserNotificationsCount from '../../actions/user/notifications/loadNewUserNotificationsCount';
import UserProfileStore from '../../stores/UserProfileStore';
import UserNotificationsStore from '../../stores/UserNotificationsStore';
import fetchUser from '../../actions/user/userprofile/fetchUser';
import {FormattedMessage, defineMessages} from 'react-intl';

class HeaderDropdown extends React.Component {
    componentDidMount(){
        $(this.refs.userDropDown).dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false});
        if(this.props.UserProfileStore.userpicture === undefined)
            this.context.executeAction(fetchUser,{ params: {username: this.props.UserProfileStore.username}, onlyPicture: true});

        this.context.executeAction(loadNewUserNotificationsCount, { uid: this.props.UserProfileStore.userid });
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
        const alarmClassName = (this.props.UserNotificationsStore.newNotificationsCount > 0) ? 'alarm red icon' : 'alarm outline icon';
        const alarmIcon = (this.props.UserNotificationsStore.newNotificationsCount > 0) ? (<i className="ui small outline alarm icon" />) : '';
        return(
            <div className="ui top right dropdown larger blue button" ref="userDropDown" role="button" aria-haspopup="true" aria-label="User management">
                <div className="text">
                    <UserPicture picture={ pic } username={ this.props.UserProfileStore.username } avatar={ true } width= { 30 } />
                </div>
                <i className="ui big left floated aligned dropdown icon"></i>{alarmIcon}
                <div className="ui menu vertical" style={{width:'160px'}} role="menu">
                    <div className="header">
                        {this.props.UserProfileStore.username}
                    </div>
                    <div className="divider"></div>
                    <div className="item" data-value={'/user/' + this.props.UserProfileStore.username} role="menuitem" aria-label="My Decks" tabIndex="0" >
                        <i className="user icon link"  /> <FormattedMessage id='header.mydecks' defaultMessage='My Decks'/>
                    </div>
                    <div className="item" data-value={'/user/' + this.props.UserProfileStore.username + '/groups/overview'} role="menuitem" aria-label="My Groups" tabIndex="0" >
                        <i className="icon users" /> <FormattedMessage id='header.mygroups' defaultMessage='My Groups'/>
                    </div>
                    <div className="item" data-value={'/user/' + this.props.UserProfileStore.username + '/settings/profile' } role="menuitem" aria-label="My Settings" tabIndex="0" >
                        <i className="setting icon" /> <FormattedMessage id='header.mysettings' defaultMessage='My Settings'/>
                    </div>
                    <div className="item" data-value={'/notifications'} role="menuitem" aria-label="My Notifications" tabIndex="0" >
                        <i className={alarmClassName} /><FormattedMessage id='header.mynotifications' defaultMessage='My Notifications'/>
                    </div>
                    <div className="item" data-value={'logout'} role="menuitem" aria-label="Sign Out" tabIndex="0" >
                        <i className="sign out icon"/> <FormattedMessage id='header.signout' defaultMessage='Sign Out'/>
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
