import React from 'react';
import addCommentAnnotation from '../../actions/annotations/addCommentAnnotation';

/**
 * Created by akorovin on 01.03.2017.
 */
class AddCommentAnnotation extends React.Component {
    handleAddComment(e) {
        e.preventDefault();
        console.log('Add comment');
        let commentText = this.refs.annoTextAreaComment.value;
        if (!commentText) return;

        this.context.executeAction(addCommentAnnotation, {
            comment: commentText,
            type: 'Person'
        });
    }
    render() {
        return (
            <div className="ui">
                <form className="ui form upload">
                    <div className="field">
                        <label htmlFor="comment-anno-text">Add comment</label>
                        <textarea rows="4" aria-labelledby="comment-anno-text" id="comment-anno-text" ref="annoTextAreaComment" />
                    </div>
                    <div className="ui buttons">
                        <div className="ui primary button" aria-label="Create deck" role="button" tabIndex="0" onClick={this.handleAddComment.bind(this)} >
                            Add Comment
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

AddCommentAnnotation.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default AddCommentAnnotation;
