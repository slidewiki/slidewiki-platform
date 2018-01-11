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

            <ContentQuestionAnswersList items={question} selector={this.props.selector} />
        );
        {/*
            //Merge conflict with branch 1451 above. which is newer version?          
             <ContentQuestionAnswersList items={question.answers} explanation={question.explanation} />
        */}
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

        let activeIfFirst = this.props.index === 0 ? 'active' : ''; // something wrong with accordion - doesn't expand

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
            <div className={activeIfFirst + ' title'}>
              <i className="dropdown icon" />
              {question.title}
              <div className="ui star rating" data-rating={question.difficulty} aria-label={'difficulty level ' + question.difficulty} tabIndex={0} />
                  {difficultyStars(question.difficulty)}
              </div>
            <div
              className={activeIfFirst + ' content'}
              data-reactid={653}>
              {answers}
            </div>
            </div>
        );
    }
}

ContentQuestionsItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ContentQuestionsItem;
