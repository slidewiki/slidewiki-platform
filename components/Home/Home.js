import React, {PropTypes} from 'react';
import DeckList from './DeckList';
import Carousel from './Carousel';
import { NavLink } from 'fluxible-router';
import { FormattedMessage, defineMessages} from 'react-intl';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';

class Home extends React.Component {
    render() {
        const heightStyle = {
            height: '100px'
        };

        const messages = defineMessages({

        });
        const compMessageStyle = {
            background: '#1E78BB'
        };
        return (
            <div ref="home">
                <div className="ui blue inverted segment" style={{borderRadius: '0px'}}>
                    <h1><FormattedMessage id='home.slogan' defaultMessage='SlideWiki...Create, Share and Enjoy Presentations'/></h1>
                    <Carousel />

                </div>
                <div className="ui fluid container">
                    <div className="ui padded stackable grid ">
                        <div className="one wide column"></div>
                        <div className="ten wide column">
                            <div className="ui segments">
                                <div className="ui segment top attached">
                                    <h3><FormattedMessage id='home.welcome' defaultMessage='Welcome to SlideWiki'/>
                                    </h3>
                                </div>
                                <div className="ui segment">
                                <center>
                                <div className="ui padded stackable grid ">
                                <div className="five wide column">
                                    <div className="ui attached message">
                                        <h2 className="header"><FormattedMessage id='home.1' defaultMessage='1. Create a deck'/></h2>
                                    </div>
                                    <div className="ui attached fluid segment">
                                        <p><FormattedMessage id='home.create' defaultMessage='Start creating your own slide deck by selecting the Add deck button.'/>
                                        </p>
                                        <NavLink className="header" routeName="addDeck" href="/addDeck">
                                            <div className="ui message" style={compMessageStyle}>
                                                <button className="ui right labeled lightGrey icon button">
                                                    <i className="right plus icon"></i><FormattedMessage id='home.add_button' defaultMessage='Add deck'/>
                                                </button>

                                            </div>
                                        </NavLink>
                                        <p><FormattedMessage id='home.create_desc1' defaultMessage='Create a new deck or import existing slides from PowerPoint (*.pptx) or OpenDocument Presentation (*.odp) files. Your imported slides will be converted into HTML slides to allow you to continue to edit and add new slides.'/>
                                        </p>
                                        <p><FormattedMessage id='home.create_desc2' defaultMessage='Need more inspiration to make your own slides? Why not search or browse throughexisting SlideWiki decks.'/></p>
                                    </div>
                                </div>
                                <div className="six wide column">
                                    <div className="ui attached message">
                                        <h2 className="header"><FormattedMessage id='home.2' defaultMessage='2. Reuse, Repurpose and Collaborate'/></h2>
                                    </div>
                                    <div className="ui attached fluid segment">
                                        <p><FormattedMessage id='home.reuse' defaultMessage='Want to enhance your decks? SlideWiki allows you to create your own slides based on decks that have been published on SlideWiki.'/>
                                        </p>
                                        <div className="ui relaxed list">
                                            <div className="item">
                                                <i className="large fork blue middle aligned icon"></i>
                                                <div className="content">
                                                    <div className="header"><FormattedMessage id='home.reuse_step1' defaultMessage='Create a copy of a deck'/></div>
                                                    <div className="description"><FormattedMessage id='home.reuse_step1_desc' defaultMessage='Use the Fork function to create your own copy of an existing deck.'/></div>
                                                </div>
                                            </div>
                                            <div className="item">
                                                <i className="large attach blue middle aligned icon " ></i>
                                                <div className="content">
                                                    <div className="header"><FormattedMessage id='home.reuse_step2' defaultMessage='Append slides and decks to your deck'/></div>
                                                    <div className="description"><FormattedMessage id='home.reuse_step2_desc' defaultMessage='Add slides from other decks using the Append function. Or Append a  deck to embed a set of slides as a sub-deck.'/></div>
                                                </div>
                                            </div>
                                            <div className="item">
                                                <i className="large blue users middle aligned icon"></i>
                                                <div className="content">
                                                    <div className="header"><FormattedMessage id='home.reuse_step3' defaultMessage='Collaborate to improve your deck'/></div>
                                                    <div className="description"><FormattedMessage id='home.reuse_step3_desc' defaultMessage='Use Groups to allow colleagues, peers and associates to collaborate with editing and enhancing your deck.'/></div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="five wide column">
                                    <div className="ui attached message">
                                        <h2 className="header"><FormattedMessage id='home.3' defaultMessage='3. Present, Share and Communicate'/></h2>
                                    </div>
                                    <div className="ui attached fluid segment">
                                        <p><FormattedMessage id='home.3.desc' defaultMessage='There are many ways that you and your students can engage and interact with slides and decks.'/>
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
                                                <FormattedMessage
                                                    id='home.3.step_1'
                                                    values={{
                                                        strong: <strong><FormattedMessage
                                                                            id='home.3.strong1'
                                                                            defaultMessage='Presentation mode'/></strong>
                                                    }}
                                                    defaultMessage="Use the {strong} to view a deck as a slideshow. Includes a timer and speaker notes' view."/>
                                                </div>
                                            </div>
                                            <div className="item">
                                                <div className="content">
                                                <FormattedMessage
                                                    id='home.3.step_2'
                                                    values={{
                                                        strong: <strong><FormattedMessage
                                                                            id='home.3.strong2'
                                                                            defaultMessage='Share decks'/></strong>
                                                    }}
                                                    defaultMessage="{strong} via social media or email."/>
                                                </div>
                                            </div>
                                            <div className="item">
                                                <div className="content">
                                                <FormattedMessage
                                                    id='home.3.step_3'
                                                    values={{
                                                        strong: <strong><FormattedMessage
                                                                            id='home.3.strong3'
                                                                            defaultMessage='Comments'/></strong>
                                                    }}
                                                    defaultMessage="Add {strong} to decks and slides  to interact with other learners."/>
                                                </div>
                                            </div>
                                            <div className="item">
                                                <div className="content">
                                                <FormattedMessage
                                                    id='home.3.step_4'
                                                    values={{
                                                        strong: <strong><FormattedMessage
                                                                            id='home.3.strong4'
                                                                            defaultMessage='Download'/></strong>
                                                    }}
                                                    defaultMessage="{strong} decks in PDF, ePub or SCORM format."/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                </center>
                                </div>
                            </div>
                        </div>
                        <div className="four wide column">

                            <div className="ui segments">
                                <div className="ui segment top attached">
                                    <h3><FormattedMessage id='home.start' defaultMessage='Get Started'/></h3>
                                </div>
                                <div className="ui segment">
                                    <div className="ui relaxed list">
                                        <div className="item">
                                            <div className="content">
                                                <NavLink className="header" routeName="license" href="/signup">
                                                <FormattedMessage id='home.signup' defaultMessage='Sign up for a SlideWiki account'/></NavLink>
                                                <div className="description">
                                                    <p><FormattedMessage id='home.signup_desc' defaultMessage='Create an account to start creating and sharing your decks'/></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="content">
                                                <NavLink className="header" href="/features"><FormattedMessage id='home.learn' defaultMessage='Learn about SlideWiki'/></NavLink>
                                                <div className="description">
                                                    <p><FormattedMessage id='home.learn_desc' defaultMessage="Find out more about SlideWiki's features and how it can be used to create, share and adapt slides, decks and open educational resources."/></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="content">
                                                <a className="header" href="https://slidewiki.eu">
                                                <FormattedMessage id='home.findout' defaultMessage='Find out about the SlideWiki project'/></a>
                                                <div className="description">
                                                    <p><FormattedMessage
                                                        id='home.findout_desc'
                                                        values={{
                                                            link: <a href="https://slidewiki.eu"><FormattedMessage id='home.linlk_project' defaultMessage='project webiste'/></a>
                                                        }}
                                                        defaultMessage="SlideWiki is an open source development project, funded from the European Union's Horizon 2020 research and innovation programme. The project involves 17 partners to develop, test and trial SlideWiki. To find out more or get involved visit the {link}."/></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ui segments">
                                <div className="ui segment top attached">
                                    <h3><FormattedMessage id='home.featured' defaultMessage='Featured decks'/></h3>
                                </div>
                                <DeckList scope="featured"/>
                            </div>
                        </div>


                        <div className="one wide column"></div>
                    </div>
                </div>

            </div>
        );
    }
}

Home.contextTypes = {
    intl: React.PropTypes.object.isRequired,
    getUser: React.PropTypes.func
};


export default Home;



//export default Home;
