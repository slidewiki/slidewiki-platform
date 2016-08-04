import React from 'react';
import cancelQuestion from '../../../../actions/questions/cancelQuestion';

class ContentQuestionForm extends React.Component {

    handleCancelClick() {
        this.context.executeAction(cancelQuestion);
    }

    render() {
        const question = this.props.question;

        return (
            <div>
                <form className="ui form">
                    <h4 className="ui dividing header">Question</h4>
                    <div className="field">
                        <textarea placeholder="Question" rows="3"></textarea>
                    </div>
                    <h4 className="ui dividing header">Answers</h4>
                    <div className="ui buttons">
                        <div onClick={this.handleCancelClick.bind(this)} className="ui labeled icon button">
                            <i className="chevron left icon"></i> Cancel
                        </div>
                        <div className="ui submit primary right labeled icon button">
                            <i className="checkmark icon"></i> Save
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

ContentQuestionForm.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ContentQuestionForm;
