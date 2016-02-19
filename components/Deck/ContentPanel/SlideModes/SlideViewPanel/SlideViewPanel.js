import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideViewStore from '../../../../../stores/SlideViewStore';
import SlideControl from '../SlideControl';

class SlideViewPanel extends React.Component {
    render() {
        return (
            <div ref="slideViewPanel" className="ui grey segment">
                <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.content}} />
                <SlideControl />
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
