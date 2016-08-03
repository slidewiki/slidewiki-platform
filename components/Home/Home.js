import React from 'react';

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
                    <div className="three column row">
                        <div className="column">
                          <h2 className="ui header">Features</h2>
                          <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
                        </div>
                        <div className="column">
                            <h2 className="ui header">Presentations</h2>
                            <div>
                                Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
                                <div className="ui divided list animated ">
                                    <a className="item" href="/deck/56/slide/575060ae4bc68d1000ea952b">Try Sample Deck 1 &raquo;</a><a className="item" href="/deck/91">Try Sample Deck  2 &raquo;</a>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                          <h2 className="ui header">User Activities</h2>
                          <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
