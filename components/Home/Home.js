import React from 'react';
import DeckList from './DeckList';
import {NavLink} from 'fluxible-router';
class Home extends React.Component {
    render() {
        const heightStyle = {
            height: '100px'
        };

        return (

        <div ref="home">
            <div className="ui message">
                <div className="ui container two column grid">
                    <div className="six wide column">
                        <div className="item">
                            <div className="middle aligned content">
                        <h2 className="ui center aligned grey header">SlideWiki revolutionises how educational material is authored, shared and used.</h2>
                        </div>
                    </div>
                    </div>
                    <div className="ten wide column">
                        <div className="ui top right attached large blue label">beta</div>
                        <img className="ui centered image" src="/assets/images/logo_full.png" />
                    </div>
                </div>
            </div>

            <div className="ui hidden divider"></div>
            <div className="ui container stackable two columm grid">
                <div className="six wide column">
                    <h2 className="ui header">Welcome to SlideWiki</h2>
                    <p>Create, edit and share slide decks and other open educational materials. The latest version of SlideWiki includes:</p>
                    <div className="ui bulleted list">
                        <div className="item">upload and edit existing PowerPoint or create new decks</div>
                        <div className="item">version control for slide edits and decks </div>
                        <div className="item">add comments to slides and decks</div>
                    </div>
                    <p>Many people in the world lack access to educational material.
                        Help us to create great educational material covering as many domains and as many languages as possible:</p>
                    <div className="ui bulleted list">
                        <div className="item">Sign in SlideWiki</div>
                        <div className="item">Search for decks at SlideWiki, whose domain you know</div>
                        <div className="item">Review the content of decks and help improving them</div>
                        <div className="item">Add self-assessment questions to the slides (in development)</div>
                        <div className="item">Translate decks covering topics you know well into your mother tongue (in development)</div>
                        <div className="item">Look for existing presentations and e-learning material, which could be imported into SlideWiki</div>
                    </div>
                    <p>As the new SlideWiki platform is still under development, we will be regularly adding new featurses. If you are interested in finding out more about the SlideWiki project follow us on <a target="_blank" href="https://twitter.com/SlideWiki">Twitter</a> or visit the <a href="https://slidewiki.eu">SlideWiki project website</a>.</p>
                    <p>This project has received funding from the EU Framework Programme for Research and Innovation Horizon 2020 under grant agreement no 688095.</p>
                </div>

                <div className="column ten wide">
                    <h2 className="ui header">Featured decks</h2>
                    <div>
                        <DeckList scope="featured"/>
                    </div>
                    <div className="ui hidden divider"></div>
                    <div>
                    <h2 className="ui header">Recent decks</h2>
                        <DeckList scope="recent"/>
                        <button className="ui right floated button">

                            <NavLink href={'/recent'}>View All</NavLink>
                        </button>
                        {/*<div className="ui divided list animated ">
                             <a className="item" href="/deck/8">Try Sample Deck Imported from SlideWiki.org &raquo;</a>
                             <a className="item" href="/deck/5">Deck created from scratch &raquo;</a>
                             <a className="item" href="/deck/372">TODO:See documentation deck&raquo;</a>
                         </div> */}
                    </div>
                </div>
            </div>
        </div>
        );
    }
}


export default Home;
