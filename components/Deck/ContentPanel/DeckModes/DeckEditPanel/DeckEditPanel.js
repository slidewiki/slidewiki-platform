import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckEditStore from '../../../../../stores/DeckEditStore';
import DeckPropertiesEditor from './DeckPropertiesEditor';


class DeckEditPanel extends React.Component {
    render() {
        return (
        <div ref="deckEditPanel" className="ui bottom attached segment">
            <DeckPropertiesEditor deckProps={this.props.DeckEditStore.deckProps} selector={this.props.selector}/>
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
