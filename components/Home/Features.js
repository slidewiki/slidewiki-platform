import React from 'react';

class features extends React.Component {
    render() {
        return (
            <div className="ui container" ref="features">
                <div className="ui hidden divider"></div>
                <h1 className="ui header">Discover SlideWiki</h1>
                <div className=basic container>
                    <p>>SlideWiki's goal is to revolutionise how educational materials can be authored, shared and reused. By enabling authors and students to create and share slide decks as HTML in an open platform, communities around the world can benefit from materials created by world-leading educators on a wide range of topics.</p>
                </div>
                <div className="ui padded stackable grid">
                    <div className="eight wide column">
                        <div className="ui attached message">
                            <h2 className="header">Create online slide decks</h2>
                        </div>
                        <div className="ui attached fluid segment">
                            <div className="ui medium right floated image"><img src="assets/images/features/slide-edit.png" alt="screenshot of slide editor interface."></img></div>
                            <p>Create a new deck or import existing slides from PowerPoint (*.pptx) or OpenDocument Presentation (*.odp) files. Your imported slides will be converted into HTML to allow you to continue to edit and add new content.</p> 
                            <p>SlideWiki's editor offers many formatting tools, including being able to add images, videos, equations and code snippet.</p>
                        </div>
                    </div>
                    <div className="eight wide column">
                        <div className="ui attached message">
                            <h2 className="header">Reusable educational content</h2>
                        </div>
                        <div className="ui attached fluid segment">
                            <p>SlideWiki is built on the Open Educational Resources (OER) ethos and all content is published under <a href="/license">Creative Commons licenses</a>. This means you can reuse and repurpose content from SlideWiki decks. SlideWiki allows you to create your own slides based on decks that have been published on SlideWiki by:
                            </p>
                            <div className="ui relaxed list">
                                <div className="item">
                                    <i className="large fork blue middle aligned icon"></i>
                                    <div className="content">
                                        <div className="header">Creating a copy of a deck</div>
                                        <div className="description">Use the Fork feature to create your own copy of an existing deck.</div>
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="large attach blue middle aligned icon " ></i>
                                    <div className="content">
                                        <div className="header">Appending slides and decks to your deck</div>
                                        <div className="description">Add slides from other decks using the Append feature. Or Append a deck to embed a set of slides as a sub-deck.</div>
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="large blue translate middle aligned icon"></i>
                                    <div className="content">
                                        <div className="header">Translating a deck (coming soon)</div>
                                        <div className="description">Localise slides and decks by translating it into another language.  </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="eight wide column">
                        <div className="ui attached message">
                            <h2 className="header">Collaborative content authoring</h2>
                        </div>
                        <div className="ui attached fluid segment">
                            <p>SlideWiki allows authors and students to collaborate. Through managing editing rights, you can enable colleagues to edit and add to your decks. Comments and Questions (coming soon) allow students and readers to interact with your decks.
                            </p>
                            <div className="ui relaxed list">
                                <div className="item">
                                    <i className="large blue users middle aligned icon"></i>
                                    <div className="content">
                                        <div className="header">Collaborate to improve your decks</div>
                                        <div className="description">Use Groups to allow colleagues, peers and associates to collaborate with editing and enhancing your deck.</div>
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="large exchange blue middle aligned icon"></i>
                                    <div className="content">
                                        <div className="header">Review and revert changes within slides and decks</div>
                                        <div className="description">A sophisticated revisioning model enables you and your co-editors to review and revert changes to slides and decks.</div>
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="large thumbs up blue middle aligned icon " ></i>
                                    <div className="content">
                                        <div className="header">Like decks and slides</div>
                                        <div className="description">Encourage authors and students to see new content by liking useful decks and slides.</div>
                                    </div>
                                </div>
                                <div className="item">
                                    <i className="large circle blue play middle aligned icon"></i>
                                    <div className="content">
                                        <div className="header">Presentation mode </div>
                                        <div className="description">Use the Presentation mode to view a deck as a slideshow. Includes a timer and speaker notes' view.
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="eight wide column">
                        <div className="ui attached message">
                            <h2 className="header">Supporting Knowledge Communities</h2>
                        </div>
                        <div className="ui attached fluid segment">
                            <p>Through a range of interactive and open tools, SlideWiki aims to nurture knowledge communities around the world. Our goal is to significantly increase content available to a world-wide audience. By involve peer-educators in improving and maintaining the quality and attractiveness of your e-learning content SlideWiki can give you a platform to support knowledge communities. With SlideWiki we aim to dramatically improve the efficiency and effectiveness of the collaborative creation of rich learning material for online and offline use.</p>
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
                                    <div className="content"><strong>Share decks</strong> via social media or email.
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="content">Add <strong>Comments</strong> to decks and slides to interact with other learners.
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="content"><strong>Download</strong> decks in PDF, ePub or SCROM format.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui message">To find out more about how to use SlideWiki and its many features, view our <a href="https://stable.slidewiki.org/deck/10467" target="_blank">help file deck.</a></div>
            </div>
        );
    }
}

export default features;
