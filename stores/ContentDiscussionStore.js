import {BaseStore} from 'fluxible/addons';

class ContentDiscussionStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.discussion = [];
        this.selector = {};
        this.commentWithReplyBox = null;
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
        this.discussion.push(payload.comment);
        this.emitChange();
    }
    findComment(array, identifier) {
        for(let i = 0; i < array.length; i++) {
            let comment = array[i];
            if (comment.id === identifier) {
                return comment;
            } else if (comment.replies !== undefined) {
                return (this.findComment(comment.replies, identifier));
            }
        };

        return null;
    }
    addReply(payload) {
        let parentComment = this.findComment(this.discussion, payload.parent_comment);
        if (parentComment.replies === undefined) {
            parentComment.replies = [];
        }
        parentComment.replies.push(payload);

        //close reply box
        if (this.commentWithReplyBox) this.commentWithReplyBox.replyBoxOpened = false;
        this.commentWithReplyBox = null;

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
    getState() {
        return {
            discussion: this.discussion,
            selector: this.selector,
            commentWithReplyBox: this.commentWithReplyBox
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.discussion = state.discussion;
        this.selector = state.selector;
        this.commentWithReplyBox = state.commentWithReplyBox;
    }
}

ContentDiscussionStore.storeName = 'ContentDiscussionStore';
ContentDiscussionStore.handlers = {
    'LOAD_CONTENT_DISCUSSION_SUCCESS': 'updateDiscussion',
    'INVERT_REPLY_BOX_FLAG': 'invertReplyBoxFlag',
    'ADD_COMMENT_SUCCESS': 'addComment',
    'ADD_REPLY_SUCCESS': 'addReply',
    'ADD_DUMMY_COMMENT': 'addComment',
    'ADD_DUMMY_REPLY': 'addReply'
};

export default ContentDiscussionStore;
