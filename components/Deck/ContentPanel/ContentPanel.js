import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../stores/ContentStore';
import ContentActionsHeader from './ContentActions/ContentActionsHeader';
import ContentActionsFooter from './ContentActions/ContentActionsFooter';
import DeckViewPanel from './DeckModes/DeckViewPanel/DeckViewPanel';
import DeckEditPanel from './DeckModes/DeckEditPanel/DeckEditPanel';
import SlideViewPanel from './SlideModes/SlideViewPanel/SlideViewPanel';
import SlideEditPanel from './SlideModes/SlideEditPanel/SlideEditPanel';

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
                    default:
                        targetComponent = <SlideViewPanel  selector={this.props.ContentStore.selector} />;
                }
                break;
        }
        return (
            <div ref="contentPanel">
                <div className="ui top attached">
                    <ContentActionsHeader ContentStore={this.props.ContentStore} />
                </div>
                <div className="ui top attached">
                    {targetComponent}
                </div>
                <div className="ui bottom attached">
                    <ContentActionsFooter ContentStore={this.props.ContentStore} />
                </div>
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
