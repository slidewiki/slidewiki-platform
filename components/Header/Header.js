import React from 'react';
import { NavLink } from 'fluxible-router';
import SearchBox  from './SearchBox';
import SearchBoxBadge  from '../Search/SearchResultsPanel/SearchBoxBadge';
import UserNotificationsBadge from '../User/UserNotificationsPanel/UserNotificationsBadge';
import LoginModal from '../Login/LoginModal.js';
import AddDeckPanel from '../AddDeck/AddDeckPanel.js';

class Header extends React.Component {
    render() {

        return (
            <div className="ui grid inverted blue menu" ref="header">
                <div className="ui container">
                    <a href="/" className="header item">
                        <img className="logo" src="/assets/images/slidewiki-square-notext-glow.svg" />
                        &nbsp; SlideWiki
                    </a>
                    <NavLink className="item" routeName="about" activeClass="active">About</NavLink>
                    <div className="item right">
                        <SearchBox />
                    </div>
                    <AddDeckPanel />
                    <NavLink className="item" href={'/search/advsearch'} activeClass="active">Advanced search</NavLink>
                    <UserNotificationsBadge />
                    <LoginModal />
                </div>
            </div>
        );
    }
}

export default Header;
