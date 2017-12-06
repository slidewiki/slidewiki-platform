import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import addComment from '../../../../actions/contentdiscussion/addComment';
import invertCommentBoxFlag from '../../../../actions/contentdiscussion/invertCommentBoxFlag';

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
        return (
            <form className="ui form comment">
                <div className="ui seven wide required field">
                    <label htmlFor="title">Comment title</label>
                    <input type="text" ref="title" id="title" name="title" placeholder="Title" aria-required="true" autoFocus required />
                </div>
                <div className="ui field">
                    <label htmlFor="text">Comment text</label>
                    <textarea ref="text" id="text" name="text" style={{minHeight: '6em', height: '6em'}} placeholder="Text" ></textarea>
                </div>

                <button tabIndex="0" type="submit" className="ui blue labeled submit icon button" >
                    <i className="icon check"></i> Submit
                </button>
                <button tabIndex="0" type="button" className="ui secondary labeled close icon button" onClick={this.handleInvertCommentBox.bind(this)}>
                    <i className="icon close"></i> Cancel
                </button>
                <div className="ui error message"/>
            </form>
        );
    }
}

AddComment.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

AddComment = connectToStores(AddComment, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default AddComment;
