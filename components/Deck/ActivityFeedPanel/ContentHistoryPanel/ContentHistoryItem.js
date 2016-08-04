import React from 'react';
import {formatDate} from '../util/ActivityFeedUtil';

class ContentHistoryItem extends React.Component {

    render() {
        const revision = this.props.revision;

        return (
            <div className="item">
                <div className="content">
                    <div className="header">
                        <a className="user">Revision {revision.id} </a>
                        <i className={revision.active ? 'check circle icon green' : 'icon'}></i>
                    </div>
                    <div className="description">
                        <span>{'by '}</span>
                        <a className="user" href={'/user/' + revision.userID}>
                            {revision.username}
                        </a>
                        <span>{' ' + formatDate(revision.timestamp)}</span>
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