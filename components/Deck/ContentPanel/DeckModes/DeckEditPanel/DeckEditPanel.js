import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckEditStore from '../../../../../stores/DeckEditStore';
import ErrorStore from '../../../../../stores/ErrorStore';
import DeckPropertiesEditor from './DeckPropertiesEditor';
import Error from '../../../../../components/Error/Error';

class DeckEditPanel extends React.Component {
    handleChange(update) {
        console.log(update);
    }
    render() {
        if (this.props.ErrorStore.error) {
            return (
                <div ref="deckEditPanel">
                    <Error error={this.props.ErrorStore.error} />
                </div>
            );
        }
        else {
            return (
                <div ref="deckEditPanel" className="ui bottom attached segment">
                    <DeckPropertiesEditor onChange={this.handleChange}
                        items={this.props.DeckEditStore.deckProps} />
                </div>
            );
        }
    }
}

DeckEditPanel = connectToStores(DeckEditPanel, [DeckEditStore, ErrorStore], (context, props) => {
    return {
        DeckEditStore: context.getStore(DeckEditStore).getState(),
        ErrorStore: context.getStore(ErrorStore).getState(),
    };
});
export default DeckEditPanel;
