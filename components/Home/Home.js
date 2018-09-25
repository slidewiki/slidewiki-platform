import PropTypes from 'prop-types';
import React from 'react';
import DeckList from './DeckList';
import Carousel from './Carousel';
import {NavLink, navigateAction} from 'fluxible-router';
import { FormattedMessage, defineMessages} from 'react-intl';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';
import {Button} from 'semantic-ui-react';

class Home extends React.Component {

    openFeatured(e){
        this.context.executeAction(navigateAction, {
            url: '/featured'
        });
    };
    render() {
        
        const bannerContainerStyle = {
            width: '100%',
            position: 'relative',
            overflow: 'hidden'
        };

        const bannerContentStyle = {
            position: 'absolute',
            zIndex: '9999',
            top: '50%',
            //-webkit-transform: 'translateY(-50%)',
            transform: 'translateY(-50%)',
            textAlign: 'center',
            width: '100%'
        };

        const resultsStyle = {

        };

        const buttonBlkStyle = {
            display: '-webkit-box',
            display: '-ms-flexbox',
            display: '-webkit-flex',
            display: 'flex',
            marginTop: '68px',
            /*-webkit-box-pack: 'center',
            -ms-flex-pack: 'center',*/
            justifyContent: 'center'
        };

        const contentContainerStyle = {

        };

        const featureBlockStyle = {

        };

        const wrapperStyle = {

        };

        const featureContentBlueBlockStyle = {

        };

        const featureContentGreenBlockStyle = {

        };

        const featureContentRedBlockStyle = {

        };

        const featureLeftStyle = {

        };

        const featureRightStyle = {

        };

        const signInOuterStyle = {

        };

        const signInBlkStyle = {

        };

        return (
            <div ref="home">
                {/*<div className="ui blue inverted segment" style={{borderRadius: '0px'}}>
                    <h1><FormattedMessage id='home.slogan' defaultMessage='SlideWiki...Create, Share and Enjoy Presentations'/></h1>
                    <Carousel />

                </div>*/}
                <section style={bannerContainerStyle}>
                    <img src='/assets/image/home/banner.jpg' alt=''/>
                    <div style={bannerContentStyle}>
                        <div className='ui container'>
                            <div className='ui column grid'>
                                <div classname='column'>
                                    <div className='ui fluid category search'>
                                        <input className='prompt' type='text' placeholder='Search for decks or people'/>
                                        <i className='search icon'/>
                                        <div style={resultsStyle}/>
                                    </div>
                                    <div className='button-blk'>
                                        <button className='ui primary button'>
                                            Sign up
                                        </button>
                                        <button className='ui secondary button'>
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section style={contentContainerStyle}>
                    <div style={featureBlockStyle}>
                        <div style={wrapperStyle}>
                            <div className='ui three column  stackable  grid'>
                                <div className='row'>
                                    <div className='column'>
                                        <div style={featureContentBlueBlockStyle}>
                                            <div style={featureLeftStyle}>
                                                <h2>Find slides</h2>
                                                <h4>Explore the decks lorem ipsum</h4>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget elit sapien. Nunc semper urna in lectus consectetur fermentum. Vestibulum eu sem pulvinar, sollicitudin ipsum eu, porttitor elit. Maecenas bibendum congue lectus, viligula finibus, sit amet aliquam n ipsum eu, porttitor elit. Maecenas bibendum congue lectus, viligula finibus, sit amet.</p>
                                            </div>
                                            <div style={featureRightStyle}><img src='assets/images/home/search.jpg' alt=''/></div>
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div style={featureContentGreenBlockStyle}>
                                            <div style={featureLeftStyle}>
                                                <h2>Create slides</h2>
                                                <h4>Learn how to create slides with SlideWiki
                                                </h4>
                                                <p>Create a new deck or import existing slides from PowerPoint (*.pptx) or OpenDocument Presentation (*.odp) files. Your imported slides will be converted into HTML slides to allow you to continue to edit and add new slides.</p>
                                            </div>
                                            <div style={featureRightStyle}><img src='/assets/images/home/add.jpg' alt=''/></div>
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div style={featureContentRedBlockStyle}>
                                            <div className={featureLeftStyle}>
                                                <h2>Sharing slides
                                                </h2>
                                                <h4>Present, Share and Communicate</h4>
                                                <p>There are many ways that you and your students can engage and interact with slides and decks. Use the Slideshow mode to view a deck as a slideshow. Includes a timer and speaker notes' view. Share decks via social media or email.</p>
                                            </div>
                                            <div style={featureRightStyle}><img src='assets/images/home/share.jpg' alt=''/></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={signInOuterStyle}>
                        <div style={wrapperStyle}>
                            <div style={signInBlkStyle}>
                                <span>Get started right away.  <a href='#'>Sign in</a></span>
                                <p>Create an account to start creating and sharing your decks. </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

Home.contextTypes = {
    intl: PropTypes.object.isRequired,
    getUser: PropTypes.func.isRequired,
    executeAction: PropTypes.func.isRequired
};


export default Home;



//export default Home;
