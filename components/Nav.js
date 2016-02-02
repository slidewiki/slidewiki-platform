import React from 'react';
import { NavLink } from 'fluxible-router';

class Nav extends React.Component {
    render() {
        return (
            <div className="ui page grid inverted blue menu">
                <div className="ui container">
                    <a href="/" className="header item">
                        <img className="logo" src="/assets/images/logo.png" />
                    </a>
                    <NavLink className="item" routeName="home" activeClass="active">Home</NavLink>
                    <NavLink className="item" routeName="about" activeClass="active">About</NavLink>
                </div>
            </div>
        );
    }
}

export default Nav;
