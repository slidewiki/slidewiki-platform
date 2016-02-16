import React from 'react';
import { NavLink } from 'fluxible-router';

class Footer extends React.Component {
    render() {
        return (
            <div className="ui footer sticky segment" ref="footer">
                <div className="ui center aligned container">
                    <p>Copyright &copy; 2016 &middot; All Rights Reserved</p>
                </div>
            </div>
        );
    }
}

export default Footer;
