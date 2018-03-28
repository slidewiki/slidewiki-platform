import React from 'react';
import ExamAnswersList from './ExamAnswersList';

class ExamItem extends React.Component {

    render() {
        const question = this.props.question;
        const answers = (
            <ExamAnswersList questionIndex={this.props.questionIndex} items={question.answers} showCorrectAnswers={this.props.showCorrectAnswers} explanation={question.explanation}/>
        );

        let difficultyStars = (difficulty) => {
            let difficultyClass = '';
            switch (difficulty) {
                case 1:
                    difficultyClass = 'ui small yellow star icon';
                    break;
                case 2:
                    difficultyClass = 'ui small orange star icon';
                    break;
                case 3:
                    difficultyClass = 'ui small red star icon';
                    break;
            }
            let difficultyStars = [];
            for(let i = 0; i < difficulty; i++){
                difficultyStars.push(<i key={i} className={difficultyClass} />);
            }
            return difficultyStars;
        };

        return (
            <div>
                <div className="ui three column vertically divided grid segment">
                    <div className="one wide column">
                        {this.props.questionIndex + 1}.
                        <div className="ui star rating" data-rating={question.difficulty} aria-label={'difficulty level ' + question.difficulty} tabIndex={0} />
                        {difficultyStars(question.difficulty)}
                    </div>
                    <div className="seven wide column">
                        <h4>
                            {question.title}
                        </h4>
                    </div>
                    <div className="eight wide column">
                        {answers}
                    </div>
                </div>
            </div>
        );
    }
}

export default ExamItem;
