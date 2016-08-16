import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckViewStore from '../../../../../stores/DeckViewStore';

class DeckViewPanel extends React.Component {
    render() {
        return (
            <div ref="deckViewPanel" className="ui bottom attached segment">
                <div dangerouslySetInnerHTML={{__html:this.props.DeckViewStore.content}} />
            </div>
        );
    }
}

DeckViewPanel = connectToStores(DeckViewPanel, [DeckViewStore], (context, props) => {
    return {
        DeckViewStore: context.getStore(DeckViewStore).getState()
    };
});
export default DeckViewPanel;
