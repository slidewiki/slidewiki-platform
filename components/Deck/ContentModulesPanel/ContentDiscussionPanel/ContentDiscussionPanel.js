import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentDiscussionStore from '../../../../stores/ContentDiscussionStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import Comment from './Comment';
import addComment from '../../../../actions/contentdiscussion/addComment';
import invertCommentBoxFlag from '../../../../actions/contentdiscussion/invertCommentBoxFlag';

class ContentDiscussionPanel extends React.Component {
    handleAddComment(e) {
        e.preventDefault();
        if (this.refs.title.value === '') {
            if (this.refs.commenttext.value === '') {
                $('.ui.form').form('add errors', ['Please enter comment title and text']);
            } else {
                $('.ui.form').form('add errors', ['Please enter comment title']);
            }
        } else if (this.refs.commenttext.value === '') {
            $('.ui.form').form('add errors', ['Please enter comment text']);
        } else {
            this.context.executeAction(addComment, {
                selector: this.props.ContentDiscussionStore.selector,
                title: this.refs.title.value,
                text: this.refs.commenttext.value,
                userid: this.props.UserProfileStore.userid
            });

            this.refs.title.value = '';
            this.refs.text.value = '';
        }
        return false;
    }

    handleInvertCommentBox(e) {
        e.preventDefault();
        this.context.executeAction(invertCommentBoxFlag, {});
        return false;
    }

    render() {
        let oldWay = (
            <div ref="contentDiscussionPanel" className="ui segment">
                Discussion related to {this.props.ContentDiscussionStore.selector.stype} #{this.props.ContentDiscussionStore.selector.sid}.
                <br/>
                <NavLink href={'/discussion/' + this.props.ContentDiscussionStore.selector.stype + '/' + this.props.ContentDiscussionStore.selector.sid}>{'/discussion/' + this.props.ContentDiscussionStore.selector.stype + '/' + this.props.ContentDiscussionStore.selector.sid}</NavLink>
            </div>
        );
        let addComment = (this.props.ContentDiscussionStore.showCommentBox) ?
            (<form className="ui comment form">
                <div className="ui input">
                    <input type="text" ref="title" id="title" name="title" placeholder="Title" aria-required="true"/>
                </div>
                <div className="field">
                    <textarea ref="commenttext" id="commenttext" name="commenttext" style={{minHeight: '6em', height: '6em'}} placeholder="Text" aria-required="true"></textarea>
                </div>
                <div className="ui error message"></div>
                <button tabIndex="0" type="submit" className="ui blue labeled submit icon button" onClick={this.handleAddComment.bind(this)}>
                    <i className="icon edit"></i> Submit
                </button>
                <button tabIndex="0" className="ui blue labeled close icon button" onClick={this.handleInvertCommentBox.bind(this)}>
                    <i className="icon close"></i> Cancel
                </button>
            </form>)
            :
            (<button tabIndex="0" className="ui blue labeled icon button" onClick={this.handleInvertCommentBox.bind(this)}>
                <i className="icon edit"></i> Add comment
            </button>);

        return (
            <div className="ui comments" style={{maxWidth: 'none'}}>
                { (String(this.props.UserProfileStore.userid) !== '') ? addComment : ''}
                <h3 className="ui dividing header">Comments</h3>
                {(this.props.ContentDiscussionStore.discussion.length === 0)
                    ?
                    <div>There are currently no comments for this {this.props.ContentDiscussionStore.selector.stype}.</div>
                    :
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {this.props.ContentDiscussionStore.discussion.map((comment, index) => { return (<Comment key={index} comment={comment} userid={this.props.UserProfileStore.userid} />); })}
                    </div>
                }
            </div>
        );
    }
}

ContentDiscussionPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

ContentDiscussionPanel = connectToStores(ContentDiscussionPanel, [ContentDiscussionStore, UserProfileStore], (context, props) => {
    return {
        ContentDiscussionStore: context.getStore(ContentDiscussionStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default ContentDiscussionPanel;
