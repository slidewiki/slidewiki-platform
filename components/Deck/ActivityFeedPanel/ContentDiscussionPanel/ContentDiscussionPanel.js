import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentDiscussionStore from '../../../../stores/ContentDiscussionStore';
import formatDate from '../DateFormatter';

class ContentDiscussionPanel extends React.Component {
    breakLines(text) {
        return text.split('\n').map((line, key) => {
            return (
                <span key={key}>
                    {line}
                    <br />
                </span>
            );
        });
    }
    formatComment(comment, index) {
        return (
            <div key={index} className="comment">
                <a className="avatar">
                    <i className="ui icon user" />
                </a>
                <div className="content">
                    <a className="author" href={'/user/' + comment.author.id}>{comment.author.username}</a>
                    <div className="metadata">
                        <span className="date">{formatDate(comment.date)}</span>
                    </div>
                    <div className="text">
                        <strong>{comment.title}</strong><br/>
                        {this.breakLines(comment.text)}
                    </div>
                    <div className="actions">
                        <a className="reply">Reply</a>
                    </div>
                </div>
                {comment.replies?<div className="comments">{comment.replies.map((reply, index) => {return this.formatComment(reply, index);})}</div> : ''}
            </div>
        );
    }
    render() {
        let oldWay = (
            <div ref="contentDiscussionPanel" className="ui segment">
                Discussion related to {this.props.ContentDiscussionStore.selector.stype} #{this.props.ContentDiscussionStore.selector.sid}.
                <br/>
                <NavLink href={'/discussion/' + this.props.ContentDiscussionStore.selector.stype + '/' + this.props.ContentDiscussionStore.selector.sid}>{'/discussion/' + this.props.ContentDiscussionStore.selector.stype + '/' + this.props.ContentDiscussionStore.selector.sid}</NavLink>
            </div>
        );
        return (
            <div className="ui comments" style={{maxWidth: 'none'}}>
                <form className="ui reply form">
                    <div className="field">
                        <textarea style={{minHeight: '6em', height: '6em'}}></textarea>
                    </div>
                    <div className="ui blue labeled submit icon button">
                        <i className="icon edit"></i> Add Comment
                    </div>
                </form>
                <h3 class="ui dividing header">Comments</h3>
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {this.props.ContentDiscussionStore.discussion.map(this.formatComment.bind(this))}
                </div>
            </div>
        );
    }
}

ContentDiscussionPanel = connectToStores(ContentDiscussionPanel, [ContentDiscussionStore], (context, props) => {
    return {
        ContentDiscussionStore: context.getStore(ContentDiscussionStore).getState()
    };
});
export default ContentDiscussionPanel;
