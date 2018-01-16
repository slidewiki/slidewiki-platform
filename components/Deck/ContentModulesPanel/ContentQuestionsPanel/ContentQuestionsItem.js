import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import cheerio from 'cheerio';
import ContentQuestionAnswersList from './ContentQuestionAnswersList';
import toggleAnswers from '../../../../actions/questions/toggleAnswers';
import DeckTreeStore from '../../../../stores/DeckTreeStore';

class ContentQuestionsItem extends React.Component {
    //return the position of the node in the deck
    getPath(question){
        const flatTree = this.props.savedDeckTreeStore.flatTree;
        let path = '';
        for (let i=0; i < flatTree.size; i++) {
            if (flatTree.get(i).get('type') === question.relatedObject && flatTree.get(i).get('id') === question.relatedObjectId) {
                path = flatTree.get(i).get('path');
                let nodeSelector = {id: this.props.selector.id, stype: question.relatedObject, sid: question.relatedObjectId, spath: path};
                let nodeURL = TreeUtil.makeNodeURL(nodeSelector, 'deck', 'view');

                return nodeURL;
            }
        }
        return path;
    }

    handleRefClick(e) {
        e.preventDefault();

        this.context.executeAction(navigateAction, {
            url: this.getPath(this.props.question)
        });
        // return false;
    }

    handleToggleAnwers() {
        this.context.executeAction(toggleAnswers, {question: this.props.question});
    }
    render() {
        const question = this.props.question;
        const answers = (
            <ContentQuestionAnswersList qstid={question.id} items={question.answers} explanation={question.explanation} />
        );

        //HEAD of 1602:
        //<ContentQuestionAnswersList items={question} selector={this.props.selector} />

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

        const cheerioContentName = (question.relatedObjectName) ? cheerio.load(question.relatedObjectName).text() : '';
        const nodeRef = (question.relatedObject !== this.props.selector.stype || question.relatedObjectId !== this.props.selector.sid.split('-')[0]) ? (<span>{' (from ' + question.relatedObject + ' '}<a href={this.getPath(question)} onClick={this.handleRefClick.bind(this)}>{cheerioContentName}</a>)</span>) : '';

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
                  {nodeRef}
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
ContentQuestionsItem = connectToStores(ContentQuestionsItem, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default ContentQuestionsItem;
