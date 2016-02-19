import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../stores/ContentStore';
import ContentModeMenu from './ContentModeMenu/ContentModeMenu';
import DeckViewPanel from './DeckModes/DeckViewPanel/DeckViewPanel';
import DeckEditPanel from './DeckModes/DeckEditPanel/DeckEditPanel';
import SlideViewPanel from './SlideModes/SlideViewPanel/SlideViewPanel';
import SlideEditPanel from './SlideModes/SlideEditPanel/SlideEditPanel';

class ContentPanel extends React.Component {
    render() {
        let targetComponent = '';
        switch (this.props.ContentStore.contentType) {
            case 'deck':
                switch (this.props.ContentStore.mode) {
                    case 'view':
                        targetComponent = <DeckViewPanel ContentStore={this.props.ContentStore} />;
                        break;
                    case 'edit':
                        targetComponent = <DeckEditPanel ContentStore={this.props.ContentStore} />;
                        break;
                }
                break;
            case 'slide':
                switch (this.props.ContentStore.mode) {
                    case 'view':
                        targetComponent = <SlideViewPanel ContentStore={this.props.ContentStore} />;
                        break;
                    case 'edit':
                        targetComponent = <SlideEditPanel ContentStore={this.props.ContentStore} />;
                        break;
                }
                break;
            default:

        }
        return (
            <div className="sw-content-panel" ref="contentPanel">
                <ContentModeMenu ContentStore={this.props.ContentStore} />
                {targetComponent}
             </div>
        );
    }
}

ContentPanel = connectToStores(ContentPanel, [ContentStore], (context, props) => {
    return {
        ContentStore: context.getStore(ContentStore).getState()
    };
});
export default ContentPanel;
