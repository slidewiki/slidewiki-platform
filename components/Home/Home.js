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
            <div className="ui blue inverted segment">
                <h2>SlideWiki...Create, Share and Enjoy Presentations</h2>
                <Carousel />
            </div>
            <div className="ui fluid container stackable three columm grid">
              <div className="six wide column">
                <div className="six wide column">
                  <div className="ui segments">
                    <div className="ui segment top attached">
                      <h3>Getting Involved</h3>
                    </div>
                    <div className="ui segment">
                      <div className="ui divide list">
                          <div className="item">
                            <div className="content">
                              <a className="header" href="">Sign up to get started</a>
                              <div className="description">
                                <p>Create an account to start creating and sharing your decks</p>
                              </div>
                            </div>
                          </div>
                          <div className="item">
                            <div className="content">
                              <a className="header" href="">SlideWiki foundation</a>
                              <div className="description">
                                <p>Find out more about SlideWiki</p>
                              </div>
                            </div>
                          </div>
                          <div className="item">
                            <div className="content">
                              <a className="header" href="">Contribute to SlideWiki's development</a>
                              <div className="description">
                                <p>Get involved with supporting and improving SlideWiki</p>
                              </div>
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
                    <h3><FormattedMessage id='home.recent' defaultMessage='Recent decks'/></h3>
                  </div>
                  <DeckList scope="recent"/>
                  <a className="ui bottom attached fuild button" href='/recent'><FormattedMessage id='home.view_all' defaultMessage='View all'/></a>

                </div>
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
