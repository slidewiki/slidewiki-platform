import React from 'react';
import {NavLink} from 'fluxible-router';

class DeckViewPanel extends React.Component {
    render() {
        return (
            <div ref="deckViewPanel">
                <div dangerouslySetInnerHTML={{__html:this.props.content}} />
            </div>
        );
    }
}

export default DeckViewPanel;
