import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import invertReplyBoxFlag from '../../../../actions/activityfeed/contentdiscussion/invertReplyBoxFlag';
import ActivityFeedUtil from '../util/ActivityFeedUtil';
import ContentDiscussionStore from '../../../../stores/ContentDiscussionStore';
import addReply from '../../../../actions/activityfeed/contentdiscussion/addReply';

class Comment extends React.Component {
    handleReply() {
        this.context.executeAction(invertReplyBoxFlag, {comment: this.props.comment});
    }

    handleAddReply(e) {
        e.preventDefault();
        if (this.refs.title.value !== '' && this.refs.text.value !== '') {
            this.context.executeAction(addReply, {
                comment: this.props.comment,
                title: this.refs.title.value,
                text: this.refs.text.value
            });
        }
        return false;
    }

    render() {
        const comment = this.props.comment;
        const replyBox = (
            <form className="ui reply form">
                <div className="ui input">
                    <input type="text" ref="title" placeholder="Title" required/>
                </div>
                <div className="field">
                    <textarea ref="text" style={{minHeight: '6em', height: '6em'}} placeholder="Text" required></textarea>
                </div>
                <button tabIndex="0" className="ui primary submit labeled icon button" onClick={this.handleAddReply.bind(this)}>
                    <i className="icon edit"></i> Add Reply
                </button>
            </form>
        );
        return (
            <div className="comment">
                <a className="avatar">
                    {(comment.author.avatar && comment.author.avatar !== '') ? <img src={comment.author.avatar} height={16} width={16}></img> : <i className="ui icon user" />}
                </a>
                <div className="content">
                    <a className="author" href={'/user/' + comment.author.id}>{comment.author.username}</a>
                    <div className="metadata">
                        <span className="date">{ActivityFeedUtil.formatDate(comment.timestamp)}</span>
                    </div>
                    <div className="text">
                        <strong>{comment.title}</strong><br/>
                        {ActivityFeedUtil.breakLines(comment.text)}
                    </div>
                    <div className="actions">
                        <a tabIndex="0" className="reply" onClick={this.handleReply.bind(this)}>Reply</a>
                    </div>
                    { comment.replyBoxOpened ? replyBox : '' }
                </div>
                {comment.replies?<div className="comments">{comment.replies.map((reply, index) => { return (<Comment key={index} comment={reply} />); })}</div> : ''}
            </div>
        );
    }
}

Comment.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

Comment = connectToStores(Comment, [ContentDiscussionStore], (context, props) => {
    return {
        ContentDiscussionStore: context.getStore(ContentDiscussionStore).getState()
    };
});
export default Comment;
