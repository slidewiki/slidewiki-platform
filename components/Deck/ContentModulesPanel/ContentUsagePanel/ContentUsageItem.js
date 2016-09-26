import React from 'react';
import {NavLink} from 'fluxible-router';

class ContentUsageItem extends React.Component {

    render() {
        const usingDeckId = this.props.usageItem.id + '-' + this.props.usageItem.revision;
        const usingDeckLink = <NavLink
        href={'/deck/' + usingDeckId}>Deck {usingDeckId} </NavLink>;
        return (
        <div className="item">
            <div className="content">
                <div className="header">
                    {usingDeckLink}
                </div>
                <div className="description">
                </div>
            </div>
        </div>
        );
    }
}

ContentUsageItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ContentUsageItem;
