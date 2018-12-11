import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import StaticPage from './StaticPage';

class Accessibility extends React.Component {
    render() {
        return (
            <StaticPage>
                <div className="ui container" ref="accessibility">
                    <h1 className="ui header" id="main"><FormattedMessage id="accessibility.header" defaultMessage="Accessibility Statement "/></h1>
                    <p><FormattedMessage id="accessibility.p1" defaultMessage="SlideWiki aims to make its website as accessible and usable as possible."/></p>
                    <h2 className="ui header"><FormattedMessage id="accessibility.1.header" defaultMessage="What does this mean?"/></h2>
                    <p><FormattedMessage id="accessibility.1.p1" defaultMessage="This means that texts, images, forms and navigation should be accessible and understandable by as many people as possible. All users of the SlideWiki platform, with or without disabilities, should be offered the best possible browsing experience."/></p>
                    <p>
                        <FormattedMessage id="accessibility.1.p2"
                            values={{
                                link_1: <a href="https://www.w3.org/TR/WCAG20/" target="_blank">
                                    <FormattedMessage id="accessibility.w3c" defaultMessage="W3C Web Content Accessibility Guidelines (WCAG) 2.0"/>
                                </a>
                            }}
                            defaultMessage="To achieve this, the website has been optimised to meet the {link_1} Level AA (ISO/IEC 40500:2012) "/>
                        <FormattedMessage id="accessibility.mandate376"
                            values={{
                                link_2: <a href="http://mandate376.standards.eu/standard/technical-requirements/#9" target="_blank">
                                    <FormattedMessage id="accessibility.summary" defaultMessage="EN 301 549 V1.1.2"/>
                                </a>
                            }}
                            defaultMessage="and European standard {link_2}."/>

                    </p>
                    <p>
                        <FormattedMessage id="accessibility.1.p4" defaultMessage="Examples of items checked for accessibility include:"/>
                    </p>
                    <ul>
                        <li><FormattedMessage id="accessibility.1.l1" defaultMessage="Images and icons used on the platform to ensure they have the correct type of alternative text (alt tags), which can help screen readers users understand the content of pictures and diagrams."/></li>
                        <li><FormattedMessage id="accessibility.1.l2" defaultMessage="Keyboard only interaction has been provided for those who do not use a mouse or have alternative input/output systems such as screen reading, switch and/or braille access."/></li>
                        <li><FormattedMessage id="accessibility.1.l3" defaultMessage="Colour contrast levels and text styles have been optimised for readability."/></li>
                        <li><FormattedMessage id="accessibility.1.l4" defaultMessage="Use of ARIA landmarks to aid navigation and skip content."/></li>
                    </ul>
                    <div className="ui warning message">
                        <FormattedMessage id="accessibility.1.p5." defaultMessage="However, we cannot guarantee the accessibility of external information linked to or from SlideWiki or the content provided by users on their personal/group decks or slides.  Action has been taken to provide templates and other options to ensure it is possible to make the content added to decks and slides accessible."/>
                    </div>
                    <p>
                        <FormattedMessage id="accessibility.1.p6" defaultMessage="As we are continuously updating our website, exceptions to the above accessibility standards may sometimes inadvertently be introduced. Please let us know if you have difficulty accessing any of our content."/>
                    </p>
                    <h2 className="ui header">
                        <FormattedMessage id="accessibility.2.header" defaultMessage="Technologies used in the SlideWiki Platform"/>
                    </h2>
                    <p>
                        <FormattedMessage id="accessibility.2.p1" defaultMessage="The platform relies on the following technologies: HTML5, CSS, react-js and uses WAI-ARIA to support accessibility."/>
                    </p>
                    <p>
                        <FormattedMessage id="accessibility.2.p2" defaultMessage="It is compatible with a range of browsers: Chrome, Firefox and Edge. However compatibility with Internet Explorer 11 or earlier is limited and we recommend using an alternative browser."/>
                    </p>
                    <p>
                        <FormattedMessage id="accessibility.2.p3" defaultMessage="These browsers have been tested with the following assistive technologies: Jaws 18, NVDA 2007, VoiceOver on Mac and iOS and TalkBack on Android screen readers as well as a range of input/output devices that emulate keyboard navigation."/>
                    </p>
                    <p>
                        <FormattedMessage id="accessibility.2.p4" defaultMessage="If you have any problems with the accessibility of the platform, please "/><a href="/contactus" target="_blank"><FormattedMessage id="accessibility.contact" defaultMessage="contact us."/></a></p>
                    <p>
                        <FormattedMessage id="accessibility.date" defaultMessage="Last updated 6th February 2018"/>
                    </p>
                </div>
            </StaticPage>
        );
    }
}

export default Accessibility;
