import React from 'react';
import ReactDOM from 'react-dom/server';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
let webshot = require('webshot');

class SlideThumbnail extends React.Component {
    render() {
        const compStyle = {
            maxHeight: 500,
            minHeight: 500,
            overflowY: 'auto'
        };
        const compSpeakerStyle = {
            maxHeight: 50,
            minHeight: 50,
            overflowY: 'auto'
        };
        const deckId = this.props.slidesData.id;
        /* We do not want to show all slides; */
        const maxSlideThumbnails = this.props.maxSlideThumbnails === undefined ? this.props.slidesData.children.length : this.props.maxSlideThumbnails;
        let thumbnailHTML = '';
        this.props.slidesData.children.map((slide, index) => {
            if (index < maxSlideThumbnails) {
                thumbnailHTML = ReactDOM.renderToStaticMarkup(
                    <div className="ui bottom attached segment">
                        <div className="ui" style={compStyle}>Hello
                            <div dangerouslySetInnerHTML={{__html:slide.title}} />
                            <div dangerouslySetInnerHTML={{__html:slide.content}} />
                        </div>
                    </div>
                );
                /*
                webshot(
                    thumbnailHTML,
                    '/home/v/Workspace/slidewiki-platform/assets/images/' + deckId +  '_' + slide.id + '.png',
                    {siteType:'html'},
                    (err) => {
                        console.log(err);
                    }
                );
                */
            }

        });
        return (
            <div className="ui four column grid container">
                {this.props.slidesData.children.map((slide, index) => {
                    if (index < maxSlideThumbnails) {
                        return  <div key={index} className="column">
                                    <div className="ui card">
                                        <div className="content" tabIndex="0">
                                            <a href="http://localhost:3000/" className="ui small image" tabIndex="-1">
                                                <img src={'/assets/images/' + deckId + '_' + slide.id + '.png'} alt="thumbnail of slide" />
                                            </a>
                                            <a className="header" dangerouslySetInnerHTML={{__html:slide.title}} />
                                            <div className="description">Slide {index + 1} of {this.props.slidesData.children.length}</div>
                                        </div>
                                    </div>
                                </div>;
                    }
                    else {
                        return '';
                    }
                })}
            </div>
        );
    }
}

export default SlideThumbnail;
