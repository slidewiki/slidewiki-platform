import React from 'react';
import PropTypes from 'prop-types';
import AttachQuestionsAnswersList from './AttachQuestionsAnswersList';
import updateSelectedQuestions  from '../../../../actions/attachQuestions/updateSelectedQuestions';
import {connectToStores} from 'fluxible-addons-react';
import AttachQuestionsModalStore from '../../../../stores/AttachQuestionsModalStore';


class AttachQuestionsItem extends React.Component {
    /* This component receives:
        question: a single question from the deckQuestions object
        key: the key for the question
        questionIndex: the index for the question
        selector: the deck from which the question comes
    */
    checkNoEmpty(element){
        return (element.toString().length>0);
    }

    handleCheckboxClick(selectedQuestion){ //does it need the param? this is bound to it...
        /*This method:
       - adds the selectedQuestion into the selectedQuestions list if it was not selectedQuestion
       - removes the selectedQuestion from the selectedQuestions list if it was already selected
      */
        console.log(selectedQuestion);
        let questions = this.props.selectedQuestions; //has this been passed?
        let index = questions.indexOf(selectedQuestion);
        if(index === -1){//It was not selected
            questions.push(selectedQuestion);
        } else { //It was selected...remove from it
            questions[index]='';
            questions = questions.filter(this.checkNoEmpty);
        };

        this.setState({
            selectedQuestions: questions
        });

        this.context.executeAction(updateSelectedQuestions,{selectedQuestions:questions},null);
        //console.log(this.props.AttachQuestionsModalStore.selectedQuestions);/*nikki remove after */
        //console.log(this);
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

        //let activeIfFirst = this.props.index === 0 ? 'active' : ''; // something wrong with accordion - doesn't expand
        /*nikki check back here */    

        const name = 'question' + this.props.questionIndex;
 //needs some form of checkboxes
        return (

            <div className = "ui segments">
                <div className="ui two column vertically divided segment">
                    <div className="ui checkbox">
                        <input type="checkbox" ref={name} name={name} id={name} onChange={this.handleCheckboxClick.bind(this,question)}/> 
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
/*nikki  //onChange={this.handleOnClick.bind(this)}*/

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