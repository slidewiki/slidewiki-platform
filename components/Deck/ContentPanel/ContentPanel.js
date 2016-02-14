import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../stores/ContentStore';
import ContentModePanel from './ContentModePanel/ContentModePanel';
import DeckPanel from './DeckPanel/DeckPanel';
import SlidePanel from './SlidePanel/SlidePanel';

class ContentPanel extends React.Component {
    render() {
        let targetComponent = '';
        switch (this.props.ContentStore.contentType) {
            case 'deck':
                targetComponent = <DeckPanel />;
                break;
            case 'slide':
                targetComponent = <SlidePanel />;
                break;
            default:

        }
        return (
            <div className="sw-content-panel" ref="contentPanel">
                <ContentModePanel />
                {targetComponent}
             </div>
        );
    }
}

ContentPanel = connectToStores(ContentPanel, [ContentStore], (context, props)=> {
    return {
        ContentStore: context.getStore(ContentStore).getState()
    };
});
export default ContentPanel;
