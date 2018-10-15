import React from 'react';
import { NavLink } from 'fluxible-router';


class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.openFacebook = this.openFacebook.bind(this);
        this.openLinkedIn = this.openLinkedIn.bind(this);
        this.openTwitter = this.openTwitter.bind(this);
    }

    openFacebook() {
        window.open('https://www.facebook.com/slidewiki/', '_blank');
    }

    openLinkedIn() {
        window.open('https://www.linkedin.com/company/slidewiki-eu', '_blank');
    }

    openTwitter() {
        window.open('https://twitter.com/slidewiki', '_blank');
    }
    render() {
        let rowClasses = {paddingTop: '0px', paddingBottom: '0px'};
        return (
            <div className='footer-container'>
                <div className='ui container'>
                    <div className='ui two column stackable grid'>
                        <div className='row' style={rowClasses}>
                            <div className='seven wide column'>
                                <div className='footer-left'>
                                    <div className='footer-menu'>
                                        <h3 className="ui medium inverted header">About</h3>
                                        <ul>
                                            <li><a href='/about'>About Us</a></li>
                                            <li><a href='/contactus'>Contact Us</a></li>
                                            <li><a href='/help'>Guides and Help</a></li>
                                            <li><a href='/accessibility'>Accessibility</a></li>
                                            <li><a href='https://github.com/slidewiki'>Github</a></li>
                                        </ul>
                                    </div>
                                    <div className='footer-menu'>
                                        <h3 className="ui medium inverted header">Terms &amp; Conditions</h3>
                                        <ul>
                                            <li><NavLink routeName='terms' href='/terms'>Terms</NavLink></li>
                                            <li><NavLink routeName='license' href='/license'>License</NavLink></li>
                                            <li><NavLink routeName='imprint' href='/imprint'>Imprint</NavLink></li>
                                            <li><a href='https://www.tib.eu/en/service/data-protection/'>Data Protection</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className='nine wide column'>
                                <div className='footer-right'>
                                    <h3 className="ui medium inverted header">Funding</h3>
                                    <p>The SlideWiki project has received funding from the European Union's Horizon 2020 research and innovation programme under grant agreement No 688095</p>
                                    <p>Copyright &copy; 2018 All Rights Reserved<br/> Build GIT_COMMIT&#64;GIT_BRANCH</p>
                                   {/*
                                    <div className='social-link'>
                                        <ul>
                                            <li><span>Follow us</span></li>
                                            <li><button className='ui circular facebook icon button' onClick={this.openFacebook}><i className='facebook f icon'/></button></li>
                                            <li><button className='ui circular linkedin icon button' onClick={this.openLinkedIn}><i className='linkedin icon'/></button> </li>
                                            <li><button className='ui circular twitter icon button' onClick={this.openTwitter}><i className='twitter icon'/></button></li>
                                        </ul>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
export default Footer;
