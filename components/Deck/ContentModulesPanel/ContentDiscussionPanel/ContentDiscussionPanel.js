import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentDiscussionStore from '../../../../stores/ContentDiscussionStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import Comment from './Comment';
import AddComment from './AddComment';
import invertCommentBoxFlag from '../../../../actions/contentdiscussion/invertCommentBoxFlag';
import { FormattedMessage, defineMessages } from 'react-intl';

class ContentDiscussionPanel extends React.Component {

    handleInvertCommentBox() {
        this.context.executeAction(invertCommentBoxFlag, {});
    }

    render() {
        const form_messages = defineMessages({
            no_comments: {
                id: 'ContentDiscussionPanel.form.no_comments',
                defaultMessage: 'There are currently no comments for this',
            }
        });
        const selector = (this.props.selector !== undefined && this.props.selector !== {}) ? this.props.selector : this.props.ContentDiscussionStore.selector;
        let addComment = (this.props.ContentDiscussionStore.showCommentBox) ?
            (<AddComment selector={selector} />)
            :
            (<button tabIndex="0" className="ui blue labeled icon button" onClick={this.handleInvertCommentBox.bind(this)}>
                <i className="icon plus"></i> 
                <FormattedMessage
                    id='ContentDiscussionPanel.form.button_add'
                    defaultMessage='Add comment' />
            </button>);

        return (
            <div className="ui comments" style={{maxWidth: 'none'}}>
                { (String(this.props.UserProfileStore.userid) !== '') ? addComment : ''}
                <h3 className="ui dividing header">
                    <FormattedMessage
                        id='ContentDiscussionPanel.form.comments'
                        defaultMessage='Comments' />
                </h3>
                {(this.props.ContentDiscussionStore.discussion.length === 0) ?
                    <div>{this.context.intl.formatMessage(form_messages.no_comments) + ' ' + selector.stype}.</div>
                    :
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {this.props.ContentDiscussionStore.discussion.map((comment, index) => { return (<Comment key={index} comment={comment} userid={this.props.UserProfileStore.userid} selector={selector}/>); })}
                    </div>
                }
            </div>
        );
    }
}

ContentDiscussionPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

ContentDiscussionPanel = connectToStores(ContentDiscussionPanel, [ContentDiscussionStore, UserProfileStore], (context, props) => {
    return {
        ContentDiscussionStore: context.getStore(ContentDiscussionStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default ContentDiscussionPanel;
