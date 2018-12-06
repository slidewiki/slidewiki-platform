import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import addComment from '../../../../actions/contentdiscussion/addComment';
import invertCommentBoxFlag from '../../../../actions/contentdiscussion/invertCommentBoxFlag';
import { FormattedMessage, defineMessages } from 'react-intl';

class AddComment extends React.Component {
    componentDidMount() {
        const commentValidation = {
            fields: {
                title: {
                    identifier: 'title'
                },
                text: {
                    identifier: 'text'
                }
            },
            onSuccess: this.handleAddComment.bind(this)
        };
        $('.ui.form.comment')
            .form(commentValidation);
    }

    handleAddComment(e) {
        e.preventDefault();
        if (this.refs.title.value !== '') {
            this.context.executeAction(addComment, {
                selector: this.props.selector,
                title: this.refs.title.value,
                text: this.refs.text.value,
                userid: this.props.UserProfileStore.userid
            });

            this.refs.title.value = '';
            this.refs.text.value = '';
        }
        return false;
    }

    handleInvertCommentBox() {
        this.context.executeAction(invertCommentBoxFlag, {});
    }

    render() {
        const form_messages = defineMessages({
            comment_title_placeholder: {
                id: 'AddComment.form.comment_title_placeholder',
                defaultMessage: 'Title',
            },
            comment_text_placeholder: {
                id: 'AddComment.form.comment_text_placeholder',
                defaultMessage: 'Text',
            }
        });
        return (
          <form className="ui form comment">
              <div className="ui seven wide required field">
                  <label htmlFor="title">
                      <FormattedMessage
                          id='AddComment.form.label_comment_title'
                          defaultMessage='Comment title' />
                  </label>
                  <input type="text" ref="title" id="title" name="title" placeholder={this.context.intl.formatMessage(form_messages.comment_title_placeholder)} aria-required="true" autoFocus required />
              </div>
              <div className="ui field">
                  <label htmlFor="text">
                      <FormattedMessage
                          id='AddComment.form.label_comment_text'
                          defaultMessage='Comment text' />
                  </label>
                  <textarea ref="text" id="text" name="text" style={{minHeight: '6em', height: '6em'}} placeholder={this.context.intl.formatMessage(form_messages.comment_text_placeholder)} ></textarea>
              </div>

              <button tabIndex="0" type="submit" className="ui blue labeled submit icon button" >
                  <i className="icon check"></i> 
                  <FormattedMessage
                      id='AddComment.form.button_submit'
                      defaultMessage='Submit' />
              </button>
              <button tabIndex="0" type="button" className="ui secondary labeled close icon button" onClick={this.handleInvertCommentBox.bind(this)}>
                  <i className="icon close"></i>
                  <FormattedMessage
                      id='AddComment.form.button_cancel'
                      defaultMessage='Cancel' />
              </button>
              <div className="ui error message"/>
          </form>
        );
    }
}

AddComment.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

AddComment = connectToStores(AddComment, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default AddComment;
