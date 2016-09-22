import React from 'react';
import ReactDOM from 'react-dom/server';
import ThumbnailCreate from './ThumbnailCreate';
import path from 'path';
import { RelativeImagePath } from './ThumbnailOptions';

/* Read https://slidewiki.atlassian.net/wiki/display/SWIK/How+To+Use+Slide+Thumbnail to know the details */
class ThumbnailShow extends React.Component {
    render() {
        return (
            <span>
                {(() => {
                    if (this.props.action === 'new' || this.props.action === 'update') {
                        return <ThumbnailCreate slideId={this.props.slideId} slideTitle={this.props.slideTitle} slideContent={this.props.slideContent} action={this.props.action} />;
                    }
                    else {
                        return '';
                    }
                })()}
                <img src={path.join(RelativeImagePath, this.props.slideId + '.png')} alt={'thumbnail of slide ' + this.props.slideId} />
            </span>
        );
    }
}

export default ThumbnailShow;
