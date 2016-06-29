import React from 'react';
import { NavLink } from 'fluxible-router';
import SearchBox  from './SearchBox';
import SearchBoxBadge  from '../Search/SearchResultsPanel/SearchBoxBadge';
import UserNotificationsBadge from '../User/UserNotificationsPanel/UserNotificationsBadge';
import Login from '../Login/Login.js';
import LoginModal from '../Login/LoginModal.js'

class Header extends React.Component {
    render() {

        return (
            <div className="ui page grid inverted blue menu" ref="header">
                <div className="ui container">
                    <a href="/" className="header item">
                        <img className="logo" src="/assets/images/slidewiki-square-notext-glow.svg" />
                        &nbsp; SlideWiki
                    </a>
                    <NavLink className="item" routeName="about" activeClass="active">About</NavLink>
                    <NavLink className="item right" routeName="import" activeClass="active">Upload your presentation</NavLink>
                    <div className="item right">
                        <SearchBox />
                    </div>
                    <UserNotificationsBadge />
                    <NavLink className="item right" routeName="login" activeClass="active">Login</NavLink>
                    <LoginModal />
                </div>
            </div>
        );
    }
}

export default Header;
