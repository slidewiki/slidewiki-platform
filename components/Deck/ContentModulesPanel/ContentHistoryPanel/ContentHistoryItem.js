import React from 'react';
import {NavLink} from 'fluxible-router';
import revertRevision from '../../../../actions/history/revertRevision';
import ActivityFeedUtil from '../util/ActivityFeedUtil';


class ContentHistoryItem extends React.Component {

    handleRevertClick() {
        this.context.executeAction(revertRevision, {
            selector: this.props.selector, revisionId: this.props.revision.id
        });
    }

    render() {
        const revision = this.props.revision;
        const revertIcon = (
        <a className="like" onClick={this.handleRevertClick.bind(this)}>
            <i className="undo icon"/>
        </a>
        );
        let revisionLink = <NavLink
        href={ActivityFeedUtil.makeNodeRevisionURL(this.props.selector, revision.id)}>Revision {revision.id} </NavLink>;
        return (
        <div className="item">
            <div className="content">
                <div className="header">
                    {revisionLink}
                    {revision.active ? <i className='check circle icon green'></i> : revertIcon}
                </div>
                <div className="description">
                    <span>{'by '}</span>
                    <a className="user" href={'/user/' + revision.user}>
                        {revision.username}
                    </a>
                    <span>{' ' + ActivityFeedUtil.formatDate(revision.timestamp)}</span>
                </div>
            </div>
        </div>
        );
    }
}

ContentHistoryItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ContentHistoryItem;
