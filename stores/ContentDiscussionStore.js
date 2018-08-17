import {BaseStore} from 'fluxible/addons';

class ContentDiscussionStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.discussion = [];
        this.selector = {};
        this.commentWithReplyBox = null;
        this.showCommentBox = false;
    }
    static clearReplyFlags(comment) {
        comment.replyBoxOpened = false;
        if (comment.replies) comment.replies.map((reply) => {
            ContentDiscussionStore.clearReplyFlags(reply);
        });
    }
    updateDiscussion(payload) {
        payload.discussion.map((comment) => {
            ContentDiscussionStore.clearReplyFlags(comment);
        });
        this.commentWithReplyBox = null;
        this.discussion = payload.discussion;
        this.selector = payload.selector;
        this.emitChange();
    }
    addComment(payload) {
        this.discussion.unshift(payload.comment);//add to the beginning
        this.showCommentBox = false;
        this.emitChange();
    }

    //Find comment in a tree with id = identifier
    findComment(array, identifier) {
        for(let i = 0; i < array.length; i++) {
            let comment = array[i];
            if (comment.id === identifier) {
                return comment;
            } else if (comment.replies !== undefined) {
                let commentFound = this.findComment(comment.replies, identifier);
                if (commentFound !== null)
                    return commentFound;
            }
        }

        return null;
    }
    addReply(payload) {
        let replyComment = payload.comment;
        let parentComment = this.findComment(this.discussion, replyComment.parent_comment);
        if (parentComment !== null) {//found parent comment
            if (parentComment.replies === undefined) {//first reply
                parentComment.replies = [];
            }
            parentComment.replies.push(replyComment);
        }

        //close reply box
        if (this.commentWithReplyBox) this.commentWithReplyBox.replyBoxOpened = false;
        this.commentWithReplyBox = null;

        this.emitChange();
    }
    findAndDelete(array, id) {
        for(let i = 0; i < array.length; i++) {
            let comment = array[i];
            if (comment.id === id) {
                array.splice(i, 1);
                return true;
            } else if (comment.replies !== undefined) {
                let commentFound = this.findAndDelete(comment.replies, id);
                return commentFound;
            }
        }
    }
    deleteComment(payload) {
        let commentDeleted = this.findAndDelete(this.discussion, payload.id);
        if (commentDeleted) {
            this.emitChange();
        } else {
            console.log('Delete comment failed', payload);
        }
    }
    hideComment(payload) {
        let comment = this.findComment(this.discussion, payload.id);
        if (comment !== null) {//found comment
            comment.visibility = false;
        }

        this.emitChange();
    }
    invertReplyBoxFlag(payload) {
        let comment = payload.comment;
        if (comment.replyBoxOpened) {
            comment.replyBoxOpened = false;
            this.commentWithReplyBox = null;
        }
        else {
            comment.replyBoxOpened = true;
            if (this.commentWithReplyBox) this.commentWithReplyBox.replyBoxOpened = false;
            this.commentWithReplyBox = comment;
        }
        this.emitChange();
    }
    invertCommentBoxFlag() {
        this.showCommentBox = !this.showCommentBox;
        this.emitChange();
    }

    getState() {
        return {
            discussion: this.discussion,
            selector: this.selector,
            commentWithReplyBox: this.commentWithReplyBox,
            showCommentBox: this.showCommentBox
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.discussion = state.discussion;
        this.selector = state.selector;
        this.commentWithReplyBox = state.commentWithReplyBox;
        this.showCommentBox = state.showCommentBox;
    }
}

ContentDiscussionStore.storeName = 'ContentDiscussionStore';
ContentDiscussionStore.handlers = {
    'LOAD_CONTENT_DISCUSSION_SUCCESS': 'updateDiscussion',
    'INVERT_REPLY_BOX_FLAG': 'invertReplyBoxFlag',
    'INVERT_COMMENT_BOX_FLAG': 'invertCommentBoxFlag',
    'ADD_COMMENT_SUCCESS': 'addComment',
    'ADD_REPLY_SUCCESS': 'addReply',
    'DELETE_COMMENT_SUCCESS': 'deleteComment',
    'HIDE_COMMENT_SUCCESS': 'hideComment'
};

export default ContentDiscussionStore;
