import React from 'react';
import ReactDOM from 'react-dom/server';
import {NavLink} from 'fluxible-router';
import ThumbnailCreate from './ThumbnailCreate';

class ThumbnailShow extends React.Component {
    render() {
        const compStyle = {
            maxHeight: 500,
            minHeight: 500,
            overflowY: 'auto'
        };
        return (
            <div key={this.props.slideIndex} className="ui four column grid container">
                <ThumbnailCreate slideId={this.props.slideId}
                               slideTitle={this.props.slideTitle}
                               slideContent={this.props.slideContent}
                               slideIndex={this.props.slideIndex}
                               totalSlides={this.props.totalSlides}
                />
                <div className="column">
                    <div className="ui card">
                        <div className="content" tabIndex="0">
                            <a href="http://localhost:3000/" className="ui small image" tabIndex="-1">
                                <img src={'/assets/images/thumbnails/' + this.props.slideId + '.png'} alt="thumbnail of slide" />
                            </a>
                            <a className="header" dangerouslySetInnerHTML={{__html:this.props.slideTitle}} />
                            <div className="description">Slide {this.props.slideIndex + 1} of {this.props.totalSlides}</div>
                        </div>
                    </div>
                </div>;
            </div>
        );
    }
}

export default ThumbnailShow;
