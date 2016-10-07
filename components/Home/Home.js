import React from 'react';
import Featured from './Featured';

class Home extends React.Component {
    render() {
        return (
            <div ref="home">
                <div className="ui grid">
                    <div className="row">
                        <div className="column padding-reset">
                            <div className="ui huge message centered grid">
                                <div className="row">
                                  <img className="logo" src="/assets/images/logo_full.png" />
                                </div>
                                <div className="row">
                                  <p>SlideWiki revolutionises how educational material is authored, shared and used.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui hidden divider"></div>
                <div className="ui container grid stackable">
                    <div className="two column row">
                        <div className="column six wide">
                          <h2 className="ui header">Welcome</h2>
                          Create, edit and share slide decks and other open educational materials.
                          The latest version of SlideWiki includes:
                          <ul>
                          <li>upload and edit existing PowerPoint or create new decks</li>
                          <li>version control for slide edits and decks</li>
                          <li>add comments to slides and decks</li>
                          </ul>
                              Many people in the world lack access to educational material.
                              Help us to create great educational material covering as many domains and as many languages as possible:
                              <ul>
                                  <li>Sign in SlideWiki</li>
                                  <li>Search for decks at SlideWiki, whose domain you know</li>
                                  <li>Review the content of decks and help improving them</li>
                                  <li>Add self-assessment questions to the slides (in development)</li>
                                  <li>Translate decks covering topics you know well into your mother tongue (in development)</li>
                                  <li>Look for existing presentations and e-learning material, which could be imported into SlideWiki</li>
                              </ul>
                        </div>
                        <div className="column ten wide">
                            <h2 className="ui header">Featured decks</h2>
                            <div>
                                <Featured />
                                {/*<div className="ui divided list animated ">
                                     <a className="item" href="/deck/8">Try Sample Deck Imported from SlideWiki.org &raquo;</a>
                                     <a className="item" href="/deck/5">Deck created from scratch &raquo;</a>
                                     <a className="item" href="/deck/372">TODO:See documentation deck&raquo;</a>
                                 </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
