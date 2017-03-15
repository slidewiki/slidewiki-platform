import React from 'react';
import DeckList from './DeckList';
import {NavLink} from 'fluxible-router';
import { FormattedMessage } from 'react-intl';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';

class Home extends React.Component {
    render() {
        const heightStyle = {
            height: '100px'
        };

        const message_welcome_12 = 'As the new SlideWiki platform is still under development, we will be regularly adding new featurses. If you are interested in finding out more about the SlideWiki project follow us on {link_1} or visit the {link_2}.';


        return (

        <div ref="home">
            <div className="ui message">
                <div className="ui container two column grid">
                    <div className="six wide column">
                        <div className="item">
                            <div className="middle aligned content">
                                <h2 className="ui center aligned grey header">
                                    <FormattedMessage id='home.slogan' defaultMessage='SlideWiki revolutionises how educational material is authored, shared and used.'/>
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="ten wide column">

                        <div className="ui top right attached large blue label"><FormattedMessage id='home.beta' defaultMessage='beta'/></div>
                        <img className="ui centered image" src="/assets/images/logo_full.png" alt="SlideWiki beta logo" />
                    </div>
                </div>
            </div>

            <div className="ui hidden divider"></div>
            <div className="ui container stackable two columm grid">
                <div className="six wide column">
                    <h2 className="ui header"><FormattedMessage id='home.welcome' defaultMessage='Welcome to SlideWiki'/></h2>
                    <p><FormattedMessage id='home.welcome1' defaultMessage='Create, edit and share slide decks and other open educational materials. The latest version of SlideWiki includes:'/></p>
                    <div className="ui bulleted list">
                        <div className="item"><FormattedMessage id='home.welcome2' defaultMessage='upload and edit existing PowerPoint or create new decks'/></div>
                        <div className="item"><FormattedMessage id='home.welcome3' defaultMessage='version control for slide edits and decks'/></div>
                        <div className="item"><FormattedMessage id='home.welcome4' defaultMessage='add comments to slides and decks'/></div>
                    </div>
                    <p><FormattedMessage id='home.welcome5' defaultMessage='Many people in the world lack access to educational material.
                        Help us to create great educational material covering as many domains and as many languages as possible:'/></p>
                    <div className="ui bulleted list">
                        <div className="item"><FormattedMessage id='home.welcome6' defaultMessage='Sign in SlideWiki'/></div>
                        <div className="item"><FormattedMessage id='home.welcome7' defaultMessage='Search for decks at SlideWiki, whose domain you know'/></div>
                        <div className="item"><FormattedMessage id='home.welcome8' defaultMessage='Review the content of decks and help improving them'/></div>
                        <div className="item"><FormattedMessage id='home.welcome9' defaultMessage='Add self-assessment questions to the slides (in development)'/></div>
                        <div className="item"><FormattedMessage id='home.welcome10' defaultMessage='Translate decks covering topics you know well into your mother tongue (in development)'/></div>
                        <div className="item"><FormattedMessage id='home.welcome11' defaultMessage='Look for existing presentations and e-learning material, which could be imported into SlideWiki'/></div>
                    </div>
                    <p><FormattedMessage
                        id='home.welcome12'
                        values={{
                            link_1: <a target="_blank" href="https://twitter.com/SlideWiki">Twitter</a>,
                            link_2: <a href="https://slidewiki.eu">SlideWiki project website</a>
                        }}
                        defaultMessage={message_welcome_12}/></p>
                    <p><FormattedMessage id='home.welcome13' defaultMessage='This project has received funding from the EU Framework Programme for Research and Innovation Horizon 2020 under grant agreement no 688095.'/></p>
                </div>

                <div className="column ten wide">
                    <h2 className="ui header"><FormattedMessage id='home.featured' defaultMessage='Featured decks'/></h2>
                    <div>
                        <DeckList scope="featured"/>
                    </div>
                    <div className="ui hidden divider"></div>
                    <div>
                    <h2 className="ui header"><FormattedMessage id='home.recent' defaultMessage='Recent decks'/></h2>
                        <DeckList scope="recent"/>
                            <a className="ui right floated button" href='/recent'><FormattedMessage id='home.view_all' defaultMessage='View all'/></a>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}


export default Home;
