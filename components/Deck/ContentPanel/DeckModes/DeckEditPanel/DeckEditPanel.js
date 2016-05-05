import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckEditStore from '../../../../../stores/DeckEditStore';
import DeckPropertiesEditor from './DeckPropertiesEditor';

class DeckEditPanel extends React.Component {
    handleChange(update) {
        console.log(update);
    }
    render() {
        return (
            <div ref="deckEditPanel" className="ui bottom attached segment">
                <DeckPropertiesEditor onChange={this.handleChange}
                    items={this.props.DeckEditStore.deckProps} />
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
