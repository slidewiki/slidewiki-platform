import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import invertReplyBoxFlag from '../../../../actions/contentdiscussion/invertReplyBoxFlag';
import ActivityFeedUtil from '../util/ActivityFeedUtil';
import AddReply from './AddReply';
import {navigateAction} from 'fluxible-router';
import cheerio from 'cheerio';
import DeckTreeStore from '../../../../stores/DeckTreeStore';
import TreeUtil from '../../TreePanel/util/TreeUtil';

class Comment extends React.Component {
    handleReply() {
        this.context.executeAction(invertReplyBoxFlag, {comment: this.props.comment});
    }

    //return the position of the node in the deck
    getPath(node){
        const flatTree = this.props.DeckTreeStore.flatTree;
        let path = '';
        for (let i=0; i < flatTree.size; i++) {
            if (flatTree.get(i).get('type') === node.content_kind && flatTree.get(i).get('id') === node.content_id) {
                path = flatTree.get(i).get('path');
                let nodeSelector = {id: this.props.selector.id, stype: node.content_kind, sid: node.content_id, spath: path};
                let nodeURL = TreeUtil.makeNodeURL(nodeSelector, 'deck', 'view');

                return nodeURL;
            }
        }
        return path;
    }

    handleRefClick(e) {
        e.preventDefault();

        this.context.executeAction(navigateAction, {
            url: this.getPath(this.props.activity)
        });
        // return false;
    }

    render() {
        const comment = this.props.comment;
        const replyLink = (
            <div className="actions">
                <a tabIndex="0" className="reply" onClick={this.handleReply.bind(this)}>Reply</a>
            </div>
        );

        const cheerioContentName = (node.content_name !== undefined) ? cheerio.load(node.content_name).text() : '';
        const nodeRef = (node.content_kind !== this.props.selector.stype || node.content_id.split('-')[0] !== this.props.selector.sid.split('-')[0]) ? (<span>{' (from ' + node.content_kind + ' '}<a href={this.getPath(node)} onClick={this.handleRefClick.bind(this)}>{cheerioContentName}</a>)</span>) : '';

        return (
            <div className="comment">
                <a className="avatar">
                    {(comment.author.avatar && comment.author.avatar !== '') ? <img src={comment.author.avatar} height={16} width={16}></img> : <img src='/assets/images/mock-avatars/user-alt-128.png' height={16} width={16}></img>}
                </a>
                <div className="content">
                    <a className="author" href={'/user/' + comment.author.username}>{comment.author.username}</a>
                    <div className="metadata">
                        <span className="date">{ActivityFeedUtil.formatDate(comment.timestamp)}</span>
                        {nodeRef}
                    </div>
                    <div className="text">
                        <strong>{comment.title}</strong><br/>
                        {ActivityFeedUtil.breakLines(comment.text)}
                    </div>
                    { (String(this.props.userid) !== '') ? replyLink : ''}
                    { comment.replyBoxOpened ? (<AddReply comment={comment} userid={this.props.userid}/>) : '' }
                </div>
                {comment.replies ? <div className="comments">{comment.replies.map((reply, index) => { return (<Comment key={index} comment={reply} userid={this.props.userid}/>); })}</div> : ''}
            </div>
        );
    }
}

Comment.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
Comment = connectToStores(Comment, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default Comment;
