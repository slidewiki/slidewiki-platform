import React from 'react';
import { NavLink } from 'fluxible-router';
import SearchBox  from './SearchBox';

class Header extends React.Component {
    render() {
        return (
            <div className="ui page grid inverted blue menu" ref="header">
                <div className="ui container">
                    <a href="/" className="header item">
                        <img className="logo" src="/assets/images/logo.png" />
                    </a>
                    <NavLink className="item" routeName="home" activeClass="active">Home</NavLink>
                    <NavLink className="item" routeName="about" activeClass="active">About</NavLink>
                    <div className="item right">
                        <SearchBox />
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;
