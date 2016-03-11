import React from 'react';
import formatDate from '../DateFormatter';

function breakLines(text) {
    return text.split('\n').map((line, key) => {
        return (
            <span key={key}>
                    {line}
                <br />
                </span>
        );
    });
}

class Comment extends React.Component {
    state = {
        replyBoxOpened: false
    };
    handleReply() {
        this.setState({
            replyBoxOpened: !this.state.replyBoxOpened
        });
    }
    render() {
        const comment = this.props.comment;
        const replyBox = (
            <form className="ui reply form">
                <div className="field">
                    <textarea style={{minHeight: '6em', height: '6em'}}></textarea>
                </div>
                <div className="ui primary submit labeled icon button">
                    <i className="icon edit"></i> Add Reply
                </div>
            </form>
        );
        return (
            <div key={this.props.key} className="comment">
                <a className="avatar">
                    {(comment.author.avatar && comment.author.avatar !== '') ? <img src={comment.author.avatar} height={16} width={16}></img> : <i className="ui icon user" />}
                </a>
                <div className="content">
                    <a className="author" href={'/user/' + comment.author.id}>{comment.author.username}</a>
                    <div className="metadata">
                        <span className="date">{formatDate(comment.date)}</span>
                    </div>
                    <div className="text">
                        <strong>{comment.title}</strong><br/>
                        {breakLines(comment.text)}
                    </div>
                    <div className="actions">
                        <a className="reply" onClick={this.handleReply.bind(this)}>Reply</a>
                    </div>
                    { this.state.replyBoxOpened ? replyBox : '' }
                </div>
                {comment.replies?<div className="comments">{comment.replies.map((reply, index) => { return (<Comment key={index} comment={reply} />); })}</div> : ''}
            </div>
        );
    }
}

export default Comment;
