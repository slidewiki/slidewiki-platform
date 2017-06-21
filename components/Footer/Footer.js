import React from 'react';
import { NavLink } from 'fluxible-router';

class Footer extends React.Component {
    render() {
        return (
          <div className="ui blue inverted vertical footer segment" ref="footer" style={{marginTop: '10px', paddignTop: '10px'}}>
            <div className="ui container">

            <div className="ui stackable inverted divided equal height stackable grid">
              <div className="three wide column">
                <h4 className="ui inverted header">About</h4>
                <div className="ui inverted link list">
                  <NavLink className="item" routeName="about" href="/about">About Us</NavLink>
                  <NavLink className="item" routeName="about" href="/about">Contact Us</NavLink>
                </div>
              </div>
              <div className="three wide column">
                <h4 className="ui inverted header">Terms & Conditions</h4>
                <div className="ui inverted link list">
                  <NavLink className="item" routeName="license" href="/license">License</NavLink>
                  <NavLink className="item" routeName="imprint" href="/imprint">Imprint</NavLink>
                  <NavLink className="item" routeName="dataprotection" href="/dataprotection">Data Protection Conditions</NavLink>
                </div>
              </div>
              <div className="seven wide column">
                <p>Copyright &copy; 2017 &middot; All Rights Reserved</p>
                <p>Build GIT_COMMIT&#64;GIT_BRANCH</p>
              </div>
            </div>

            </div>
          </div>
        );
    }
}

export default Footer;
