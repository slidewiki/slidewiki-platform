import React from 'react';
import { NavLink } from 'fluxible-router';
import {branch, head} from '../../configs/version.js';

class Footer extends React.Component {
    render() {
        let versionString = '';
        if (branch !== false && head !== false) {
            versionString = '- Build: ' + branch + ' @' + head;
        }
        return (
            <div className="ui footer sticky segment" ref="footer">
                <div className="ui center aligned container">
                    <p>
                      Copyright &copy; 2016 &middot; All Rights Reserved {versionString}
                    </p>
                </div>
            </div>
        );
    }
}

export default Footer;
