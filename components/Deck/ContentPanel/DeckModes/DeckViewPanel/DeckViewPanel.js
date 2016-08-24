import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckViewStore from '../../../../../stores/DeckViewStore';

class DeckViewPanel extends React.Component {
    render() {
        const heightStyle = {
            height: '450px'
        };
        return (
            //<div ref="deckViewPanel" className="ui bottom attached segment">
            <div className="ui container bottom attached" style={heightStyle}>
                <div className="ui segment" style={heightStyle}>
                    <div className="ui two column grid container">

                        <div className="column">
                            <div className="content">
                                <h3 className="ui header">Semantic Web</h3>
                                <div className="meta">Creater: soren</div>
                                <div className="meta">Date: 1st January 2016</div>
                                <div className="description">
                                    <p></p>
                                    <p>A description which may flow for several lines and give context to the content. Vix eu enim singulis, quo id debitis nonumes. Mel ut homero causae, sed ex ipsum equidem, est nulla platonem ei. Persecuti temporibus eu sit, ei purto tacimates vulputate pri. </p>
                                </div>

                            </div>
                        </div>

                        <div className="column">

                            <div className="content">
                                <div className="ui hidden divider"></div>
                                <div className="meta">
                                    <div className="ui large label" >
                                        <i className="gb flag" aria-label="Language"></i>English</div>
                                    <div className="ui large label" tabindex="0" >
                                        <i className="block layout icon" aria-label="Number of slides"></i>23</div>
                                    <div className="ui large label" tabindex="0" >
                                        <i className="theme icon" aria-label="Theme"></i>Simple</div>
                                    <div className="ui large label" tabindex="0" >
                                        <i className="fork icon" aria-label="Number of versions"></i>5</div>
                                </div>
                                <div className="ui  divider"></div>
                                <div className="meta">
                                    <div className="ui tag labels large">
                                        <a className="ui label" tabindex="0" >elearning</a>
                                        <a className="ui label" tabindex="0" >semantic</a>
                                        <a className="ui label" tabindex="0">presentation</a>
                                        <a className="ui label" tabindex="0">skills</a>
                                        <a className="ui label" tabindex="0">school</a>

                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="ui  divider"></div>

                    <div className="ui four column grid container">
                        <div className="column">
                            <div className="ui segment">
                                <div className="content" tabindex="0">
                                    <a href="http://google.com" className="ui small image" tabindex="-1">
                                        <img src="assets/images/wireframe/image.png" alt="thumbnail of slide" />
                                    </a>
                                    <a className="header">Introduction</a>
                                    <div className="description">Slide 1 of 30</div>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="ui segment">
                                <div className="content" tabindex="0">
                                    <a href="http://google.com" className="ui small image" tabindex="-1">
                                        <img src="assets/images/wireframe/image.png" alt="thumbnail of slide" />
                                    </a>
                                    <a className="header">Basic</a>
                                    <div className="description">Slide 2 of 30</div>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="ui segment">
                                <div className="content" tabindex="0">
                                    <a href="http://google.com" className="ui small image" tabindex="-1">
                                        <img src="assets/images/wireframe/image.png" alt="thumbnail of slide" />
                                    </a>
                                    <a className="header">Slide A</a>
                                    <div className="description">Slide 3 of 30</div>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div className="ui segment">
                                <div className="content" tabindex="0">
                                    <a href="http://google.com" className="ui small image" tabindex="-1">
                                        <img src="assets/images/wireframe/image.png" alt="thumbnail of slide" />
                                    </a>
                                    <a className="header">Slide B</a>
                                    <div className="description">Slide 4 of 30</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>













                //<div dangerouslySetInnerHTML={{__html:this.props.DeckViewStore.content}} />
            //</div>
        );
    }
}

DeckViewPanel = connectToStores(DeckViewPanel, [DeckViewStore], (context, props) => {
    return {
        DeckViewStore: context.getStore(DeckViewStore).getState()
    };
});
export default DeckViewPanel;
