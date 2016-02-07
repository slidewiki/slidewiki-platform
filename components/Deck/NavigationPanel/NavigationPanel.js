import React from 'react';
import Breadcrumb from './Breadcrumb';

class NavigationPanel extends React.Component {
    render() {
        return (
            <div className="ui menu sw-deck-navigation-panel" ref="navigationPanel">
               <div className="item">
                 <Breadcrumb />
               </div>
               <div className="item right">
                 <div className="ui transparent icon input">
                   <input type="text" placeholder="Search..." />
                   <i className="search link icon"></i>
                 </div>
               </div>

             </div>
        );
    }
}

export default NavigationPanel;
