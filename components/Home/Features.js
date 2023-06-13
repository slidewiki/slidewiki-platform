import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'fluxible-router';
import {FormattedMessage, defineMessages} from 'react-intl';
import setDocumentTitle from '../../actions/setDocumentTitle';

class features extends React.Component {
    componentDidMount() {
        this.context.executeAction(setDocumentTitle, { 
            title: this.context.intl.formatMessage({
                id: 'features.title',
                defaultMessage: 'Discover More'
            })
        });
    }


    render() {
        return (
            <div className="ui container" ref="features">
                <div className="ui hidden divider"></div>
                <h1 className="ui header" id="main"><FormattedMessage id="features.header" defaultMessage="Discover SlideWiki"/></h1>
                <div className="basic container">
                    <p>
                        <FormattedMessage id="features.p1"
                            defaultMessage="The goal of SlideWiki is to revolutionise how educational materials can be authored, shared and reused. By enabling authors and students to create and share slide decks as HTML in an open platform, communities around the world can benefit from materials created by world-leading educators on a wide range of topics."/>
                    </p>
                </div>
                <div className="ui padded stackable grid">
                    <div className="eight wide column">
                        <div className="ui attached message">
                            <h2 className="header"><FormattedMessage id="features.1.header" defaultMessage="Create online slide decks"/></h2>
                        </div>
                        <div className="ui attached fluid segment">
                            <div className="ui medium right floated image">
                                <FormattedMessage id="features.screenshot" defaultMessage="screenshot of slide editor interface.">
                                    {
                                        (alt) => <img alt={alt} src="assets/images/features/slide-edit.png"></img>
                                    }
                                </FormattedMessage>
                            </div>
                            <p>
                                <FormattedMessage id="features.1.p1"
                                    defaultMessage="Create a new deck or import existing slides from PowerPoint (*.pptx) or OpenDocument Presentation (*.odp) files. Your imported slides will be converted into HTML to allow you to continue to edit and add new content."/>
                            </p>
                            <p>
                                <FormattedMessage id="features.1.p2"
                                    defaultMessage="The SlideWiki editor offers many formatting tools, including being able to add images, videos, equations and code snippet."/>
                            </p>
                        </div>
                    </div>
                    <div className="eight wide column">
                        <div className="ui attached message">
                            <h2 className="header"><FormattedMessage id="features.2.header" defaultMessage="Reusable educational content"/></h2>
                        </div>
                        <div className="ui attached fluid segment">
                            <p>
                                <FormattedMessage id="features.2.p1"
                                  values={{
                                      navLink: <NavLink href="/licence"><FormattedMessage id="features.2.p1.licence" defaultMessage="Creative Commons licences"/></NavLink>
                                  }}
                                  defaultMessage="SlideWiki is built on the Open Educational Resources (OER) ethos and all content is published under {navLink}. This means you can reuse and repurpose content from SlideWiki decks. SlideWiki allows you to create your own slides based on decks that have been published on SlideWiki by:"
                                />
                            </p>
                            <div className="ui relaxed list">
                                <div className="item">
                                    <i className="large fork blue middle aligned icon"></i>
                                    <div className="content">
                                        <div className="header"><FormattedMessage id="features.2.deckCopy.header" defaultMessage="Creating a copy of a deck"/></div>
                                        <div className="description"><FormattedMessage id="features.2.deckCopy.description" defaultMessage="Use the Fork feature to create your own copy of an existing deck."/></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="large attach blue middle aligned icon " ></i>
                                    <div className="content">
                                        <div className="header"><FormattedMessage id="features.2.appending.header" defaultMessage="Appending slides and decks to your deck"/></div>
                                        <div className="description"><FormattedMessage id="features.2.appending.description" defaultMessage="Add slides from other decks using the Append feature. Or Append a deck to embed a set of slides as a sub-deck."/></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="large blue translate middle aligned icon"></i>
                                    <div className="content">
                                        <div className="header"><FormattedMessage id="features.2.translating.header" defaultMessage="Translating a deck (coming soon)"/></div>
                                        <div className="description"><FormattedMessage id="features.2.translating.description" defaultMessage="Localise slides and decks by translating it into another language."/></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="eight wide column">
                        <div className="ui attached message">
                            <h2 className="header"><FormattedMessage id="features.3.header" defaultMessage="Collaborative content authoring"/></h2>
                        </div>
                        <div className="ui attached fluid segment">
                            <p>
                                <FormattedMessage id="features.3.p1"
                                    defaultMessage="SlideWiki allows authors and students to collaborate. Through managing editing rights, you can enable colleagues to edit and add to your decks.Comments and Questions (coming soon) allow students and readers to interact with your decks."/>
                            </p>
                            <div className="ui relaxed list">
                                <div className="item">
                                    <i className="large blue users middle aligned icon"></i>
                                    <div className="content">
                                        <div className="header"><FormattedMessage id="features.3.collaborate.header" defaultMessage="Collaborate to improve your decks"/></div>
                                        <div className="description"><FormattedMessage id="features.3.collaborate.description" defaultMessage="Use Groups to allow colleagues, peers and associates to collaborate with editing and enhancing your deck."/></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="large exchange blue middle aligned icon"></i>
                                    <div className="content">
                                        <div className="header"><FormattedMessage id="features.3.review.header" defaultMessage="Review and revert changes within slides and decks"/></div>
                                        <div className="description"><FormattedMessage id="features.3.review.description" defaultMessage="A sophisticated revisioning model enables you and your co-editors to review and revert changes to slides and decks."/></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="large thumbs up blue middle aligned icon " ></i>
                                    <div className="content">
                                        <div className="header"><FormattedMessage id="features.3.like.header" defaultMessage="Like decks and slides"/></div>
                                        <div className="description"><FormattedMessage id="features.3.like.description" defaultMessage="Encourage authors and students to see new content by liking useful decks and slides."/></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="large circle blue play middle aligned icon"></i>
                                    <div className="content">
                                        <div className="header"><FormattedMessage id="features.3.slideshow.header" defaultMessage="Slideshow mode"/></div>
                                        <div className="description"><FormattedMessage id="features.3.slideshow.description" defaultMessage="Use the Slideshow mode to view a deck as a slideshow. Includes a timer and speaker notes view."/></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="eight wide column">
                        <div className="ui attached message">
                            <h2 className="header"><FormattedMessage id="features.4.header" defaultMessage="Supporting Knowledge Communities"/></h2>
                        </div>
                        <div className="ui attached fluid segment">
                            <p>
                                <FormattedMessage id="features.4.description"
                                  defaultMessage="Through a range of interactive and open tools, SlideWiki aims to nurture knowledge communities around the world. Our goal is to significantly increase content available to a world-wide audience. By involve peer-educators in improving and maintaining the quality and attractiveness of your e-learning content SlideWiki can give you a platform to support knowledge communities. With SlideWiki we aim to dramatically improve the efficiency and effectiveness of the collaborative creation of rich learning material for online and offline use."/>
                            </p>
                            <div className="ui horizontal attached fluid segments">
                                <div className="ui center aligned segment">
                                    <i className="large blue share alternate icon"></i>
                                </div>
                                <div className="ui center aligned segment">
                                    <i className="large blue comment outline icon"></i>
                                </div>
                                <div className="ui center aligned segment">
                                    <i className="large blue download icon"></i>
                                </div>
                            </div>
                            <div className="ui list">

                                <div className="item">
                                    <div className="content">
                                        <FormattedMessage id="features.4.shareDecks"
                                            values={{
                                                strong: <strong><FormattedMessage id="features.4.shareDescks.strong" defaultMessage="Share decks"/></strong>
                                            }}
                                            defaultMessage="{strong} via social media or email."
                                        />
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="content">
                                        <FormattedMessage id="features.4.comments"
                                            values={{
                                                strong: <strong><FormattedMessage id="features.4.comments.strong" defaultMessage="Comments"/></strong>
                                            }}
                                            defaultMessage="Add {strong} to decks and slides to interact with other learners."/>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="content">
                                        <FormattedMessage id="features.4.download"
                                            values={{
                                                strong: <strong><FormattedMessage id="features.4.download.strong" defaultMessage="Download"/></strong>
                                            }}
                                            defaultMessage="{strong} decks in PDF, ePub or SCORM format."/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui message">
                    <FormattedMessage id="features.4.findMore"
                        values={{
                            link: <a href="https://stable.slidewiki.org/deck/10467" target="_blank"><FormattedMessage id="features.4.findMore.link" defaultMessage="help file deck"/></a>
                        }}
                        defaultMessage="To find out more about how to use SlideWiki and its many features, view our {link}."
                    />
                </div>
            </div>
        );
    }
}

features.contextTypes = {
    intl: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired
};

export default features;
