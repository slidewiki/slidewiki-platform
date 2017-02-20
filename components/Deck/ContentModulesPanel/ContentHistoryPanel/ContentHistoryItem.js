import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import revertRevision from '../../../../actions/history/revertRevision';
import ActivityFeedUtil from '../util/ActivityFeedUtil';
import classNames from 'classnames';


class ContentHistoryItem extends React.Component {

    handleRevisionSelection(e) {
        this.context.executeAction(navigateAction, {
            url: ActivityFeedUtil.makeNodeRevisionURL(this.props.selector, this.props.revision.id)
        });
    }

    handleRevertClick(e) {
        e.stopPropagation();
        this.context.executeAction(revertRevision, {
            selector: this.props.selector, revisionId: this.props.revision.id
        });
    }

    handleUserClick(e) {
        e.stopPropagation();
    }

    render() {
        const revision = this.props.revision;
        let revertBtnClass = classNames({
            'ui right floated button mini compact': true
        });
        let itemClass = classNames({
            'item': true,
            'active': this.props.isSelected
        });

        const revertBtn = revision.active ?
        <i className='check large circle icon green right floated'></i> : this.props.allowRevert ? (
        <button className={revertBtnClass} onClick={this.handleRevertClick.bind(this)}>Make Active</button>
        ) : '';

        return (
        <div className={itemClass} onClick={this.handleRevisionSelection.bind(this)}>
            <div className="content">
                {revertBtn}
                <div className="header">
                    <span>{' ' + ActivityFeedUtil.formatDate(revision.timestamp)}</span>
                </div>
                <div className="description">
                    <span>{'by '}</span>
                    <a href={'/user/' + revision.user} onClick={this.handleUserClick.bind(this)}>{revision.username}</a>
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
