import React from 'react';
import { NavLink } from 'fluxible-router';
import SearchBox  from '../Search/AutocompleteComponents/HeaderSearchBox';
//import UserNotificationsBadge from '../User/UserNotificationsPanel/UserNotificationsBadge';
import LoginModal from '../Login/LoginModal.js';
import AddDeckPanel from '../AddDeck/AddDeckPanel.js';
import {Input, Menu, Image, Container} from 'semantic-ui-react';

class Header extends React.Component {
    render() {

        return (
          <div>
            <div className="ui inverted blue menu" ref="header">
                <div className="ui container">
                    <a className="item" href='/'>
                        <img className="logo" src="/assets/images/slidewiki-square-notext-glow.svg" alt=""/>
                        &nbsp; SlideWiki
                    </a>
                    <div className="item">
                        <SearchBox className="item"/>
                    </div>
                    <div className="right menu">
                        <NavLink className="ui item" routeName="addDeck" activeClass="active">
                            <AddDeckPanel />
                        </NavLink>
                        {/*<UserNotificationsBadge className="ui item"/>*/}
                        <LoginModal className="ui item"/>
                    </div>

                </div>
            </div>

            <Menu inverted="true"  color="blue" secondary>
               <Container>
                 <Menu.Item href="/" >
                    <Image src="/assets/images/slidewiki-square-notext-glow.svg" size="mini" alt=""/>
                    &nbsp; SlideWiki
                 </Menu.Item>
                 <Menu.Item>
                    <SearchBox className="item"/>
                 </Menu.Item>
                 <Menu.Menu position="right">
                    <Menu.Item>
                      <NavLink routeName="addDeck" activeClass="active">
                          <AddDeckPanel />
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item>

                        <LoginModal />
                    </Menu.Item>
                 </Menu.Menu>
              </Container>
            </Menu>
          </div>
        );
    }
}

export default Header;
