import PropTypes from 'prop-types';
import React from 'react';
//import {Divider} from 'semantic-ui-react';
//import invertExamListFlag from '../../../../actions/questions/invertExamListFlag';
//import updateExamList from '../../../../actions/questions/updateExamList';
import updateDownloadQuestions from '../../../../../actions/questions/updateDownloadQuestions';

class QuestionDownloadList extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            downloadQuestions: [] //change this
        };
    }
    
    checkNoEmpty(element){//nikki check
        return (element.toString().length>0);
    }

    handleQuestionClick(selectedQuestion){//nikki check
        /*This method:
       - adds the selectedQuestion into the selectedQuestions list if it was not selectedQuestion
       - removes the selectedQuestion from the selectedQuestions list if it was already selected
      */
        console.log('onclick');
        let questiontoadd = {
            title: selectedQuestion.title,
            answers: selectedQuestion.answers,
            explanation: selectedQuestion.explanation,
            difficulty: selectedQuestion.difficulty,
        };
        let tempquestions = Object.assign([], this.state.downloadQuestions);
        let index = tempquestions.indexOf(questiontoadd);
        if(index === -1){//It was not selected
            tempquestions.push(questiontoadd);
        } else { //It was selected...remove from it
            tempquestions[index]='';
            tempquestions = tempquestions.filter(this.checkNoEmpty);
        };

        this.setState({
            downloadQuestions: tempquestions
        });

        this.context.executeAction(updateDownloadQuestions,{downloadQuestions:tempquestions},null);
    }

    handleKeyPress = (event, param, selectedQuestion) => {
        if(event.key === 'Enter'){
            //console.log('enter key');
            if(param === 'handleQuestionClick') {
                //console.log(selectedQuestion);
                this.handleQuestionClick(selectedQuestion);
            }
        }
    }

    inSelectedQuestions(question){
        let questions = this.state.downloadQuestions;
        let questiontocheck = {
            title: question.title,
            answers: question.answers,
            explanation: question.explanation,
            difficulty: question.difficulty,
        };
        let qindex = questions.indexOf(questiontocheck); //will this work??
        if(qindex === -1){
            return false;
        } else { 
            return true;
        };
    }

    render() {
        let questionslist = this.props.questions.map((node, index) => {
            return (
                <div className="inline field" key={index}>
                    <div className="ui checkbox">
                        <input type="checkbox" name={'question' + index} id={'question' + index} tabIndex="0" className="hidden" checked={this.inSelectedQuestions(node)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleQuestionClick', node)} onChange={this.handleQuestionClick.bind(this, node)}/>
                        <label htmlFor={'question' + index}>{node.title}</label>
                    </div>
                </div>
            );
        });

        return (
            <div ref="downloadquestionsList">
                <h3 className="ui dividing header">Select questions to download</h3>
                <div >
                    {questionslist}
                </div>
             </div>
        );
    }
}

QuestionDownloadList.contextTypes = {
    executeAction: PropTypes.func.isRequired
};


export default QuestionDownloadList;
