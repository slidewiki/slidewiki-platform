import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import userSignOut from '../../actions/user/userSignOut';
import UserProfileStore from '../../stores/UserProfileStore';
import UserNotificationsStore from '../../stores/UserNotificationsStore';
import UserPicture from '../common/UserPicture';
import ReactDOM from 'react-dom';
import loadNewUserNotifications from '../../actions/user/notifications/loadNewUserNotifications';
import UserNotificationsItem from '../User/UserNotificationsPanel/UserNotificationsItem';
import categoryBox from '../../actions/user/userprofile/categoryBox';

class HeaderDropdown extends React.Component {
    componentDidMount(){
        $('.ui.dropdown').dropdown({on: 'hover', action: 'nothing'});
    }

    componentDidUpdate() {
        $('.ui.dropdown').dropdown({on: 'hover', action: 'nothing'});
    }

    handleSignout() {
        this.context.executeAction(userSignOut, {});
    }

    toProfile() {
        this.context.executeAction(navigateAction, {url: '/user/' + this.props.UserProfileStore.username});
    }

    toDecks() {
        this.context.executeAction(categoryBox, {dest: 'decks'});
        this.context.executeAction(navigateAction, {url: '/user/' + this.props.UserProfileStore.username});
    }

    toSettings() {
        this.context.executeAction(categoryBox, {dest: 'settings'});
        this.context.executeAction(navigateAction, {url: '/user/' + this.props.UserProfileStore.username});
    }
    render() {
        return(
            <div>
            <div className="ui top left pointing dropdown">
                <div className="text">
                    <UserPicture picture={ this.props.UserProfileStore.user.picture } username={ this.props.UserProfileStore.username } avatar={ true } width= { 50 }/>
                </div>
                <div className="menu">
                    <div className="item">
                        <div onClick={ this.toProfile.bind(this) }><i className="user icon"/> My Profile</div>
                    </div>
                    <div className="item">
                        <div onClick={ this.toDecks.bind(this) }><i className="block layout icon"/> My Decks</div>
                    </div>
                    <div className="item">
                        <div onClick={ this.toSettings.bind(this) }><i className="setting icon"/> My Settings</div>
                    </div>
                    <div className="item">
                        <div onClick={ this.handleSignout.bind(this) }><i className="sign out icon"/> Sign Out</div>
                    </div>
                </div>
            </div>
            </div>
      );
    }
}

HeaderDropdown.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

HeaderDropdown = connectToStores(HeaderDropdown, [UserNotificationsStore, UserProfileStore], (context, props) => {
    return {
        UserNotificationsStore: context.getStore(UserNotificationsStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default HeaderDropdown;
