import React from 'react';
import { NavLink } from 'fluxible-router';
import SearchBox  from '../Search/AutocompleteComponents/HeaderSearchBox';
//import UserNotificationsBadge from '../User/UserNotificationsPanel/UserNotificationsBadge';
import LoginModal from '../Login/LoginModal.js';
import HeaderDropdown from '../Login/HeaderDropdown.js';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../stores/UserProfileStore';
import userSignOut from '../../actions/user/userSignOut';
let MediaQuery = require ('react-responsive');

class Header extends React.Component {
    componentDidMount() {
        $(this.refs.menubar)
            .sidebar({ 'silent': true, 'transition': 'overlay', 'mobileTransition': 'overlay' });
    }

    toggleSidebar() {
        $(this.refs.menubar)
            .sidebar('toggle');
    }

    closeSidebar(event) {
        if(($(event.target).hasClass('item') && !$(event.target).hasClass('search')))
            $(this.refs.menubar).sidebar('hide');
    }

    handleLoginButton() {
        $('.ui.login.modal')
            .modal('toggle');
        this.closeSidebar({target: '<a className="item"></a>'});
    }

    logout() {
        this.context.executeAction(userSignOut, { username: this.props.UserProfileStore.username });
    }

    render() {

        let loginButton = <button ref="loginButton" className="ui inverted button" onClick={this.handleLoginButton.bind(this)}>Sign In</button>;
        let mobileLoginButton = <a className="item" onClick={this.handleLoginButton.bind(this)}><i className="sign in icon"/> Sign in</a>;

        if (this.props.UserProfileStore.username !== '') {
            loginButton = <HeaderDropdown/>;
            mobileLoginButton = (<div>
              <NavLink className="item" href={'/user/' + this.props.UserProfileStore.username}><i className="user icon"/>My Decks</NavLink>
              <NavLink className="item" href={'/user/' + this.props.UserProfileStore.username + '/settings/profile'}><i className="setting icon"/>My Settings</NavLink>
              <a className="item" onClick={this.logout.bind(this)}><i className="sign out icon"/>Logout</a>
            </div>);
        }

        return (
            <div>
              <MediaQuery query='(min-device-width: 768px)'>
                <div className="ui inverted blue menu" ref="header">
                    <div className="ui container">
                        <a className="item" href='/'>
                            <img className="logo" src="/assets/images/slidewiki-square-notext-glow.svg" alt=""/>
                            &nbsp; SlideWiki
                        </a>
                        <div className="item">
                            <SearchBox className="item"/>
                        </div>
                        <div className="ui right inverted blue menu">
                            <div className="item">
                              <NavLink routeName="addDeck" activeClass="active" className="ui right labeled icon button">
                                  <i className="right plus icon"></i>Add deck
                              </NavLink>
                            </div>
                            {/*<UserNotificationsBadge className="ui item"/>*/}
                            <div className="item">{loginButton}<LoginModal/></div>
                        </div>
                    </div>
                </div>
              </MediaQuery>
              <MediaQuery query='(max-device-width: 767px)'>
                <div className="ui inverted blue menu" ref="header">
                  <button className="ui icon button item" onClick={this.toggleSidebar.bind(this)}><i className="content icon"/></button>
                  <div className="ui right inverted blue menu">
                    <NavLink className="item" href='/'>
                        <i className="home icon"/> SlideWiki
                    </NavLink>
                  </div>
                </div>
                <div className="ui inverted left dimmed sidebar vertical menu" ref="menubar" onClick={this.closeSidebar.bind(this)}>
                    <NavLink className="item" href='/'>
                        <i className="home icon"/> Homepage
                    </NavLink>
                    <NavLink className="item" routeName="addDeck">
                        <i className="add icon"/>Add Deck
                    </NavLink>
                    {/*<UserNotificationsBadge className="ui item"/>*/}
                    {mobileLoginButton}
                    <LoginModal/>
                    <div className="item search">
                        <SearchBox className="item"/>
                    </div>
                </div>
              </MediaQuery>
            </div>
        );
    }
}

Header.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

Header = connectToStores(Header, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default Header;
