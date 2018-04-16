import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import SlideContentView from './SlideContentView';
import SlideViewStore from '../../../../../stores/SlideViewStore';
import DeckTreeStore from '../../../../../stores/DeckTreeStore';

class SlideViewPanel extends React.Component {
    constructor(props) {
        super(props);
        this.currentID;
        this.slideContentView = '';
    }
    componentWillReceiveProps(nextProps){
        if (this.props.SlideViewStore.content !== nextProps.SlideViewStore.content)
        {
            this.slideContentView = '';
            this.forceUpdate();
        }
    }
    componentWillMount(){
        if (this.currentID !== this.props.selector.sid)
        {
            this.slideContentView = '';
            this.currentID = this.props.selector.sid;
            this.forceUpdate();
        }
    }
    componentDidUpdate(){
        if (this.currentID !== this.props.selector.sid)
        {
            this.slideContentView = '';
            this.currentID = this.props.selector.sid;
            //this.forceUpdate();
        }
    }
    componentWillUnmount() {
    }

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
        if (this.currentID === this.props.selector.sid){
            this.slideContentView = (
                <div className="ui bottom attached segment">
                    <SlideContentView content={this.props.SlideViewStore.content}
                            speakernotes={this.props.SlideViewStore.speakernotes}
                            theme={deckTheme}/>
                </div>);
        } else {
            this.slideContentView = null;
        }
        const loadStyle = {
            minWidth: '100%',
            minHeight: 610,
            overflowY: 'auto',
            overflowX: 'auto',
            position: 'relative'
        };
        return (
            <div className="ui bottom attached segment">
                {(this.currentID !== this.props.selector.sid) ? <div style={loadStyle} className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                {this.slideContentView}
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
