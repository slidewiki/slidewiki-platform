import React from 'react';
import ReactDOM from 'react-dom/server';
import {NavLink} from 'fluxible-router';
let webshot = require('webshot');
let fs = require('fs');

class ThumbnailCreate extends React.Component {
    render() {
        const thumbnailFilepath = '/assets/images/thumbnails/' + this.props.slideId + '.png';
        fs.stat(thumbnailFilepath, (err, stats) => {
            if (err) {
                console.log('Not creating thumbnails');
                const compStyle = {
                    maxHeight: 500,
                    minHeight: 500,
                    overflowY: 'auto'
                };

                let thumbnailHTML = ReactDOM.renderToStaticMarkup(
                    <div className="ui bottom attached segment">
                        <div className="ui" style={compStyle}>
                            <div dangerouslySetInnerHTML={{__html:this.props.slideTitle}} />
                            <div dangerouslySetInnerHTML={{__html:this.props.slideContent}} />
                        </div>
                    </div>
                );
                webshot(
                    thumbnailHTML,
                    '/home/v/Workspace/slidewiki-platform/' + thumbnailFilepath,
                    {siteType:'html'},
                    (err) => {
                        console.log(err);
                    }
                );
            }
        });

        return (
            <span></span>
        );
    }
}

export default ThumbnailCreate;
