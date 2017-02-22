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
                         &nbsp;&middot;&nbsp;
                        <NavLink className="item" routeName="imprint">Imprint</NavLink>
                         &nbsp;&middot;&nbsp;
                        <NavLink className="item" routeName="dataprotection">Data Protection Conditions</NavLink>
                    </div>
                    <div className="ui left aligned segment">
                        <p>
                            Build GIT_COMMIT&#64;GIT_BRANCH
                        </p>
                    </div>
            </div>
        );
    }
}

export default Footer;
