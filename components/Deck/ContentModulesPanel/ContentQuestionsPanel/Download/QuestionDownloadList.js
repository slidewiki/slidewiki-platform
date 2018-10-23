import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentQuestionsStore from '../../../../../stores/ContentQuestionsStore';
import updateDownloadQuestions from '../../../../../actions/questions/updateDownloadQuestions';
import QuestionDownloadItem from './QuestionDownloadItem';

class QuestionDownloadList extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            downloadQuestions: [] 
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            downloadQuestions: nextProps.ContentQuestionsStore.downloadQuestions,
        });
    }

    checkNoEmpty(element){
        return (element.toString().length>0);
    }

    handleQuestionClick(selectedQuestion){
        /*This method:
       - adds the selectedQuestion into the downloadQuestions list if it was not already there
       - removes the selectedQuestion from the downloadQuestions list if it was already selected
      */
        let questiontoadd = selectedQuestion;
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

        let qindex = questions.indexOf(question);
        if(qindex === -1){
            return false;
        } else { 
            return true;
        };
    }

    render() {
        let questionslist = this.props.questions.map((node, index) => {
            return (
                <QuestionDownloadItem question={node} onClick={() => this.handleQuestionClick(node)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleQuestionClick', node)} selectedQ={this.inSelectedQuestions(node)} key={index} questionIndex={index}/>
            );
        });

        return (
            <div ref="downloadquestionsList">
                <h3 className="ui dividing header">Select questions to download</h3>
                <button className="ui right floated compact button primary" onClick={this.props.handleSelectAll.bind(this)}>
                    <i className="small check icon" />
                    Select all
                </button>
                <div >
                    {questionslist}
                </div>
             </div>
        );
    }

/////////////////
}

QuestionDownloadList.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

QuestionDownloadList = connectToStores(QuestionDownloadList,[ContentQuestionsStore],(context,props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState(),
    };
});

export default QuestionDownloadList;