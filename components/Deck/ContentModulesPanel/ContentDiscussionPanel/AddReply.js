import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import addReply from '../../../../actions/contentdiscussion/addReply';
import { FormattedMessage, defineMessages } from 'react-intl';

class AddReply extends React.Component {
    componentDidMount() {
        const replyValidation = {
            fields: {
                replytitle: {
                    identifier: 'replytitle'
                },
                replytext: {
                    identifier: 'replytext'
                }
            },
            onSuccess: this.handleAddReply.bind(this)
        };
        $('.ui.form.reply')
            .form(replyValidation);
    }

    handleAddReply(e) {
        e.preventDefault();
        if (this.refs.replytitle.value !== '') {
            this.context.executeAction(addReply, {
                selector: this.props.selector,
                comment: this.props.comment,
                title: this.refs.replytitle.value,
                text: this.refs.replytext.value,
                userid: this.props.userid
            });
        }
        return false;
    }

    render() {
        const form_messages = defineMessages({
            reply_text_placeholder: {
                id: 'AddReply.form.reply_text_placeholder',
                defaultMessage: 'Text',
            }
        });
        const comment = this.props.comment;
        const replyTitle = ((comment.title.startsWith('re: ')) ? '' :  're: ') + comment.title;

        return (
          <form className="ui form reply">
              <div className="ui seven wide required field">
                  <label htmlFor="replytitle">
                      <FormattedMessage 
                          id='AddReply.form.label_reply_title'
                          defaultMessage='Reply title' />
                  </label>
                  <input type="text" ref="replytitle" id="replytitle" name="replytitle" defaultValue={replyTitle} aria-required="true" required/>
              </div>
              <div className="ui field">
                  <label htmlFor="replytext">
                      <FormattedMessage
                          id='AddReply.form.label_reply_text'
                          defaultMessage='Reply text' />
                  </label>
                  <textarea ref="replytext" id="replytext" name="replytext" style={{minHeight: '6em', height: '6em'}} placeholder={this.context.intl.formatMessage(form_messages.reply_text_placeholder)} autoFocus></textarea>
              </div>
              <button tabIndex="0" type="submit" className="ui blue labeled submit icon button" >
                  <i className="icon edit"></i> 
                  <FormattedMessage
                      id='AddReply.form.button_add'
                      defaultMessage='Add Reply' />
              </button>
              <div className="ui error message"/>
          </form>
        );
    }
}

AddReply.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default AddReply;
