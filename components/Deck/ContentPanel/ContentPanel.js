import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../stores/ContentStore';
import ContentActionsHeader from './ContentActions/ContentActionsHeader';
import ContentActionsFooter from './ContentActions/ContentActionsFooter';
import DeckViewPanel from './DeckModes/DeckViewPanel/DeckViewPanel';
import DeckEditPanel from './DeckModes/DeckEditPanel/DeckEditPanel';
import SlideViewPanel from './SlideModes/SlideViewPanel/SlideViewPanel';
import SlideEditPanel from './SlideModes/SlideEditPanel/SlideEditPanel';
import NoPermissionsModal from './NoPermissionsModal';
import {Button, Menu} from 'semantic-ui-react';

class ContentPanel extends React.Component {


    render() {
        let targetComponent = '';
        switch (this.props.ContentStore.selector.stype) {
            case 'deck':
                switch (this.props.ContentStore.mode) {
                    case 'view':
                        targetComponent =
                            <DeckViewPanel selector={this.props.ContentStore.selector} deckSlug={this.props.deckSlug}/>;
                        break;
                    case 'edit':
                        targetComponent = <DeckEditPanel selector={this.props.ContentStore.selector}/>;
                        break;
                    default:
                        targetComponent =
                            <DeckViewPanel selector={this.props.ContentStore.selector} deckSlug={this.props.deckSlug}/>;
                }
                break;
            case 'slide':
                switch (this.props.ContentStore.mode) {
                    case 'view':
                        targetComponent = <SlideViewPanel selector={this.props.ContentStore.selector}/>;
                        break;
                    case 'edit':
                        targetComponent = <SlideEditPanel selector={this.props.ContentStore.selector}/>;
                        break;
                    case 'markdownEdit':
                        targetComponent =
                            <SlideEditPanel useMarkdown={true} selector={this.props.ContentStore.selector}/>;
                        break;
                    default:
                        targetComponent = <SlideViewPanel selector={this.props.ContentStore.selector}/>;
                }
                break;
        }
        let H1heading = '';
        switch (this.props.ContentStore.selector.stype) {
            case 'deck':
                switch (this.props.ContentStore.mode) {
                    case 'view':
                        H1heading = 'Deck overview for ' + this.props.deckSlug;
                        break;
                    case 'edit':
                        H1heading = 'Edit deck properties for ' + this.props.deckSlug;
                        break;
                    default:
                        H1heading = 'Deck overview for ' + this.props.deckSlug;
                }
                break;
            case 'slide':
                switch (this.props.ContentStore.mode) {
                    case 'view':
                        H1heading = 'Current Slide ';
                        break;
                    case 'edit':
                        H1heading = 'Edit Slide ';
                        break;
                    case 'markdownEdit':
                        H1heading = 'Edit Slide with markdown ';
                        break;
                    default:
                        H1heading = 'Current Slide';
                }
                break;
        }
        return (
            <div ref="contentPanel">
                <h1 className="sr-only"> {H1heading}</h1>
                
                <ContentActionsHeader/>
                
                <div className="ui top attached">
                    {targetComponent}
                </div>
                <div className="ui bottom attached">
                    <ContentActionsFooter ContentStore={this.props.ContentStore} deckSlug={this.props.deckSlug}/>
                </div>
                <NoPermissionsModal selector={this.props.ContentStore.selector}/>
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
