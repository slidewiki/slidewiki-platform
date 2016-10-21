import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import invertReplyBoxFlag from '../../../../actions/contentdiscussion/invertReplyBoxFlag';
import ActivityFeedUtil from '../util/ActivityFeedUtil';
import AddReply from './AddReply';

class Comment extends React.Component {
    handleReply() {
        this.context.executeAction(invertReplyBoxFlag, {comment: this.props.comment});
    }

    render() {
        const comment = this.props.comment;
        const replyLink = (
            <div className="actions">
                <a tabIndex="0" className="reply" onClick={this.handleReply.bind(this)}>Reply</a>
            </div>
        );

        return (
            <div className="comment">
                <a className="avatar">
                    {(comment.author.avatar && comment.author.avatar !== '') ? <img src={comment.author.avatar} height={16} width={16}></img> : <img src='/assets/images/mock-avatars/user-alt-128.png' height={16} width={16}></img>}
                </a>
                <div className="content">
                    <a className="author" href={'/user/' + comment.author.username}>{comment.author.username}</a>
                    <div className="metadata">
                        <span className="date">{ActivityFeedUtil.formatDate(comment.timestamp)}</span>
                    </div>
                    <div className="text">
                        <strong>{comment.title}</strong><br/>
                        {ActivityFeedUtil.breakLines(comment.text)}
                    </div>
                    { (String(this.props.userid) !== '') ? replyLink : ''}
                    { comment.replyBoxOpened ? (<AddReply comment={comment}/>) : '' }
                </div>
                {comment.replies ? <div className="comments">{comment.replies.map((reply, index) => { return (<Comment key={index} comment={reply} userid={this.props.userid}/>); })}</div> : ''}
            </div>
        );
    }
}

Comment.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default Comment;
