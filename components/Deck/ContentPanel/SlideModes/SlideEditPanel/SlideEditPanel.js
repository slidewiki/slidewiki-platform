import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import SlideContentEditor from './SlideContentEditor';

class SlideEditPanel extends React.Component {
    render() {
        return (
            <div ref="slideEditPanel" className="ui bottom attached segment">
                <SlideContentEditor content={this.props.SlideEditStore.content} selector={this.props.selector} />
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
