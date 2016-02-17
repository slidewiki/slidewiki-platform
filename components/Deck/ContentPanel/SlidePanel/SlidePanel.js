import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import SlideStore from '../../../../stores/SlideStore';
import SlideControl from './SlideControl';
import SlideViewPanel from './SlideViewPanel/SlideViewPanel';

class SlidePanel extends React.Component {
    render() {
        return (
            <div ref="slidePanel">
                <div className="ui grey inverted segment">
                    <SlideViewPanel content={this.props.SlideStore.content}/>
                </div>
                <SlideControl />
            </div>
        );
    }
}

SlidePanel = connectToStores(SlidePanel, [SlideStore], (context, props) => {
    return {
        SlideStore: context.getStore(SlideStore).getState()
    };
});
export default SlidePanel;
