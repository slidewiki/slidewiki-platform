import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import revertRevision from '../../../../actions/history/revertRevision';
import ActivityFeedUtil from '../util/ActivityFeedUtil';
import classNames from 'classnames';
import moment from 'moment';


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

        let itemClass = classNames({
            'item revision': true,
            'active': this.props.isSelected
        });

        const revertBtn = !revision.active && this.props.allowRevert ? (
        <button className="ui right floated button compact revert" onClick={this.handleRevertClick.bind(this)}>Make Active</button>
        ) : '';

        return (
        <div className={itemClass} onClick={this.handleRevisionSelection.bind(this)}>
            <div className="middle aligned content">
                {revertBtn}
                <div className="header">
                    <span>{moment(revision.timestamp).calendar(null, {
                        sameElse: 'lll'
                    })} </span>
                    {revision.active ? <i className='check circle icon green'></i> : ''}
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
