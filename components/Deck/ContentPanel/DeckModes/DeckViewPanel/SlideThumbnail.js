import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';

class SlideThumbnail extends React.Component {
    render() {
        const slides = [];
        /* We do not want to show all slides; */
        const maxSlideThumbnails = this.props.maxSlideThumbnails === undefined ? this.props.slidesData.children.length : this.props.maxSlideThumbnails;
        return (
            <div className="ui four column grid container">
                {this.props.slidesData.children.map((slide, index) => {
                    if (index < maxSlideThumbnails) {
                        return  <div key={index} className="column">
                                    <div className="ui card">
                                        <div className="content" tabIndex="0">
                                            <a href="http://localhost:3000/" className="ui small image" tabIndex="-1">
                                                <img src="/assets/images/logo_full.png" alt="thumbnail of slide" />
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
