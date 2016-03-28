import React from 'react';

class ContentQuestionsItem extends React.Component {
    render() {
        const question = this.props.data;

        let difficultyIcon = '';
        switch (question.difficulty){
          case 1:
            difficultyIcon = (<i className="star icon green"></i>);
            break;
          case 2:
            difficultyIcon = (<i className="star icon olive"></i>);
            break;
          case 3:
            difficultyIcon = (<i className="star icon yellow"></i>);
            break;
          case 4:
            difficultyIcon = (<i className="star icon orange"></i>);
            break;
          case 5:
            difficultyIcon = (<i className="star icon red"></i>);
            break;
        }

        return (
            <div className="item">
              {difficultyIcon}
              <div className="content">
                <div className="header">{question.title}</div>
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
