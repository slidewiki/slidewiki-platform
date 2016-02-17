import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckStore from '../../../../stores/DeckStore';
import DeckViewPanel from './DeckViewPanel/DeckViewPanel';

class DeckPanel extends React.Component {
    render() {
        return (
            <div ref="deckPanel">
                <div className="ui grey inverted segment">
                    <DeckViewPanel content={this.props.DeckStore.content} />
                </div>
            </div>
        );
    }
}

DeckPanel = connectToStores(DeckPanel, [DeckStore], (context, props) => {
    return {
        DeckStore: context.getStore(DeckStore).getState()
    };
});
export default DeckPanel;
