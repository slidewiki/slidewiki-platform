import React from 'react';
import { NavLink } from 'fluxible-router';
import {FormattedMessage, defineMessages} from 'react-intl';
import PropTypes from 'prop-types';



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

        const messages = defineMessages({
            srHeader: {
                id: 'footer.sr.header',
                defaultMessage: 'Information about SlideWiki'
            },
            header: {
                id: 'footer.header',
                defaultMessage: 'About'
            },
            aboutus: {
                id: 'footer.about',
                defaultMessage: 'About Us'
            },
            contact: {
                id: 'footer.contact',
                defaultMessage: 'Contact Us'
            },
            guides: {
                id: 'footer.guides',
                defaultMessage: 'Guides and Help'
            },
            accessibility: {
                id: 'footer.accessibility',
                defaultMessage: 'Accessibility'
            },
            termsHeader: {
                id: 'footer.terms.header',
                defaultMessage: 'Terms \\u0026 Conditions'
            },
            terms: {
                id: 'footer.terms',
                defaultMessage: 'Terms'
            },
            license: {
                id: 'footer.license',
                defaultMessage: 'License'
            },
            imprint: {
                id: 'footer.imprint',
                defaultMessage: 'Imprint'
            },
            data: {
                id: 'footer.data',
                defaultMessage: 'Data Protection'
            },
            funding: {
                id: 'footer.funding',
                defaultMessage: 'Funding'
            },
            fundingtext: {
                id: 'footer.funding.text',
                defaultMessage: 'The SlideWiki project has received funding from the European Union\\u0027s Horizon 2020 research and innovation programme under grant agreement No 688095'
            },
            copyright: {
                id: 'footer.copyright',
                defaultMessage: 'Copyright \\u00A9 2018 All Rights Reserved'
            },
        });

        let rowClasses = {paddingTop: '0px', paddingBottom: '0px'};
        return (
            <footer className='footer-container' role="contentinfo">
                <div className='ui container'>
                    <div className='ui two column stackable grid'>
                        <div className='row' style={rowClasses}>
                            <div className='seven wide column'>
                                <div className='footer-left' >
                                    <h2 className="sr-only">{this.context.intl.formatMessage(messages.srHeader)}</h2>
                                    <div className='footer-menu'>
                                        <h3 className="ui medium inverted header">{this.context.intl.formatMessage(messages.header)}</h3>
                                        <ul>
                                            <li><a href='/about'>{this.context.intl.formatMessage(messages.aboutus)}</a></li>
                                            <li><a href='/contactus'>{this.context.intl.formatMessage(messages.contact)}</a></li>
                                            <li><a href='/help'>{this.context.intl.formatMessage(messages.guides)}</a></li>
                                            <li><a href='/accessibility'>{this.context.intl.formatMessage(messages.accessibility)}</a></li>
                                            <li><a href='https://github.com/slidewiki'>Github</a></li>
                                        </ul>
                                    </div>
                                    <div className='footer-menu'>
                                        <h3 className="ui medium inverted header">{this.context.intl.formatMessage(messages.termsHeader)}</h3>
                                        <ul>
                                            <li><NavLink routeName='terms' href='/terms'>{this.context.intl.formatMessage(messages.terms)}</NavLink></li>
                                            <li><NavLink routeName='license' href='/license'>{this.context.intl.formatMessage(messages.license)}</NavLink></li>
                                            <li><NavLink routeName='imprint' href='/imprint'>{this.context.intl.formatMessage(messages.imprint)}</NavLink></li>
                                            <li><a href='https://www.tib.eu/en/service/data-protection/'>{this.context.intl.formatMessage(messages.data)}</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className='nine wide column'>
                                <div className='footer-menu'>
                                    <div className='footer-right'>
                                    <h3 className="ui medium inverted header">{this.context.intl.formatMessage(messages.funding)}</h3>
                                    <p>{this.context.intl.formatMessage(messages.fundingtext)}</p>
                                    <p>{this.context.intl.formatMessage(messages.copyright)}<br/> Build GIT_COMMIT&#64;GIT_BRANCH</p>
                                   {/*
                                    <div className='social-link'>
                                        <ul>
                                            <li><span>Follow us</span></li>
                                            <li><button className='ui circular facebook icon button' onClick={this.openFacebook}><i className='facebook f icon'/></button></li>
                                            <li><button className='ui circular linkedin icon button' onClick={this.openLinkedIn}><i className='linkedin icon'/></button> </li>
                                            <li><button className='ui circular twitter icon button' onClick={this.openTwitter}><i className='twitter icon'/></button></li>
                                        </ul>
                                    </div>
                                     <ul className="text inverted">
                                            <li>If you would like to provide feedback or report issues, please use our <a href='/contactus'>Contact Form</a>.</li>
                                        </ul>*/}
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

Footer.contextTypes = {
    intl: PropTypes.object.isRequired
};

export default Footer;
