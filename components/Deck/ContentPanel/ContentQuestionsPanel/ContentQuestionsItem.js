import React from 'react';
import ContentQuestionAnswersList from './ContentQuestionAnswersList';

class ContentQuestionsItem extends React.Component {

    render() {
        const question = this.props.data;

        let difficultyIcon = '';
        switch (question.difficulty){
          case 1:
            difficultyIcon = (<i className="empty star icon orange"></i>);
            break;
          case 2:
            difficultyIcon = (<i className="star half empty icon orange"></i>);
            break;
          case 3:
            difficultyIcon = (<i className="star icon orange"></i>);
            break;
        }

        return (
            <div className="item">
              {difficultyIcon}
              <div className="content">
                <div className="header">{question.title}</div>
                <ContentQuestionAnswersList items={question.answers} />
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

export default ContentQuestionsItem;
