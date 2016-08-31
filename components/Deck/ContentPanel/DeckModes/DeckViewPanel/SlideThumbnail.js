import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideThumbnailStore from '../../../../../stores/SlideThumbnailStore';

class SlideViewPanel extends React.Component {
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
        return (
        <div className="column">
            <div ref="slideViewPanel" className="ui segment">
                <div class="content" tabIndex="0">
                    <a href="http://google.com" className="ui small image" tabIndex="-1">
                        <img src="assets/images/wireframe/image.png" alt="thumbnail of slide" />
                    </a>
                    <a className="header">Slide B</a>
                    <div className="description">Slide 4 of 30</div>
                  <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.title}} />
                  <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.content}} />
                 </div>
            </div>
        </div>
        );
    }
}

SlideThumbnail = connectToStores(SlideThumbnail, [SlideThumbnailStore], (context, props) => {
    return {
        SlideThumbnailStore: context.getStore(SlideThumbnailStore).getState()
    };
});
export default SlideThumbnailStore;
