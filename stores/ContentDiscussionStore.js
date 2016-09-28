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
        try {
            payload.discussion.map((comment) => {
                ContentDiscussionStore.clearReplyFlags(comment);
            });
        }
        catch (e) { //no data there
            console.log('ContentDiscussionStore updateDiscussion', e);
            this.discussion = [];
        }
        this.commentWithReplyBox = null;
        this.discussion = payload.discussion;
        this.selector = payload.selector;
        this.emitChange();
    }
    addComment(payload) {
        this.discussion.unshift(payload.comment);//add to the beginning
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
