import React from 'react';
import { NavLink } from 'fluxible-router';


class Footer extends React.Component {

    render() {
        return (
            <footer className='footer-container'>
                <div className='ui container'>
                    <div className='ui two column stackable grid'>
                        <div className='row'>
                            <div className='seven wide column'>
                                <div className='footer-left'>
                                    <div className='footer-menu'>
                                        <h6>About</h6>
                                        <ul>
                                            <li><a href='/about'>About Us</a></li>
                                            <li><a href='/contactus'>Contact Us</a></li>
                                            <li><a href='/help'>Guides and Help</a></li>
                                            <li><a href='/accessibility'>Accessibility</a></li>
                                            <li><a href='https://github.com/slidewiki'>Github</a></li>
                                        </ul>
                                    </div>
                                    <div className='footer-menu'>
                                        <h6>Terms &amp; Conditions</h6>
                                        <ul>
                                            <li><a href='#'><NavLink routeName='terms' href='/terms'>Terms</NavLink></a></li>
                                            <li><a href='#'><NavLink routeName='license' href='/license'>License</NavLink></a></li>
                                            <li><a href='#'><NavLink routeName='imprint' href='/imprint'>Imprint</NavLink></a></li>
                                            <li><a href='https://www.tib.eu/en/service/data-protection/'>Data Protection</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className='nine wide column'>
                                <div className='footer-right'>
                                    <p>The SlideWiki project has received funding from the European Union's Horizon 2020 research and innovation programme under grant agreement No 688095</p>
                                    <p>Copyright &copy; 2018 · All Rights Reserved<br/> Build d91012b@</p>
                                    <div className='social-link'>
                                        <ul>
                                            <li><span>Follow us</span></li>
                                            <li><button className='ui circular facebook icon button'><i className='facebook f icon'/></button></li>
                                            <li><button className='ui circular linkedin icon button'><i className='linkedin icon'/></button> </li>
                                            <li><button className='ui circular twitter icon button'><i className='twitter icon'/></button></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        );
    }
}
export default Footer;
