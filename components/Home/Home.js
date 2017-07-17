import React, {PropTypes} from 'react';
import DeckList from './DeckList';
import Carousel from './Carousel';
import {NavLink} from 'fluxible-router';
import { FormattedMessage, defineMessages} from 'react-intl';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';

class Home extends React.Component {
    render() {
        const heightStyle = {
            height: '100px'
        };

        const messages = defineMessages({
            slogan:{
                id: 'home.slogan',
                defaultMessage: 'SlideWiki revolutionises how educational material is authored, shared and used.'
            },
            logo_alt: {
                id: 'home.logo_alt',
                defaultMessage: 'SlideWiki beta logo',
            }
        });
        return (
            <div ref="home">
                <div className="ui blue inverted segment" style={{borderRadius: '0px'}}>
                    <h1>SlideWiki...Create, Share and Enjoy Presentations</h1>
                    <Carousel />

                </div>
                <div className="ui fluid container">
                    <div className="ui padded stackable grid ">
                        <div className="one wide column"></div>
                        <div className="four wide column">

                            <div className="ui segments">
                                <div className="ui segment top attached">
                                    <h3>Get Started</h3>
                                </div>
                                <div className="ui segment">
                                    <div className="ui relaxed list">
                                        <div className="item">
                                            <div className="content">
                                                <NavLink className="header" routeName="license" href="/signup">Sign up for a SlideWiki account</NavLink>
                                                <div className="description">
                                                    <p>Create an account to start creating and sharing your decks</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="content">
                                                <a className="header" href="/features">Learn about  SlideWiki</a>
                                                <div className="description">
                                                    <p>Find out more about SlideWiki's features and how it can be used to create, share and adapt slides, decks and open educational resources.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="content">
                                                <a className="header" href="https://slidewiki.eu">Find out about the SlideWiki project</a>
                                                <div className="description">
                                                    <p>SlideWiki is an open source development project, funded from the European Union's Horizon 2020 research and innovation programme. The project involves 17 partners to develop, test and trial SlideWiki. To find out more or get involved visit the <a href="https://slidewiki.eu">project webiste</a>.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="five wide column">
                            <div className="ui segments">
                                <div className="ui segment top attached">
                                    <h3><FormattedMessage id='home.featured' defaultMessage='Featured decks'/></h3>
                                </div>
                                <DeckList scope="featured"/>
                            </div>
                        </div>
                        <div className="five wide column">
                            <div className="ui segments">
                                <div className="ui segment top attached">
                                    <h3><FormattedMessage id='home.recent' defaultMessage='Recent decks'/>
                                    </h3>
                                </div>
                                <DeckList scope="recent"/>
                                <a className="ui bottom attached fuild button" href='/recent'><FormattedMessage id='home.view_all' defaultMessage='View all'/>
                                </a>
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
