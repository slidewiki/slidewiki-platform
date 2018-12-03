import PropTypes from 'prop-types';
import React from 'react';
import ExamAnswersItem from './ExamAnswersItem';
import { defineMessages } from 'react-intl';
class ExamAnswersList extends React.Component {
    render() {
        const form_messages = defineMessages({
            explanation: {
                id: 'ExamAnswersList.form.explanation',
                defaultMessage: 'Explanation:',
            },
            answer_incorrect: {
                id: 'ExamAnswersList.form.answer_incorrect',
                defaultMessage: 'Your answer to the question was incorrect',
            }
        });
        let wrongAnswer = false;
        for (let answer of this.props.items) {
            if (answer.selectedAnswer === undefined) {
                answer.selectedAnswer = false;
            }
            if (answer.correct !== answer.selectedAnswer) {
                wrongAnswer = true;
                break;
            }
        }
        let explanation = (this.props.explanation.trim() !== '') ? this.context.intl.formatMessage(form_messages.explanation) + ' ' + this.props.explanation : '';
        let wrongAnswerInfo = (this.props.showCorrectAnswers && wrongAnswer) ? (<div><i className="big delete icon red" aria-label={this.context.intl.formatMessage(form_messages.answer_incorrect)} tabIndex={0}/>{explanation}</div>) : '';
        let list = this.props.items.map((node, index) => {
            return (
                <ExamAnswersItem answer={node} originalQIndex={this.props.originalQIndex} questionIndex={this.props.questionIndex} name={'q' + this.props.questionIndex + 'a' + index} index={index} key={index} showCorrectAnswers={this.props.showCorrectAnswers}/>
            );
        });
        return (
            <div>
                {list}
                {wrongAnswerInfo}
            </div>
        );
    }
}

ExamAnswersList.contextTypes = {
    intl: PropTypes.object.isRequired
};

export default ExamAnswersList;
