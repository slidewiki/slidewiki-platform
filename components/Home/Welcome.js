import React from 'react';

class welcome extends React.Component {
    render() {
        const compMessageStyle = {
            background: '#1E78BB'
        };
        return (
            <div className="ui fluid container" ref="welcome">

                <center>
                    <br/>
                    <h1 className="ui header">Welcome to SlideWiki</h1>
                    <div className="text container">Thank you for signing up to SlideWiki. Now your account has been created, you can get started with creating, enhancing and sharing open educational resources.</div>
                    <div className="ui padded stackable grid ">
                        <div className="one wide column"></div>
                        <div className="four wide column">
                            <div className="ui attached message">
                                <h2 className="header">1. Create a deck</h2>
                            </div>
                            <div className="ui attached fluid segment">
                                <p>Start creating your own slide deck by selecting the Add deck button.
                                </p>
                                <div className="ui message" style={compMessageStyle}>
                                    <button className="ui right labeled lightGrey icon button">
                                        <i className="right plus icon"></i>Add deck
                                    </button>

                                </div>
                                <p>Create a new deck or import existing slides from PowerPoint (*.pptx) or OpenDocument Presentation (*.odp) files. Your imported slides will be converted into HTML slides to allow you to continue to edit and add new slides.</p>
                                <p>Need more inspiration to make your own slides? Why not search or browse throughexisting SlideWiki decks.</p>
                            </div>
                        </div>
                        <div className="four wide column">
                            <div className="ui attached message">
                                <h2 className="header">2. Reuse, Repurpose and Collaborate</h2>
                            </div>
                            <div className="ui attached fluid segment">
                                <p>Want to enhance your decks? SlideWiki allows you to create your own slides based on decks that have been published on SlideWiki.
                                </p>
                                <div className="ui relaxed list">
                                    <div className="item">
                                        <i className="large fork blue middle aligned icon"></i>
                                        <div className="content">
                                            <div className="header">Create a copy of a deck</div>
                                            <div className="description">Use the Fork function to create your own copy of an existing deck.</div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <i className="large attach blue middle aligned icon " ></i>
                                        <div className="content">
                                            <div className="header">Append slides and decks to your deck</div>
                                            <div className="description">Add slides from other decks using the Append function. Or Append a  deck to embed a set of slides as a sub-deck.</div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <i className="large blue users middle aligned icon"></i>
                                        <div className="content">
                                            <div className="header">Collaborate to improve your deck</div>
                                            <div className="description">Use Groups to allow colleagues, peers and associates to collaborate with editing and enhancing your deck.</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="four wide column">
                            <div className="ui attached message">
                                <h2 className="header">3. Present, Share and Communicate</h2>
                            </div>
                            <div className="ui attached fluid segment">
                                <p>There are many ways that you and your students can engage and interact with slides and decks.
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
                                        <div className="content">Use the <strong>Presentation mode</strong> to view a deck as a slideshow. Includes a timer and speaker notes' view.
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="content"><strong>Share decks</strong> via social media or email.
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="content">Add <strong>Comments</strong> to decks and slides  to interact with other learners.
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="content"><strong>Download</strong> decks in PDF, ePub or SCORM format.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </center>
            </div>

        );
    }
}

export default welcome;
