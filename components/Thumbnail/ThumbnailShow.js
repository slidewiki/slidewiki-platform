import React from 'react';
import ReactDOM from 'react-dom/server';
import ThumbnailCreate from './ThumbnailCreate';
import path from 'path';
import { RelativeImagePath } from './Properties';

class ThumbnailShow extends React.Component {
    render() {
        return (
            <span>
                <ThumbnailCreate slideId={this.props.slideId} slideTitle={this.props.slideTitle} slideContent={this.props.slideContent} />
                <img src={path.join(RelativeImagePath, this.props.slideId + '.png')} alt={'thumbnail of slide ' + this.props.slideId} />
            </span>
        );
    }
}

export default ThumbnailShow;
