import React from 'react';
import selectExamAnswer from '../../../../actions/questions/selectExamAnswer';
class ExamAnswersItem extends React.Component {
    handleOnChange() {
        this.context.executeAction(selectExamAnswer, {
            questionIndex: this.props.questionIndex,
            answerIndex: this.props.index,
            selected: this.refs[this.props.name].checked
        });
    }
    render() {
        const answer = this.props.answer;
        const name = this.props.name;
        const showCorrectAnswers = this.props.showCorrectAnswers;
        if (answer.selectedAnswer === undefined) {
            answer.selectedAnswer = false;
        }
        let answerIcon = (<i className="icon" />);
        if (showCorrectAnswers) {
            if (answer.correct && answer.selectedAnswer) {
                answerIcon = (<i className="checkmark icon teal" />);
            } else if (answer.correct && !answer.selectedAnswer) {
                answerIcon = (<i className="checkmark icon red" />);
            } else if (!answer.correct && answer.selectedAnswer) {
                answerIcon = (<i className="delete icon red" />);
            }
        }
        return (
            <div className="field">
                <div className="ui checkbox">
                    <input type="checkbox" ref={name} name={name} id={name} onChange={this.handleOnChange.bind(this)}/>
                    <label htmlFor={name}>
                        {answerIcon} {answer.answer}
                    </label>
                </div>
            </div>
        );
    }
}
ExamAnswersItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default ExamAnswersItem;
