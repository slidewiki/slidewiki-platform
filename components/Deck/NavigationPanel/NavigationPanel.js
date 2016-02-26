import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import Breadcrumb from './Breadcrumb';

class NavigationPanel extends React.Component {
    render() {
        return (
            <div className="ui menu sw-deck-navigation-panel" ref="navigationPanel">
               <div className="item">
                 <Breadcrumb selector={this.props.DeckTreeStore.selector} />
               </div>
             </div>
        );
    }
}

NavigationPanel = connectToStores(NavigationPanel, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default NavigationPanel;
