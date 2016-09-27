import React from 'react';
import {NavLink} from 'fluxible-router';

class ContentUsageItem extends React.Component {

    render() {
        const usingDeckId = this.props.usageItem.id + '-' + this.props.usageItem.revision;
        const usingDeckLink = <NavLink
        href={'/deck/' + usingDeckId}>{this.props.usageItem.title} </NavLink>;
        const userLink = <NavLink
        href={'/user/' + this.props.usageItem.user}>{this.props.usageItem.username} </NavLink>;
        return (
        <div className="item">
            <div className="content">
                <div className="header">
                    {usingDeckLink}
                </div>
                <div className="description">
                    <span>{'by '}</span>
                    {userLink}
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
