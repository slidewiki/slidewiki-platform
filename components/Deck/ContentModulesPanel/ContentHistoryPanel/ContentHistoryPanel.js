import React from 'react';
import DeckHistoryPanel from './DeckHistoryPanel';

class ContentHistoryPanel extends React.Component {
    render() {
        let targetComponent = '';
        switch (this.props.selector.stype) {
            case 'deck':
                targetComponent = <DeckHistoryPanel  selector={this.props.selector} />;
                break;
            case 'slide':
                targetComponent = <div></div>;
                break;
        }
        return (
            <div ref="contentHistoryPanel">
                {targetComponent}
            </div>
        );
    }
}

export default ContentHistoryPanel;
