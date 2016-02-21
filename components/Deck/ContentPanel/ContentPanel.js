import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../stores/ContentStore';
import ContentModeMenu from './ContentModeMenu/ContentModeMenu';
import DeckViewPanel from './DeckModes/DeckViewPanel/DeckViewPanel';
import DeckEditPanel from './DeckModes/DeckEditPanel/DeckEditPanel';
import SlideViewPanel from './SlideModes/SlideViewPanel/SlideViewPanel';
import SlideEditPanel from './SlideModes/SlideEditPanel/SlideEditPanel';
import ContentHistoryPanel from './ContentHistoryPanel/ContentHistoryPanel';
import ContentUsagePanel from './ContentUsagePanel/ContentUsagePanel';
import ContentQuestionsPanel from './ContentQuestionsPanel/ContentQuestionsPanel';
import ContentDiscussionPanel from './ContentDiscussionPanel/ContentDiscussionPanel';

class ContentPanel extends React.Component {
    render() {
        let targetComponent = '';
        switch (this.props.ContentStore.contentType) {
            case 'deck':
                switch (this.props.ContentStore.mode) {
                    case 'view':
                        targetComponent = <DeckViewPanel/>;
                        break;
                    case 'edit':
                        targetComponent = <DeckEditPanel />;
                        break;
                    case 'history':
                        targetComponent = <ContentHistoryPanel />;
                        break;
                    case 'usage':
                        targetComponent = <ContentUsagePanel />;
                        break;
                    case 'questions':
                        targetComponent = <ContentQuestionsPanel />;
                        break;
                    case 'discussion':
                        targetComponent = <ContentDiscussionPanel />;
                        break;
                    default:
                        targetComponent = <DeckViewPanel/>;
                }
                break;
            case 'slide':
                switch (this.props.ContentStore.mode) {
                    case 'view':
                        targetComponent = <SlideViewPanel />;
                        break;
                    case 'edit':
                        targetComponent = <SlideEditPanel />;
                        break;
                    case 'history':
                        targetComponent = <ContentHistoryPanel />;
                        break;
                    case 'usage':
                        targetComponent = <ContentUsagePanel />;
                        break;
                    case 'questions':
                        targetComponent = <ContentQuestionsPanel />;
                        break;
                    case 'discussion':
                        targetComponent = <ContentDiscussionPanel />;
                        break;
                    default:
                        targetComponent = <SlideViewPanel />;
                }
                break;
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
