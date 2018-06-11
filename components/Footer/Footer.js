import React from 'react';
import { NavLink } from 'fluxible-router';


class Footer extends React.Component {
    render() {
        let info = <div className="ui inverted  list">
            <div className="item" style={{textAlign: 'justify'}}>The SlideWiki project has received funding from the European Union&#39;s Horizon 2020 research and innovation programme under grant agreement No 688095 </div>
            <div className="item">Copyright &copy; 2018 &middot; All Rights Reserved</div>
            <div className="item">Build GIT_COMMIT&#64;GIT_BRANCH</div>
        </div>;

        return (
            <div className="ui blue inverted vertical footer segment" ref="footer" style={{marginTop: '10px', paddignTop: '10px'}} role="contentinfo" >
                <div className="ui fluid container">
                    <div className="ui inverted divided equal height doubling grid">
                        <div className="one wide column computer tablet only"></div>
                        <div className="four wide column">
                            <h4 className="ui inverted header">About</h4>
                            <div className="ui inverted  link list">
                                <NavLink className="item" routeName="about" href="/about">About Us</NavLink>
                                <NavLink className="item" routeName="contactus" href="/contactus">Contact Us</NavLink>
                                <NavLink className="item" routeName="accessibility" href="/accessibility">Accessibility</NavLink>
                                <a className="item" href="https://github.com/slidewiki">Github</a>
                            </div>
                        </div>
                        <div className="five wide column">
                            <h4 className="ui inverted header">Terms & Conditions</h4>
                            <div className="ui inverted link list">
                                <NavLink className="item" routeName="terms" href="/terms">Terms</NavLink>
                                <NavLink className="item" routeName="license" href="/license">License</NavLink>
                                <NavLink className="item" routeName="imprint" href="/imprint">Imprint</NavLink>
                                <a className="item" href="https://www.tib.eu/en/service/data-protection/">Data Protection</a>
                            </div>
                        </div>
                        {/*NOTE following sections have been duplicated due to mobile experience changes*/}
                        <div className="five wide column computer tablet only">
                            {info}
                        </div>
                        <div className="seven wide column mobile only">
                            {info}
                        </div>
                        <div className="one wide column computer tablet only"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;
