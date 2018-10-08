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
        selectedQuestions: the currently selected questions
    */
    checkNoEmpty(element){
        return (element.toString().length>0);
    }

    handleCheckboxClick(selectedQuestion){ //does it need the param? this is bound to it...
        /*This method:
       - adds the selectedQuestion into the selectedQuestions list if it was not selectedQuestion
       - removes the selectedQuestion from the selectedQuestions list if it was already selected
      */
        //console.log(`handleCheckboxClick`);
        console.log(selectedQuestion);
        let tempQuestions = this.props.AttachQuestionsModalStore.selectedQuestions; //has this been passed? change to the store
        let qindex = tempQuestions.indexOf(selectedQuestion);
        if(qindex === -1){//It was not selected
            tempQuestions.push(selectedQuestion);
        } else { //It was selected...remove from it
            tempQuestions[qindex]='';
            tempQuestions = tempQuestions.filter(this.checkNoEmpty);
        };

        //this.setState({ //does it have this in state?
        //    selectedQuestions: questions
        //});

        this.context.executeAction(updateSelectedQuestions,{selectedQuestions: tempQuestions},null);    
    }

    render(){
        const question = this.props.question;
        const answers = (
            <AttachQuestionsAnswersList questionIndex={this.props.questionIndex} items={question.answers} explanation={question.explanation}/>//showCorrectAnswers={this.props.showCorrectAnswers} explanation={question.explanation}
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
                        <input type="checkbox"  checked={this.props.selectedQ} ref={name} name={name} id={name} onChange={this.handleCheckboxClick.bind(this, question)}/> 
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
/*nikki put in the accordion here? for the answers */

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