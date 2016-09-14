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
            <span>
                <ThumbnailCreate slideId={this.props.slideId} slideTitle={this.props.slideTitle} slideContent={this.props.slideContent} />
                <img src={'/assets/images/thumbnails/' + this.props.slideId + '.png'} alt="thumbnail of slide" />
            </span>
        );
    }
}

export default ThumbnailShow;
