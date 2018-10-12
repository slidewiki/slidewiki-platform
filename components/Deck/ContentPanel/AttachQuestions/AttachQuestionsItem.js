import React from 'react';
import PropTypes from 'prop-types';
import AttachQuestionsAnswersList from './AttachQuestionsAnswersList';
import updateSelectedQuestions  from '../../../../actions/attachQuestions/updateSelectedQuestions';
import {connectToStores} from 'fluxible-addons-react';
import AttachQuestionsModalStore from '../../../../stores/AttachQuestionsModalStore';


class AttachQuestionsItem extends React.Component {
    /* This component receives:
        question: a single question from the deckQuestions object
        selectedQ: whether or not the question is selected
        key: the key for the question
        questionIndex: the index for the question (same as key?)
        selector: the deck from which the question comes
    */

    render(){
        const question = this.props.question;
        const answers = (
            <AttachQuestionsAnswersList questionIndex={this.props.questionIndex} items={question.answers} explanation={question.explanation}/>
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

        const name = 'question' + this.props.questionIndex;

        return (

            <div className = "ui segments">
                <div className="ui two column vertically divided segment">
                    <div className="ui checkbox">
                        <input type="checkbox" onChange={this.props.onClick.bind(this)} onKeyPress={this.props.onKeyPress.bind(this)} checked={this.props.selectedQ} ref={name} name={name} id={name} /> 
                        <label htmlFor='name'>
                            {question.title}
                        </label>
                    </div>
                        {/* {this.props.questionIndex + 1}.*/}
                    <div className="ui star rating" data-rating={question.difficulty} aria-label={'difficulty level ' + question.difficulty}>
                        {difficultyStars(question.difficulty)}
                    </div>
                </div>
                {answers}
            </div>
        );
    }
}

AttachQuestionsItem.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
AttachQuestionsItem = connectToStores(AttachQuestionsItem,[AttachQuestionsModalStore],(context,props) => {
    return {
        //UserProfileStore: context.getStore(UserProfileStore).getState(),
        AttachQuestionsModalStore: context.getStore(AttachQuestionsModalStore).getState()
    };
});
export default AttachQuestionsItem;