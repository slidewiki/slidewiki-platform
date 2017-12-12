import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import SlideContentView from './SlideContentView';
import SlideViewStore from '../../../../../stores/SlideViewStore';
import DeckTreeStore from '../../../../../stores/DeckTreeStore';

class SlideViewPanel extends React.Component {
    render() {
        let deckTheme = this.props.selector && this.props.selector.theme;
        if (!deckTheme) {
            // we need to locate the slide in the DeckTreeStore.flatTree and find the theme from there
            let treeNode = this.props.DeckTreeStore.flatTree
                .find((node) => node.get('id') === this.props.SlideViewStore.slideId && node.get('type') === 'slide');

            if (treeNode) {
                deckTheme = treeNode.get('theme');
            } else {
                // pick theme from deck root as a last resort
                deckTheme = this.props.DeckTreeStore.theme;
            }
        } 
        return (
            <div className="ui bottom attached segment">
            {(this.props.SlideViewStore.content === undefined) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                <SlideContentView content={this.props.SlideViewStore.content}
                                  speakernotes={this.props.SlideViewStore.speakernotes}
                                  loadingIndicator={this.props.SlideViewStore.loadingIndicator}
                                  theme={deckTheme} />
            </div>
        );
    }
}

SlideViewPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

SlideViewPanel = connectToStores(SlideViewPanel, [SlideViewStore, DeckTreeStore], (context, props) => {
    return {
        SlideViewStore: context.getStore(SlideViewStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});

export default SlideViewPanel;
