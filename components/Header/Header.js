import React from 'react';
import { NavLink } from 'fluxible-router';
import SearchBox  from '../Search/AutocompleteComponents/HeaderSearchBox';
//import UserNotificationsBadge from '../User/UserNotificationsPanel/UserNotificationsBadge';
import LoginModal from '../Login/LoginModal.js';
import AddDeckPanel from '../AddDeck/AddDeckPanel.js';
let MediaQuery = require ('react-responsive');

class Header extends React.Component {

    toggleSidebar() {
        $(this.refs.menubar)
          .sidebar('setting', 'transition', 'overlay')
          .sidebar('setting', 'mobileTransition', 'overlay')
          .sidebar('toggle');
    }

    render() {

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
                            <NavLink className="item" routeName="addDeck" activeClass="active">
                                <AddDeckPanel />
                            </NavLink>
                            {/*<UserNotificationsBadge className="ui item"/>*/}
                            <div className="item"><LoginModal/></div>
                        </div>

                    </div>
                </div>
              </MediaQuery>
              <MediaQuery query='(max-device-width: 767px)'>
                <div className="ui inverted blue menu" ref="header">
                  <button className="ui icon button item" onClick={this.toggleSidebar.bind(this)}><i className="content icon"/></button>
                </div>
                <div className="ui left dimmed sidebar vertical menu" ref="menubar">
                    <a className="item" href='/'>
                        <i className="home icon"/> Homepage
                    </a>
                    <div className="item">
                        <SearchBox className="item"/>
                    </div>
                    <NavLink className="item" routeName="addDeck">
                        <AddDeckPanel />
                    </NavLink>
                    {/*<UserNotificationsBadge className="ui item"/>*/}
                    <div className="item"><LoginModal/></div>
                </div>
              </MediaQuery>
            </div>
        );
    }
}

export default Header;
