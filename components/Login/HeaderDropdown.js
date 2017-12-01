import React from 'react';
import { NavLink, navigateAction } from 'fluxible-router';
import UserPicture from '../common/UserPicture';
import { connectToStores } from 'fluxible-addons-react';
import userSignOut from '../../actions/user/userSignOut';
import loadNewUserNotificationsCount from '../../actions/user/notifications/loadNewUserNotificationsCount';
import UserProfileStore from '../../stores/UserProfileStore';
import UserNotificationsStore from '../../stores/UserNotificationsStore';
import fetchUser from '../../actions/user/userprofile/fetchUser';

class HeaderDropdown extends React.Component {
    constructor(props){
        super(props);
        this.userDropDown = undefined;
        this.state ={
            userMenuButtonExpanded : false
        };
        this.handleOnShowMenu = this.handleOnShowMenu.bind(this);
        this.handleOnHideMenu = this.handleOnHideMenu.bind(this);

    }
    componentDidMount(){
        //$(this.refs.userDropDown).dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false}); //string refs are legacy
        $('#userButtonMenu').dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false, onShow: this.handleOnShowMenu, onHide:this.handleOnHideMenu});
        if(this.props.UserProfileStore.userpicture === undefined)
            this.context.executeAction(fetchUser,{ params: {username: this.props.UserProfileStore.username}, onlyPicture: true});

        this.context.executeAction(loadNewUserNotificationsCount, { uid: this.props.UserProfileStore.userid });
    }

    componentDidUpdate() {
        //$(this.refs.userDropDown).dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false});
        $('#userButtonMenu').dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false, onShow: this.handleOnShowMenu, onHide:this.handleOnHideMenu});

        if(this.props.UserProfileStore.userpicture === undefined)
            this.context.executeAction(fetchUser, { params: {username: this.props.UserProfileStore.username}, onlyPicture: true});
    }

    onEnterAndClick(text, value) {
        if(value === 'logout')
            this.context.executeAction(userSignOut, {username: this.props.UserProfileStore.username});
        else
            this.context.executeAction(navigateAction, {url: value});
        //$(this.refs.userDropDown).dropdown('hide'); //ref strings are legacy
        $('#userButtonMenu').dropdown('hide');

        return false;
    }
    handleOnShowMenu(){
        console.log('onShow menu');

        this.setState({
            userMenuButtonExpanded : true
        });
        $('#myDecksMenuItem').focus();

    }
    handleOnHideMenu(){
        console.log('onHide menu');

        this.setState({
            userMenuButtonExpanded : false
        });

    }
 //ref="userDropDown"  removed the String ref
    render() {
        let pic = (this.props.UserProfileStore.userpicture === undefined) ? '' : this.props.UserProfileStore.userpicture;
        const alarmClassName = (this.props.UserNotificationsStore.newNotificationsCount > 0) ? 'alarm red icon' : 'alarm outline icon';
        const alarmIcon = (this.props.UserNotificationsStore.newNotificationsCount > 0) ? (<i className="ui small outline alarm icon" />) : '';
        return(
              <div id="userButtonMenu" className="ui top right dropdown larger blue button" ref={(drop) => {this.userDropDown=drop;}}  aria-haspopup="true" aria-controls="userHeaderMenu" aria-label="User management" aria-expanded={this.state.userMenuButtonExpanded}>
                {/*<div className="text">*/}
                    <UserPicture picture={ pic } username={ this.props.UserProfileStore.username } avatar={ true } width= { 30 } />
                {/*</div>*/}

                {/*<i className="ui big left floated aligned dropdown icon"></i>{alarmIcon}*/}
                <ul id="userHeaderMenu" className="ui menu vertical" style={{width:'160px'}} role="menu" aria-labelledby="userButtonMenu" tabIndex="0">
                    {/*
                    <li className="header" role="separator" tabIndex="-1">
                        {this.props.UserProfileStore.username}
                    </li>
                    <li className="divider"  role="separator" tabIndex="-1" ></li>
                     */}
                    <li id="myDecksMenuItem" className="item" data-value={'/user/' + this.props.UserProfileStore.username} role="menuitem" aria-label="My Decks" tabIndex="0" >
                        <i className="user icon link"  /> My Decks
                    </li>
                    <li className="item" data-value={'/user/' + this.props.UserProfileStore.username + '/groups/overview'} role="menuitem" aria-label="My Groups" tabIndex="0" >
                        <i className="icon users" /> My Groups
                    </li>
                    <li className="item" data-value={'/user/' + this.props.UserProfileStore.username + '/settings/profile' } role="menuitem" aria-label="My Settings" tabIndex="0" >
                        <i className="setting icon" /> My Settings
                    </li>
                    <li className="item" data-value={'/notifications'} role="menuitem" aria-label="My Notifications" tabIndex="0" >
                        <i className={alarmClassName} /> My Notifications
                    </li>
                    <li className="item" data-value={'logout'} role="menuitem" aria-label="Sign Out" tabIndex="0" >
                        <i className="sign out icon"/> Sign Out
                    </li>

                </ul>
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
