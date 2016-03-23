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
                        targetComponent = <DeckViewPanel  selector={this.props.ContentStore.selector} />;
                        break;
                    case 'edit':
                        targetComponent = <DeckEditPanel  selector={this.props.ContentStore.selector} />;
                        break;
                    case 'questions':
                        targetComponent = <ContentQuestionsPanel  selector={this.props.ContentStore.selector} />;
                        break;
                    case 'datasources':
                        targetComponent = <DataSourcePanel  selector={this.props.ContentStore.selector} />;
                        break;
                    default:
                        targetComponent = <DeckViewPanel  selector={this.props.ContentStore.selector} />;
                }
                break;
            case 'slide':
                switch (this.props.ContentStore.mode) {
                    case 'view':
                        targetComponent = <SlideViewPanel  selector={this.props.ContentStore.selector} />;
                        break;
                    case 'edit':
                        targetComponent = <SlideEditPanel selector={this.props.ContentStore.selector} />;
                        break;
                    case 'questions':
                        targetComponent = <ContentQuestionsPanel  selector={this.props.ContentStore.selector} />;
                        break;
                    case 'datasources':
                        targetComponent = <DataSourcePanel  selector={this.props.ContentStore.selector} />;
                        break;
                    default:
                        targetComponent = <SlideViewPanel  selector={this.props.ContentStore.selector} />;
                }
                break;
        }
        return (
            <div ref="contentPanel">
                <ContentModeMenu ContentStore={this.props.ContentStore} />
                {targetComponent}
                {this.props.ContentStore.selector.stype === 'slide' ? <SlideControl mode={this.props.ContentStore.mode}/> : ''}
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
