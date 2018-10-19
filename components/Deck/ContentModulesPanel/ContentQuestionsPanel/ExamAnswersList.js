import React from 'react';
import ExamAnswersItem from './ExamAnswersItem';
class ExamAnswersList extends React.Component {
    render() {
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
        let explanation = (this.props.explanation.trim() !== '') ? 'Explanation: ' + this.props.explanation : '';
        let wrongAnswerInfo = (this.props.showCorrectAnswers && wrongAnswer) ? (<div><i className="big delete icon red" aria-label="Your answer to the question was incorrect" tabIndex={0}/>{explanation}</div>) : '';
        let list = this.props.items.map((node, index) => {
            return (
                <ExamAnswersItem answer={node} questionIndex={this.props.questionIndex} name={'q' + this.props.questionIndex + 'a' + index} index={index} key={index} showCorrectAnswers={this.props.showCorrectAnswers}/>
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
export default ExamAnswersList;
