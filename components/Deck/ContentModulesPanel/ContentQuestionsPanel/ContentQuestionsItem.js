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

        // const editIcon = (
        //     <a className="like" onClick={this.handleEditClick.bind(this)}>
        //         <i className="edit icon" />
        //     </a>
        // );

        // let difficultyClass = '';
        // switch (question.difficulty) {
        //     case 1:
        //         difficultyClass = 'empty star icon orange';
        //         break;
        //     case 2:
        //         difficultyClass = 'star half empty icon orange';
        //         break;
        //     case 3:
        //         difficultyClass = 'star icon orange';
        //         break;
        // }

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
            // <div className="item">
            // <i className={difficultyClass}></i>
            // <div className="content">
            //     <div className="header">
            //     <span style={{cursor: 'pointer'}} onClick={this.handleToggleAnwers.bind(this)}>{question.title}</span> {editIcon}
            // </div>
            //     {question.answersShown ? answers : ''}
            //     <div className="description">
            //         <span>{'by '}</span>
            //         <a className="user" href={'/user/' + question.userID}>
            //             {question.username}
            //         </a>
            //         <span>{' ' + question.Date}</span>
            //     </div>
            // </div>
            // </div>
            <div>
            <div className="active title">
              <i className="dropdown icon" />
              {question.title}
              <div
                className="ui star rating"
                data-rating={question.difficulty}
                aria-label={'difficulty level ' + question.difficulty}
                tabIndex={0} />
              {difficultyStars(question.difficulty)}
            </div>
            <div
              className="active content"
              data-reactid={653}>
              <div className="ui two column stackable grid">
                <div className="column">
                  <div className="ui grouped fields">
                    <fieldset>
                      <div className="field">
                        <div className="ui checkbox">
                          <input
                            type="checkbox"
                            name="example2"
                            id="answer1"
                            defaultChecked="checked" />
                          <label htmlFor="answer1">
                            Once a week
                          </label>
                        </div>
                      </div>
                      <div className="field">
                        <div className="ui checkbox">
                          <input
                            type="checkbox"
                            name="answer2"
                            id="answer2"
                            tabIndex={0} />
                          <label htmlFor="answer2">
                            2-3 times a week
                          </label>
                        </div>
                      </div>
                      <div className="field">
                        <div className="ui checkbox">
                          <input
                            type="checkbox"
                            name="answer3"
                            id="answer3"
                            tabIndex={0} />
                          <label htmlFor="answer3">
                            Once a day
                          </label>
                        </div>
                      </div>
                      <div className="field">
                        <div className="ui checkbox">
                          <input
                            type="checkbox"
                            name="answer4"
                            id="answer4"
                            tabIndex={0} />
                          <label htmlFor="answer4">
                            Twice a day
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
                <div className="column">
                  <button className="ui compact button primary">
                    <i className=" help circle icon" />
                    Show answer
                  </button>
                  <div className="ui item">
                    <div className="content">
                      <a className="header">
                        Once a day
                      </a>
                      <div className="description">
                        <p>
                          This is an explanation of the answer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
