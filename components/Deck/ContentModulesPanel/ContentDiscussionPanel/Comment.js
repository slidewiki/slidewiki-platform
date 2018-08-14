import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import invertReplyBoxFlag from '../../../../actions/contentdiscussion/invertReplyBoxFlag';
import deleteComment from '../../../../actions/contentdiscussion/deleteComment';
import hideComment from '../../../../actions/contentdiscussion/hideComment';
import ActivityFeedUtil from '../util/ActivityFeedUtil';
import AddReply from './AddReply';
import {navigateAction} from 'fluxible-router';
import cheerio from 'cheerio';
import DeckTreeStore from '../../../../stores/DeckTreeStore';
import PermissionsStore from '../../../../stores/PermissionsStore';
import Util from '../../../common/Util';
import UserPicture from '../../../common/UserPicture';

class Comment extends React.Component {
    handleReply(e) {
        e.preventDefault();
        this.context.executeAction(invertReplyBoxFlag, {comment: this.props.comment});
        return false;
    }

    //return the position of the node in the deck
    getPath(node){
        const savedDeckTreeStore = (this.props.DeckTreeStore) ? this.props.DeckTreeStore : this.props.savedDeckTreeStore;

        const flatTree = savedDeckTreeStore.flatTree;
        let path = '';
        for (let i=0; i < flatTree.size; i++) {
            if (flatTree.get(i).get('type') === node.content_kind && flatTree.get(i).get('id') === node.content_id) {
                path = flatTree.get(i).get('path');
                let nodeSelector = {id: this.props.selector.id, stype: node.content_kind, sid: node.content_id, spath: path};
                let nodeURL = Util.makeNodeURL(nodeSelector, 'deck', 'view', undefined, undefined, true);

                return nodeURL;
            }
        }
        return path;
    }

    handleRefClick(e) {
        e.preventDefault();

        this.context.executeAction(navigateAction, {
            url: this.getPath(this.props.comment)
        });
        // return false;
    }

    handleDeleteComment(comment) {
        if (comment.id !== undefined && comment.id !== '') {
            if (comment.replies && comment.replies.length > 0) {//there are replies - hide comment
              this.context.executeAction(hideComment, {
                  id: comment.id
              });
            } else {
                this.context.executeAction(deleteComment, {
                    id: comment.id
                });
            }
        }
    }

    render() {
        const comment = this.props.comment;
        const replyLink = (
            <div className="actions">
                <a href="#" tabIndex="0" className="reply" onClick={this.handleReply.bind(this)}>Reply</a>
            </div>
        );

        const cheerioContentName = (comment.content_name) ? cheerio.load(comment.content_name).text() : '';
        const nodeRef = (comment.content_kind !== this.props.selector.stype || comment.content_id.split('-')[0] !== this.props.selector.sid.split('-')[0]) ? (<span>{' (from ' + comment.content_kind + ' '}<a href={this.getPath(comment)} onClick={this.handleRefClick.bind(this)}>{cheerioContentName}</a>)</span>) : '';

        const savedDeckTreeStore = (this.props.DeckTreeStore) ? this.props.DeckTreeStore : this.props.savedDeckTreeStore;
        const savedPermissionsStore = (this.props.PermissionsStore) ? this.props.PermissionsStore : this.props.savedPermissionsStore;

        let deletePermission = (String(this.props.userid) === comment.user_id) || (savedPermissionsStore.permissions.admin || savedPermissionsStore.permissions.edit);

        let commentContent = (comment.visibility === false) ?
            <div className="text">
                <i>{'Comment was removed'}</i><br/>
            </div> :
            <div className="text">
                <strong>{comment.title}</strong><br/>
                {ActivityFeedUtil.breakLines(comment.text)}
            </div> ;
        return (
            <div className="comment">
                <a className="avatar">
                    <UserPicture picture={ comment.author.avatar } username={ comment.author.username } avatar={ true } width= { 30 } />
                </a>
                <div className="content">
                    <a className="author" href={'/user/' + comment.author.username}>{comment.author.username}</a>
                    <div className="metadata">
                        <span className="date">{ActivityFeedUtil.formatDate(comment.timestamp)}</span>
                        {nodeRef}
                        {deletePermission ? (
                            <div>
                                <button className="ui basic icon tiny button" title='Delete comment' aria-label='Delete comment' onClick={this.handleDeleteComment.bind(this, comment)}>
                                    <i className="remove icon" ></i>
                                </button>
                            </div>
                        ) : ''}
                    </div>
                    {commentContent}
                    { (String(this.props.userid) !== '') ? replyLink : ''}
                    { comment.replyBoxOpened ? (<AddReply comment={comment} userid={this.props.userid}/>) : '' }
                </div>
                {comment.replies ? <div className="comments">{comment.replies.map((reply, index) => { return (<Comment key={index} comment={reply} userid={this.props.userid} selector={this.props.selector} savedDeckTreeStore={savedDeckTreeStore} savedPermissionsStore={savedPermissionsStore}/>); })}</div> : ''}
            </div>
        );
    }
}

Comment.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
Comment = connectToStores(Comment, [DeckTreeStore, PermissionsStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});
export default Comment;
