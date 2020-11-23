import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import PropTypes from 'prop-types';
import setDocumentTitle from '../../actions/setDocumentTitle';

class welcome extends React.Component {
    componentDidMount() {
        this.context.executeAction(setDocumentTitle, { 
            title: this.context.intl.formatMessage({
                id: 'welcome.title',
                defaultMessage: 'Welcome'
            })
        });
    }

    render() {
        const compMessageStyle = {
            background: '#1E78BB'
        };
        return (
            <div className="ui fluid container" ref="welcome">
                    <br/>
                    <h1 className="ui centered header" id="main"><FormattedMessage id="welcome.header" defaultMessage="Welcome to SlideWiki"/></h1>
                    <div className="ui centered container">
                        <FormattedMessage id="welcome.div1"
                            defaultMessage="Thank you for signing up to SlideWiki. Now your account has been created, you can get started with creating, enhancing and sharing open educational resources."/>
                    </div>
                    <div className="ui padded stackable centered grid ">
                        <div className="one wide column"></div>
                        <div className="four wide column">
                            <div className="ui attached message">
                                <h2 className="header"><FormattedMessage id="welcome.1.header" defaultMessage="1. Create a deck"/></h2>
                            </div>
                            <div className="ui attached fluid segment">
                                <p><FormattedMessage id="welcome.1.p1" defaultMessage="Start creating your own slide deck by selecting the Add deck button."/>
                                </p>
                                <div className="ui message" style={compMessageStyle}>
                                    <button className="ui right labeled lightGrey icon button">
                                        <i className="right plus icon"></i>
                                        <FormattedMessage id="welcome.1.addDeckButton" defaultMessage="Add deck"/>
                                    </button>
                                </div>
                                <p>
                                    <FormattedMessage id="welcome.1.p2"
                                        defaultMessage="Create a new deck or import existing slides from PowerPoint (*.pptx) or OpenDocument Presentation (*.odp) files. Your imported slides will be converted into HTML slides to allow you to continue to edit and add new slides."/>
                                </p>
                                <p><FormattedMessage id="welcome.1.p3" defaultMessage="Need more inspiration to make your own slides? Why not search or browse throughexisting SlideWiki decks."/></p>
                            </div>
                        </div>
                        <div className="four wide column">
                            <div className="ui attached message">
                                <h2 className="header"><FormattedMessage id="welcome.2.header" defaultMessage="2. Reuse, Repurpose and Collaborate"/></h2>
                            </div>
                            <div className="ui attached fluid segment">
                                <p>
                                    <FormattedMessage id="welcome.2.p1" defaultMessage="Want to enhance your decks? SlideWiki allows you to create your own slides based on decks that have been published on SlideWiki."/>
                                </p>
                                <div className="ui relaxed list">
                                    <div className="item">
                                        <i className="large fork blue middle aligned icon"></i>
                                        <div className="content">
                                            <div className="header"><FormattedMessage id="welcome.2.createCopy.header" defaultMessage="Create a copy of a deck"/></div>
                                            <div className="description"><FormattedMessage id="welcome.2.createCopy.description" defaultMessage="Use the Fork function to create your own copy of an existing deck."/></div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <i className="large attach blue middle aligned icon " ></i>
                                        <div className="content">
                                            <div className="header"><FormattedMessage id="welcome.2.appendSlides.header" defaultMessage="Append slides and decks to your deck"/></div>
                                            <div className="description"><FormattedMessage id="welcome.2.appendSlides.description" defaultMessage="Add slides from other decks using the Append function. Or Append a  deck to embed a set of slides as a sub-deck."/></div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <i className="large blue users middle aligned icon"></i>
                                        <div className="content">
                                            <div className="header"><FormattedMessage id="welcome.2.collaborate.header" defaultMessage="Collaborate to improve your deck"/></div>
                                            <div className="description"><FormattedMessage id="welcome.2.collaborate.description" defaultMessage="Use Groups to allow colleagues, peers and associates to collaborate with editing and enhancing your deck."/></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="four wide column">
                            <div className="ui attached message">
                                <h2 className="header"><FormattedMessage id="welcome.3.header" defaultMessage="3. Present, Share and Communicate"/></h2>
                            </div>
                            <div className="ui attached fluid segment">
                                <p><FormattedMessage id="welcome.3.p1" defaultMessage="There are many ways that you and your students can engage and interact with slides and decks."/>
                                </p>
                                <div className="ui horizontal attached fluid segments">
                                    <div className="ui center aligned segment">
                                        <i className="large circle play center aligned icon"></i>
                                    </div>
                                    <div className="ui center aligned segment">
                                        <i className="large share alternate icon"></i>
                                    </div>
                                    <div className="ui center aligned segment">
                                        <i className="large comment outline icon"></i>
                                    </div>
                                    <div className="ui center aligned segment">
                                        <i className="large download icon"></i>
                                    </div>
                                </div>
                                <div className="ui list">
                                    <div className="item">
                                        <div className="content">
                                            <FormattedMessage id="welcome.3.slideshowMode"
                                                values={{
                                                    strong: <strong><FormattedMessage id="welcome.3.slideshowMode.strong" defaultMessage="Slideshow mode"/></strong>
                                                }}
                                                defaultMessage="Use the {strong} to view a deck as a slideshow. Includes a timer and speaker notes&apo; view."
                                            />
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="content">
                                            <FormattedMessage id="welcome.3.shareDecks"
                                                values={{
                                                    strong: <strong><FormattedMessage id="welcome.shareDecks.strong" defaultMessage="Share decks"/></strong>
                                                }}
                                                defaultMessage="{strong} via social media or email."
                                            />
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="content">
                                            <FormattedMessage id="welcome.3.comments"
                                                values={{
                                                    strong: <strong><FormattedMessage id="welcome.3.comments.strong" defaultMessage="Comments"/></strong>
                                                }}
                                                defaultMessage="Add {strong} to decks and slides to interact with other learners."
                                            />
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="content">
                                            <FormattedMessage id="welcome.3.download"
                                                values={{
                                                    strong: <strong><FormattedMessage id="welcome.3.download.strong" defaultMessage="Download"/></strong>
                                                }}
                                                defaultMessage="{download} decks in PDF, ePub or SCORM format."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>

        );
    }
}

welcome.contextTypes = {
    intl: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired
};

export default welcome;
