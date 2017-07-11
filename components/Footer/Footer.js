import React from 'react';
import { NavLink } from 'fluxible-router';

class Footer extends React.Component {
    render() {
        return (
            <div className="ui blue inverted vertical footer segment" ref="footer" style={{marginTop: '10px', paddignTop: '10px'}}>
                <div className="ui container">

                    <div className="ui stackable inverted divided equal height stackable grid">
                        <div className="four wide column">
                            <h4 className="ui inverted header">About</h4>
                            <div className="ui inverted link list">
                                <NavLink className="item" routeName="about" href="/about">About Us</NavLink>
                                <NavLink className="item" routeName="about" href="/about">Contact Us</NavLink>
                                <a className="item" href="https://github.com/slidewiki">Github</a>
                            </div>
                        </div>
                        <div className="five wide column">
                            <h4 className="ui inverted header">Terms & Conditions</h4>
                            <div className="ui inverted link list">
                                <NavLink className="item" routeName="license" href="/license">License</NavLink>
                                <NavLink className="item" routeName="imprint" href="/imprint">Imprint</NavLink>
                                <NavLink className="item" routeName="dataprotection" href="/dataprotection">Data Protection Conditions</NavLink>
                            </div>
                        </div>
                        <div className="five wide column">
                            <div className="ui inverted  list">
                                <div className="item">Copyright &copy; 2017 &middot; All Rights Reserved</div>
                                <div className="item">The SlideWiki project has received funding from the European Union's Horizon 2020 research and innovation programme under grant agreement No 688095 </div>
                                <div className="item">Build GIT_COMMIT&#64;GIT_BRANCH</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Footer;
