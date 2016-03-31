import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideViewStore from '../../../../../stores/SlideViewStore';

class SlideViewPanel extends React.Component {
    render() {
        const compStyle = {
            maxHeight: '500',
            minHeight: '500',
            overflowY: 'auto'
        };
        return (
            <div ref="slideViewPanel" className="ui bottom attached segment" style={compStyle}>
                <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.content}} />
            </div>
        );
    }
}

SlideViewPanel = connectToStores(SlideViewPanel, [SlideViewStore], (context, props) => {
    return {
        SlideViewStore: context.getStore(SlideViewStore).getState()
    };
});
export default SlideViewPanel;
