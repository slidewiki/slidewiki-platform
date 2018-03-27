import React from 'react';
import ExamAnswersItem from './ExamAnswersItem';

class ExamAnswersList extends React.Component {

    render() {
        let wrongAnswer = false;

        for(let answer of this.props.items) {
            if (answer.selectedAnswer === undefined) {
                answer.selectedAnswer = false;
            }
            if (answer.correct !== answer.selectedAnswer) {
                wrongAnswer = true;
                break;
            }
        }
        let explanation = (this.props.showCorrectAnswers && wrongAnswer && this.props.explanation.trim() !== '') ?
            <div className="description">
                <p>
                    <label><strong>Explanation:</strong></label> {this.props.explanation}
                </p>
            </div>
        : '';

        let list = this.props.items.map((node, index) => {
            return (
                <ExamAnswersItem answer={node} questionIndex={this.props.questionIndex} name={'q' + this.props.questionIndex + 'a' + index} index={index} key={index} showCorrectAnswers={this.props.showCorrectAnswers}/>
            );
        });

        let answers = (
            <div className="ui two column stackable grid">
                <div className="column">
                    <div className="ui grouped fields">
                        <fieldset>
                            {list}
                            {explanation}
                        </fieldset>
                    </div>
                </div>
            </div>
        );

        return (
            <div ref="contentquestionanswersList">
                <div className="ui relaxed list">
                    {answers}
                </div>
            </div>
        );
    }
}

export default ExamAnswersList;
