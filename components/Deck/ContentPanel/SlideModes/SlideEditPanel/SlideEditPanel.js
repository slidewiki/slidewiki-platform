import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import SlideControl from '../SlideControl';

class SlideEditPanel extends React.Component {
    render() {
        return (
            <div ref="slideEditPanel" className="ui red segment">
                <div className="ui label red"> It is now in Edit Mode</div>
                <div dangerouslySetInnerHTML={{__html:this.props.SlideEditStore.content}} />
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
