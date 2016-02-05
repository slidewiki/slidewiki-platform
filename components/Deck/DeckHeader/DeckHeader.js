import React from 'react';
import Breadcrumb from './Breadcrumb';

class DeckHeader extends React.Component {
    render() {
        return (
            <div className="ui menu sw-deck-header" ref="deckHeader">
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

export default DeckHeader;
