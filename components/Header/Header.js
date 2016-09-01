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
            <div className="ui inverted blue menu" ref="header">
                <div className="ui container">
                    <NavLink className="item" routeName="home">
                        <img className="logo" src="/assets/images/slidewiki-square-notext-glow.svg" />
                        &nbsp; SlideWiki
                    </NavLink>
                    <div className="item">
                        <SearchBox className="item"/>
                    </div>
                    <NavLink className="item" href={'/search/advsearch'} activeClass="active">Advanced search</NavLink>

                    <div className="right menu">
                        <NavLink className="ui item" routeName="addDeck" activeClass="active">
                            <AddDeckPanel />
                        </NavLink>
                        <UserNotificationsBadge className="zi item"/>
                        <LoginModal className="ui item"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;
