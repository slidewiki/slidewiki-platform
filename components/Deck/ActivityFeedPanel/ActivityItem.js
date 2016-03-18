import React from 'react';
import likeActivity from '../../../actions/likeActivity';
import {formatDate} from './util/ActivityFeedUtil';

class ActivityItem extends React.Component {
    handleLike() {
        this.context.executeAction(likeActivity, {
            id: this.props.activity.id
        });
    }
    render() {
        const node = this.props.activity;

        let IconNode = '';
        let SummaryNode = '';
        const DateDiv = (
            <div className="date">
                {formatDate(node.date)}
            </div>
        );
        const commentStyles = {
            fontStyle: 'italic',
            fontWeight: 400
        };

        switch (node.type) {
            case 'translate':
                IconNode = (<i className="ui big translate icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.userID}>
                            {node.username}
                        </a> {'translated ' + node.contentType + ' '}
                        <a href={'/slideview/' + node.contentID}>{node.contentName}</a>{' to '}
                        <a href={'/slideview/' + node.translation.contentID}>{node.translation.language}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'share':
                IconNode = (<i className="ui big slideshare icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.userID}>
                            {node.username}
                        </a> {'shared ' + node.contentType + ' '}
                        <a href={'/slideview/' + node.contentID}>{node.contentName}</a>{' on '}
                        <a target="_blank" href={node.shareInfo.postURI}>{node.shareInfo.platform}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'add':
                IconNode = (<i className="ui big write icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.userID}>
                            {node.username}
                        </a> {'created ' + node.contentType + ' '}
                        <a href={'/slideview/' + node.contentID}>{node.contentName}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'edit':
                IconNode = (<i className="ui big edit icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.userID}>
                            {node.username}
                        </a> {'edited ' + node.contentType + ' '}
                        <a href={'/slideview/' + node.contentID}>{node.contentName}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'comment':
                IconNode = (<i className="ui big comment outline icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.userID}>
                            {node.username}
                        </a> {'commented on ' + node.contentType + ' '}
                        <a href={'/slideview/' + node.contentID}>{node.contentName}</a>
                        <br/>
                        <span style={commentStyles}>{'"' + node.commentText + '"'}</span>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'reply':
                IconNode = (<i className="ui big comments outline icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.userID}>
                            {node.username}
                        </a>
                        <span> replied to a comment </span>{'on ' + node.contentType + ' '}
                        <a href={'/slideview/' + node.contentID}>{node.contentName}</a>
                        <br/>
                        <span style={commentStyles}>{'"' + node.replyText + '"'}</span>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'use':
                IconNode = (<i className="ui big copy icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.userID}>
                            {node.username}
                        </a> {'used ' + node.contentType + ' '}
                        <a href={'/slideview/' + node.contentID}>{node.contentName}</a>
                        {' in deck '}<a href={'/slideview/' + node.targetDeckID}>{node.targetDeckName}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'like':
                IconNode = (<i className="ui big thumbs outline up icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.userID}>
                            {node.username}
                        </a> {'liked ' + node.contentType + ' '}
                        <a href={'/slideview/' + node.contentID}>{node.contentName}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'download':
                IconNode = (<i className="ui big download icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.userID}>
                            {node.username}
                        </a> {'downloaded ' + node.contentType + ' '}
                        <a href={'/slideview/' + node.contentID}>{node.contentName}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            default:
                IconNode = (<i className="ui big warning icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        Unknown type of activity
                    </div>
                );
        }
        // TODO: Unused (no likes for activities), therefore MetaNode should be removed probably, otherwise it should go below the SummaryNode
        const MetaNode = (
            <div className="meta">
                <a className="like" onClick={this.handleLike.bind(this)}>
                    <i className="like icon"></i> {node.likesNo} Likes
                </a>
            </div>
        );

        return (
            <div className="ui feed">
                <div className="event">
                    <div className="activity-icon">
                        {IconNode}
                    </div>
                    <div className="content" style={{marginLeft: '1em'}}>
                        {SummaryNode}
                    </div>
                </div>
            </div>
        );
    }
}

ActivityItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ActivityItem;
