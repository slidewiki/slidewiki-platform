import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideThumbnailStore from '../../../../../stores/SlideThumbnailStore';

class SlideThumbnail extends React.Component {
    render() {
        const slides = [];
        /* We do not want to show all slides; 8 slides at max fits well in the available mockup. */
        const maxSlidesToShow = this.props.slidesData.children.length > 8 ? 8 : this.props.slidesData.children.length;
        for (let slideNumber = 0; slideNumber < maxSlidesToShow; slideNumber++) {
            slides.push(
                <div className="column">
                    <div className="ui segment">
                        <div className="content" tabIndex="0">
                            <a className="header" dangerouslySetInnerHTML={{__html:this.props.slidesData.children[slideNumber].title}} />
                            <div className="description" dangerouslySetInnerHTML={{__html:this.props.slidesData.children[slideNumber].content}} />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="ui four column grid container">{slides}</div>
        /*
        <div className="column">
            <div ref="slideViewPanel" className="ui segment">
                <div className="content" tabIndex="0">
                    <a href="http://google.com" className="ui small image" tabIndex="-1">
                        <img src="assets/images/wireframe/image.png" alt="thumbnail of slide" />
                    </a>
                    <a className="header" dangerouslySetInnerHTML={{__html:this.props.slidesData.children[0].title}} />
                    <div className="description">Slide 4 of 30</div>
                    <div dangerouslySetInnerHTML={{__html:this.props.SlideThumbnailStore.title}} />
                    <div dangerouslySetInnerHTML={{__html:this.props.SlideThumbnailStore.content}} />
                 </div>
            </div>
        </div>
        */
        );
    }
}

SlideThumbnail = connectToStores(SlideThumbnail, [SlideThumbnailStore], (context, props) => {
    return {
        SlideThumbnailStore: context.getStore(SlideThumbnailStore).getState()
    };
});
export default SlideThumbnail;
