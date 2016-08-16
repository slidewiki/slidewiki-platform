import React from 'react';
import ContentQuestionAnswersList from './ContentQuestionAnswersList';
import loadQuestion from '../../../../actions/questions/loadQuestion';
import toggleAnswers from '../../../../actions/questions/toggleAnswers';

class ContentQuestionsItem extends React.Component {
    handleEditClick() {
        this.context.executeAction(loadQuestion, {
            qstid: this.props.question.id
        });
    }

    handleToggleAnwers() {
        this.context.executeAction(toggleAnswers, {question: this.props.question});
    }
    render() {
        const question = this.props.question;
        const answers = (
            <ContentQuestionAnswersList items={question.answers} />
        );

        const editIcon = (
            <a className="like" onClick={this.handleEditClick.bind(this)}>
                <i className="edit icon" />
            </a>
        );

        let difficultyClass = '';
        switch (question.difficulty) {
            case 1:
                difficultyClass = 'empty star icon orange';
                break;
            case 2:
                difficultyClass = 'star half empty icon orange';
                break;
            case 3:
                difficultyClass = 'star icon orange';
                break;
        }

        return (
            <div className="item">
            <i className={difficultyClass}></i>
            <div className="content">
                <div className="header">
                <span style={{cursor: 'pointer'}} onClick={this.handleToggleAnwers.bind(this)}>{question.title}</span> {editIcon}
            </div>
                {question.answersShown ? answers : ''}
                <div className="description">
                    <span>{'by '}</span>
                    <a className="user" href={'/user/' + question.userID}>
                        {question.username}
                    </a>
                    <span>{' ' + question.Date}</span>
                </div>
            </div>
            </div>
        );
    }
}

ContentQuestionsItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ContentQuestionsItem;
