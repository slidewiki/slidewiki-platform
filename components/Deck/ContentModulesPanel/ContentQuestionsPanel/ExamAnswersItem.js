import React from 'react';
import PropTypes from 'prop-types';
import selectExamAnswer from '../../../../actions/questions/selectExamAnswer';
import { defineMessages } from 'react-intl';
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
        const form_messages = defineMessages({
            answer_correct: {
                id: 'ExamAnswersItem.form.answer_correct',
                defaultMessage: 'your answer was correct',
            },
            answer_not_selected: {
                id: 'ExamAnswersItem.form.answer_not_selected',
                defaultMessage: 'the correct answer which you did not select',
            },
            answer_incorrect: {
                id: 'ExamAnswersItem.form.answer_incorrect',
                defaultMessage: 'your answer was incorrect',
            }
        });
        const answer = this.props.answer;
        const name = this.props.name;
        const showCorrectAnswers = this.props.showCorrectAnswers;
        if (answer.selectedAnswer === undefined) {
            answer.selectedAnswer = false;
        }
        let answerIcon = (<i className="icon" />);
        if (showCorrectAnswers) {
            if (answer.correct && answer.selectedAnswer) {
                answerIcon = (<i className="checkmark icon teal" aria-label={this.context.intl.formatMessage(form_messages.answer_correct)} />);
            } else if (answer.correct && !answer.selectedAnswer) {
                answerIcon = (<i className="checkmark icon red" aria-label={this.context.intl.formatMessage(form_messages.answer_not_selected)} />);
            } else if (!answer.correct && answer.selectedAnswer) {
                answerIcon = (<i className="delete icon red" aria-label={this.context.intl.formatMessage(form_messages.answer_incorrect)} />);
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
    executeAction: React.PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};
export default ExamAnswersItem;
