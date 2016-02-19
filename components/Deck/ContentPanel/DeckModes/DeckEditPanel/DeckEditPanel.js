import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckEditStore from '../../../../../stores/DeckEditStore';

class DeckEditPanel extends React.Component {
    render() {
        return (
            <div ref="deckEditPanel" className="ui red segment">
                Shows all properties of a deck to be edited...
            </div>
        );
    }
}

DeckEditPanel = connectToStores(DeckEditPanel, [DeckEditStore], (context, props) => {
    return {
        DeckEditStore: context.getStore(DeckEditStore).getState()
    };
});
export default DeckEditPanel;
