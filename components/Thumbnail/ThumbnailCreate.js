import React from 'react';
import ReactDOM from 'react-dom/server';
import classNames from 'classnames/bind';
import webshot from 'webshot';
import fs from 'fs';
import path from 'path';
import { SizeCSS, AbsoluteDirpath, Options } from './Properties';

class ThumbnailCreate extends React.Component {
    render() {
        const thumbnailFilepath = path.join(AbsoluteDirpath, this.props.slideId + '.png');
        fs.stat(thumbnailFilepath, (err, stats) => {
            if (err) {
                let thumbnailHTML = ReactDOM.renderToStaticMarkup(
                    <div className="ui bottom attached segment">
                        <div className="ui" >
                            <div dangerouslySetInnerHTML={{__html:this.props.slideTitle}} />
                            <div dangerouslySetInnerHTML={{__html:this.props.slideContent}} />
                        </div>
                    </div>
                );
                webshot(thumbnailHTML, thumbnailFilepath, Options, (err) => {
                    console.log(err);
                });
            }
        });

        return (
            <span></span>
        );
    }
}

export default ThumbnailCreate;
