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
        this.onEnterAndClick = this.onEnterAndClick.bind(this);
        this.handleOnShowMenu = this.handleOnShowMenu.bind(this);
        this.handleOnHideMenu = this.handleOnHideMenu.bind(this);

    }
    componentDidMount(){
        //$(this.refs.userDropDown).dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false}); //string refs are legacy
        $('#userButtonMenu').dropdown({action: this.onEnterAndClick, selectOnKeydown: false, onShow: this.handleOnShowMenu, onHide:this.handleOnHideMenu});
        if(this.props.UserProfileStore.userpicture === undefined)
            this.context.executeAction(fetchUser,{ params: {username: this.props.UserProfileStore.username}, onlyPicture: true});

        this.context.executeAction(loadNewUserNotificationsCount, { uid: this.props.UserProfileStore.userid });
    }

    componentDidUpdate() {
        //$(this.refs.userDropDown).dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false});
        $('#userButtonMenu').dropdown({action: this.onEnterAndClick, selectOnKeydown: false, onShow: this.handleOnShowMenu, onHide:this.handleOnHideMenu});

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
        if(process.env.BROWSER){ //ensure the component is mounted
            this.setState({
                userMenuButtonExpanded : true
            });
            $('#myDecksMenuItem').focus();
        }
    }
    handleOnHideMenu(){
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
            <div>

              <div id="userButtonMenu" role="button" className="ui top right dropdown larger blue button" ref={(drop) => {this.userDropDown=drop;}}  aria-haspopup="true" aria-controls="userHeaderMenu" aria-label="User management" aria-expanded={this.state.userMenuButtonExpanded}>
                {/*<div className="text">*/}
                    <UserPicture picture={ pic } username={ this.props.UserProfileStore.username } avatar={ true } width= { 30 } />
                {/*</div>*/}

                {/*<i className="ui big left floated aligned dropdown icon"></i>{alarmIcon}*/}
                <div id="userHeaderMenuDesc" className='sr-only'> Menu options: My Decks, shortcut d; My Groups, shortcut g; My Settings, shortcut s;My Notifications, shortcut n; Sign out, shotcut o </div>
                <ul id="userHeaderMenu" className="ui menu vertical" style={{width:'160px'}} role="menu" aria-labelledby="userButtonMenu" aria-describedby="userHeaderMenuDesc" tabIndex="0">
                    {/*
                    <li className="header" role="separator" tabIndex="-1">
                        {this.props.UserProfileStore.username}
                    </li>
                    <li className="divider"  role="separator" tabIndex="-1" ></li>
                     */}
                    <li id="myDecksMenuItem" className="item" data-value={'/user/' + this.props.UserProfileStore.username} role="menuitem" aria-label="My Decks"  tabIndex="-1"  accessKey='d' >
                        <i className="user icon link"  aria-hidden={true} /> My Decks
                    </li>
                    <li className="item" data-value={'/user/' + this.props.UserProfileStore.username + '/groups/overview'} role="menuitem" aria-label="My Groups"  tabIndex="-1" accessKey='g'>
                        <i className="icon users" aria-hidden={true} /> My Groups
                    </li>
                    <li className="item" data-value={'/user/' + this.props.UserProfileStore.username + '/settings/profile' } role="menuitem" aria-label="My Settings"   tabIndex="-1" accessKey='s'>
                        <i className="setting icon" aria-hidden={true} /> My Settings
                    </li>
                    <li className="item" data-value={'/notifications'} role="menuitem" aria-label="My Notifications"  tabIndex="-1" accessKey='n'>
                        <i className={alarmClassName} aria-hidden={true}  /> My Notifications
                    </li>
                    <li className="item" data-value={'logout'} role="menuitem" aria-label="Sign Out"  tabIndex="-1"accessKey='o' >
                        <i className="sign out icon" aria-hidden={true} /> Sign Out
                    </li>

                </ul>
              </div>
                {alarmIcon} {/*Placed here to avoid sr problems*/}
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
