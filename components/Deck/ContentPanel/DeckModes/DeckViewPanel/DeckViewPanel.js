import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckViewStore from '../../../../../stores/DeckViewStore';

class DeckViewPanel extends React.Component {
    render() {
        const heightStyle = {
            height: '450px'
        };
        const bottomTabularMenu = {
            background: '#DCDDDE'
        };
        const bottomTabularMenuOutline = {
            outline: 'none'
        };
        const transitionDuration = {
            transitionDuration: '300ms',
            width: '9%'
        };

        return (
            //<div ref="deckViewPanel" className="ui bottom attached segment">
            <div ref="deckViewPanel">
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
                                        <div className="ui large label" tabIndex="0" >
                                            <i className="block layout icon" aria-label="Number of slides"></i>23</div>
                                        <div className="ui large label" tabIndex="0" >
                                            <i className="theme icon" aria-label="Theme"></i>Simple</div>
                                        <div className="ui large label" tabIndex="0" >
                                            <i className="fork icon" aria-label="Number of versions"></i>5</div>
                                    </div>
                                    <div className="ui  divider"></div>
                                    <div className="meta">
                                        <div className="ui tag labels large">
                                            <a className="ui label" tabIndex="0" >elearning</a>
                                            <a className="ui label" tabIndex="0" >semantic</a>
                                            <a className="ui label" tabIndex="0">presentation</a>
                                            <a className="ui label" tabIndex="0">skills</a>
                                            <a className="ui label" tabIndex="0">school</a>

                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                        <div className="ui  divider"></div>

                        <div className="ui four column grid container">
                            <div className="column">
                                <div className="ui segment">
                                    <div className="content" tabIndex="0">
                                        <a href="http://google.com" className="ui small image" tabIndex="-1">
                                            <img src="assets/images/wireframe/image.png" alt="thumbnail of slide" />
                                        </a>
                                        <a className="header">Introduction</a>
                                        <div className="description">Slide 1 of 30</div>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="ui segment">
                                    <div className="content" tabIndex="0">
                                        <a href="http://google.com" className="ui small image" tabIndex="-1">
                                            <img src="assets/images/wireframe/image.png" alt="thumbnail of slide" />
                                        </a>
                                        <a className="header">Basic</a>
                                        <div className="description">Slide 2 of 30</div>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="ui segment">
                                    <div className="content" tabIndex="0">
                                        <a href="http://google.com" className="ui small image" tabIndex="-1">
                                            <img src="assets/images/wireframe/image.png" alt="thumbnail of slide" />
                                        </a>
                                        <a className="header">Slide A</a>
                                        <div className="description">Slide 3 of 30</div>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="ui segment">
                                    <div className="content" tabIndex="0">
                                        <a href="http://google.com" className="ui small image" tabIndex="-1">
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
                <div className="ui" data-reactid="586">
                    <div className="ui teal top attached progress slide-progress-bar active" data-reactid="587" data-percent="9">
                        <div className="bar" data-reactid="588" style={transitionDuration}>
                        </div>
                    </div>
                    <div className="ui bottom attached tabular menu" style={bottomTabularMenu} data-reactid="589">
                        <div tabIndex="-1" style={bottomTabularMenuOutline} data-reactid="590">
                            <div className="ui icon buttons large left floated" data-reactid="591">
                                <button className="ui button" title="go to the first slide (shift + left arrow)" data-reactid="592"><i className="icon fast backward" data-reactid="593">
                                    </i>
                                </button>
                                <button className="ui button" title="go to the previous slide (left arrow)" data-reactid="594">
                                    <i className="step backward icon" data-reactid="595">
                                    </i>
                                </button>
                                <div className="ui grey large button" data-reactid="596">

                                    {/*<react-text: 597>1</react-text><react-text: 598>/</react-text><react-text: 599>11</react-text>*/}
                                    1/11

                                </div>
                                <button className="ui button" title="go to the next slide (right arrow)" data-reactid="600">
                                    <i className="icon step forward" data-reactid="601"></i></button>
                                <button className="ui button" title="go to the last slide (shift + right arrow)" data-reactid="602">
                                    <i className="icon fast forward" data-reactid="603">
                                    </i>
                                </button>
                            </div>
                        </div>
                        <div className="right menu" data-reactid="604">
                            <div className="ui icon buttons large right floated" data-reactid="605">
                                <button className="ui button" data-reactid="606" title="Start slideshow">
                                    <i className="circle play large icon" data-reactid="607">
                                    </i>
                                </button>
                                <button className="ui button" data-reactid="608" title="Print deck">
                                    <i className="print large icon" data-reactid="609">
                                    </i>
                                </button>
                                <button className="ui button" data-reactid="610" title="Download deck">
                                    <i className="download large icon" data-reactid="611">
                                    </i>
                                </button>
                                <button className="ui button" data-reactid="612" title="Share deck">
                                    <i className="share alternate large icon" data-reactid="613">
                                    </i>
                                </button>
                                <button className="ui button" title="Expand Content" data-reactid="614">
                                    <i className="large icon expand" data-reactid="615">
                                    </i>
                                </button>
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
