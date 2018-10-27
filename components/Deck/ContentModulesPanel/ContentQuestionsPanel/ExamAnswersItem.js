import React from 'react';
import selectExamAnswer from '../../../../actions/questions/selectExamAnswer';
class ExamAnswersItem extends React.Component {
    handleOnChange() {
        if (!this.props.showCorrectAnswers) {
            this.context.executeAction(selectExamAnswer, {
                questionIndex: this.props.originalQIndex,
                answerIndex: this.props.index,
                selected: this.refs[this.props.name].checked
            });
        }
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
                answerIcon = (<i className="checkmark icon teal" aria-label="your answer was correct" />);
            } else if (answer.correct && !answer.selectedAnswer) {
                answerIcon = (<i className="checkmark icon red" aria-label="the correct answer which you didn't select"/>);
            } else if (!answer.correct && answer.selectedAnswer) {
                answerIcon = (<i className="delete icon red" aria-label="your answer was incorrect answer"/>);
            }
        }
        let inputCheckbox = (showCorrectAnswers) ? (<input type="checkbox" ref={name} name={name} id={name} checked={answer.selectedAnswer} />) : (<input type="checkbox" ref={name} name={name} id={name} onChange={this.handleOnChange.bind(this)} />);
        return (
            <div className="field">
                <div className="ui checkbox">
                    {inputCheckbox}
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
