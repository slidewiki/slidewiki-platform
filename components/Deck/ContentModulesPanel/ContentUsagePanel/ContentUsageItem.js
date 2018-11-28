import PropTypes from 'prop-types';
import React from 'react';
import {NavLink} from 'fluxible-router';
import { defineMessages } from 'react-intl';

class ContentUsageItem extends React.Component {

    render() {
        const form_messages = defineMessages({
            by: {
                id: 'ContentUsageItem.form.by',
                defaultMessage: 'by',
            }
        });
        const usingDeckId = this.props.usageItem.id + '-' + this.props.usageItem.revision;
        const usingDeckLink = <NavLink
        href={'/deck/' + usingDeckId}>{this.props.usageItem.title} </NavLink>;
        const userLink = <NavLink
        href={'/user/' + this.props.usageItem.user}>{this.props.usageItem.displayName || this.props.usageItem.username} </NavLink>;
        return (
        <div className="item">
            <div className="content">
                <div className="header">
                    {usingDeckLink}
                </div>
                <div className="description">
                    <span>{this.context.intl.formatMessage(form_messages.by) + ' '}</span>
                    {userLink}
                </div>
            </div>
        </div>
        );
    }
}

ContentUsageItem.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default ContentUsageItem;
