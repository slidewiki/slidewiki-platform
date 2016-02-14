import React from 'react';
import {NavLink} from 'fluxible-router';

class SlideViewPanel extends React.Component {
    render() {
        return (
            <div ref="slideViewPanel">
                <div dangerouslySetInnerHTML={{__html:this.props.content}} />
            </div>
        );
    }
}

export default SlideViewPanel;
