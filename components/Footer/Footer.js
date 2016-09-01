import React from 'react';
import { NavLink } from 'fluxible-router';

class Footer extends React.Component {
    render() {
        return (
            <div className="ui horizontal segments footer" ref="footer">
                    <div className="ui right aligned segment">
                        <p>
                            Copyright &copy; 2016 &middot; All Rights Reserved
                        </p>
                    </div>
                    <div className="ui left aligned segment">
                        <NavLink className="item" routeName="about">About</NavLink>
                    </div>
            </div>
        );
    }
}

export default Footer;
