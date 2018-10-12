import PropTypes from 'prop-types';
import React from 'react';
import {Divider} from 'semantic-ui-react';
import invertExamListFlag from '../../../../actions/questions/invertExamListFlag';
import updateExamList from '../../../../actions/questions/updateExamList';

class ExamQuestionsList extends React.Component {

    saveButtonClick() {
        this.context.executeAction(updateExamList, {questions: this.props.items});
    }
    
    cancelButtonClick() {
        this.context.executeAction(invertExamListFlag, {});
    }
    
    invertExamQuestionClick(index) {
        this.props.items[index].isExamQuestion = !this.props.items[index].isExamQuestion;
    }

    render() {
      console.log(this.props.items);
        let list = this.props.items.map((node, index) => {
            return (
                <div className="inline field" key={index}>
                    <div className="ui checkbox">
                        <input type="checkbox" name={'question' + index} id={'question' + index} tabIndex="0" className="hidden" defaultChecked={node.isExamQuestion}  onClick={this.invertExamQuestionClick.bind(this, index)}/>
                        <label htmlFor={'question' + index}>{node.title}</label>
                    </div>
                </div>
            );
        });

        return (
            <div ref="examquestionsList">
                <h3 className="ui dividing header">Exam questions</h3>
                <div >
                    {list}
                </div>
                <Divider />
                <div >
                    <button type="submit" className="ui blue labeled submit icon button" onClick={this.saveButtonClick.bind(this)}>
                        <i className="icon check" />Save
                    </button>
                    <button type="button" className="ui secondary labeled close icon button" onClick={this.cancelButtonClick.bind(this)}>
                        <i className="icon close" />Cancel
                    </button>
                </div>
                
             </div>
        );
    }
}

ExamQuestionsList.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

export default ExamQuestionsList;
