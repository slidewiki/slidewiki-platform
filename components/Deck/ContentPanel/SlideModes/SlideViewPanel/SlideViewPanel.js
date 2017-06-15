import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import SlideContentView from './SlideContentView';
import SlideViewStore from '../../../../../stores/SlideViewStore';
import PresentationStore from '../../../../../stores/PresentationStore';

class SlideViewPanel extends React.Component {
    render() {
        return (
            <div className="ui bottom attached segment">
            {(this.props.SlideViewStore.content === undefined) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                <SlideContentView content={this.props.SlideViewStore.content}
                                  speakernotes={this.props.SlideViewStore.speakernotes}
                                  theme={this.props.selector && this.props.selector.theme ? this.props.selector.theme : this.props.PresentationStore.theme} />
            </div>
        );
    }
}

SlideViewPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

SlideViewPanel = connectToStores(SlideViewPanel, [SlideViewStore, PresentationStore], (context, props) => {
    return {
        SlideViewStore: context.getStore(SlideViewStore).getState(),
        PresentationStore: context.getStore(PresentationStore).getState()
    };
});

export default SlideViewPanel;
