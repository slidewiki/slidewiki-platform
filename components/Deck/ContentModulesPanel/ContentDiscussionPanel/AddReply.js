import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import addReply from '../../../../actions/contentdiscussion/addReply';

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
        if (this.refs.replytitle.value !== '' && this.refs.replytext.value !== '') {
            this.context.executeAction(addReply, {
                comment: this.props.comment,
                title: this.refs.replytitle.value,
                text: this.refs.replytext.value,
                userid: this.props.userid
            });
        }
        return false;
    }

    render() {
        const comment = this.props.comment;
        const replyTitle = ((comment.title.startsWith('re: ')) ? '' :  're: ') + comment.title;

        return (
          <form className="ui form reply">
              <div className="ui seven wide required field">
                  <label>Reply title</label>
                  <input type="text" ref="replytitle" id="replytitle" name="replytitle" defaultValue={replyTitle} required/>
              </div>
              <div className="ui required field">
                  <label>Reply text</label>
                  <textarea ref="replytext" id="replytext" name="replytext" style={{minHeight: '6em', height: '6em'}} placeholder="Text" autoFocus required></textarea>
              </div>
              <button tabIndex="0" type="submit" className="ui blue labeled submit icon button" >
                  <i className="icon edit"></i> Add Reply
              </button>
              <div className="ui error message"/>
          </form>
        );
    }
}

AddReply.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default AddReply;
