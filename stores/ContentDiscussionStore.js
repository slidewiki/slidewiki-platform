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
      //TODO
        // payload.discussion.map((comment) => {
        //     ContentDiscussionStore.clearReplyFlags(comment);
        // });
        // this.commentWithReplyBox = null;
        // this.discussion = payload.discussion;
        // this.selector = payload.selector;
        this.emitChange();
    }
    addReply(payload) {
      //TODO
        // payload.discussion.map((comment) => {
        //     ContentDiscussionStore.clearReplyFlags(comment);
        // });
        // this.commentWithReplyBox = null;
        // this.discussion = payload.discussion;
        // this.selector = payload.selector;
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
    'ADD_REPLY_SUCCESS': 'addReply'
};

export default ContentDiscussionStore;
