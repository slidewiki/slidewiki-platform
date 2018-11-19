import React from 'react';

class ContentQuestionAnswersItem extends React.Component {

    render() {
        const answer = this.props.answer;
        //const answerListSymbol = `${this.props.number + 1}) `;
        return (
            <li className="questionsList" >
                {answer.answer}
            </li>

        );
    }
}

export default ContentQuestionAnswersItem;
