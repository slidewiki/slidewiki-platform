import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../stores/ContentStore';
import ContentModeMenu from './ContentModeMenu/ContentModeMenu';
import DeckViewPanel from './DeckModes/DeckViewPanel/DeckViewPanel';
import DeckEditPanel from './DeckModes/DeckEditPanel/DeckEditPanel';
import SlideViewPanel from './SlideModes/SlideViewPanel/SlideViewPanel';
import SlideEditPanel from './SlideModes/SlideEditPanel/SlideEditPanel';
import ContentQuestionsPanel from './ContentQuestionsPanel/ContentQuestionsPanel';
import DataSourcePanel from '../DataSourcePanel/DataSourcePanel';
import SlideControl from './SlideModes/SlideControl';

class ContentPanel extends React.Component {
    render() {
        let targetComponent = '';
        switch (this.props.ContentStore.selector.stype) {
            case 'deck':
                switch (this.props.ContentStore.mode) {
                    case 'view':
                        targetComponent = <DeckViewPanel/>;
                        break;
                    case 'edit':
                        targetComponent = <DeckEditPanel />;
                        break;
                    case 'questions':
                        targetComponent = <ContentQuestionsPanel />;
                        break;
                    case 'datasources':
                        targetComponent = <DataSourcePanel />;
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
                    case 'questions':
                        targetComponent = <ContentQuestionsPanel />;
                        break;
                    case 'datasources':
                        targetComponent = <DataSourcePanel />;
                        break;
                    default:
                        targetComponent = <SlideViewPanel />;
                }
                targetComponent = <div>{targetComponent} <SlideControl mode={this.props.ContentStore.mode}/> </div>;
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
