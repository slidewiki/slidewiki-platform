import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentDiscussionStore from '../../../../stores/ContentDiscussionStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import Comment from './Comment';
import AddComment from './AddComment';
import invertCommentBoxFlag from '../../../../actions/contentdiscussion/invertCommentBoxFlag';

class ContentDiscussionPanel extends React.Component {

    handleInvertCommentBox() {
        this.context.executeAction(invertCommentBoxFlag, {});
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
            (<AddComment/>)
            :
            (<button tabIndex="0" className="ui blue labeled icon button" onClick={this.handleInvertCommentBox.bind(this)}>
                <i className="icon plus"></i> Add comment
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
