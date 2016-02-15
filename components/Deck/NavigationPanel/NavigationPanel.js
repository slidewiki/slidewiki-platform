import React from 'react';
import Breadcrumb from './Breadcrumb';

class NavigationPanel extends React.Component {
    render() {
        return (
            <div className="ui menu sw-deck-navigation-panel" ref="navigationPanel">
               <div className="item">
                 <Breadcrumb />
               </div>
             </div>
        );
    }
}

export default NavigationPanel;
