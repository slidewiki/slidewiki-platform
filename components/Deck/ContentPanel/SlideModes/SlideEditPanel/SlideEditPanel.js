import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import SlideContentEditor from './SlideContentEditor';

class SlideEditPanel extends React.Component {
    render() {
        let content = '';
        // Only load WYSIWYG-Editor when the content has been loaded via loadSlideEdit.js
        if (this.props.SlideEditStore.content !== ''){
            content = <SlideContentEditor content={this.props.SlideEditStore.content} selector={this.props.selector} />;
        }
        return (
            <div ref="slideEditPanel" className="ui bottom attached segment">
                {content}
            </div>
        );
    }
}

SlideEditPanel = connectToStores(SlideEditPanel, [SlideEditStore], (context, props) => {
    return {
        SlideEditStore: context.getStore(SlideEditStore).getState()
    };
});
export default SlideEditPanel;
