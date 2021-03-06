import PropTypes from 'prop-types';
import React from 'react';
import {Divider} from 'semantic-ui-react';
import invertExamListFlag from '../../../../actions/questions/invertExamListFlag';
import updateExamList from '../../../../actions/questions/updateExamList';
import { FormattedMessage } from 'react-intl';

class ExamQuestionsList extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            modifiedSelections: []
        };
    }
    
    saveButtonClick() {
        this.context.executeAction(updateExamList, {modifiedSelections: this.state.modifiedSelections});
    }
    
    cancelButtonClick() {
        this.context.executeAction(invertExamListFlag, {});
    }
    
    invertExamQuestionClick(index) {
        let modifiedSelectionIndex = this.state.modifiedSelections.findIndex((modifiedSelection) => modifiedSelection.id === this.props.items[index].id);
        if (modifiedSelectionIndex > -1) {
            this.state.modifiedSelections.splice(modifiedSelectionIndex, 1);
        } else {
            const newValue = !this.props.items[index].isExamQuestion;
            this.state.modifiedSelections.push({id: this.props.items[index].id, is_exam_question: newValue});
        }
    }

    render() {
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
                <h3 className="ui dividing header">
                    <FormattedMessage
                        id='ExamQuestionsList.form.header'
                        defaultMessage='Select exam questions' />
                </h3>
                <div >
                    {list}
                </div>
                <Divider />
                <div >
                    <button type="submit" className="ui blue labeled submit icon button" onClick={this.saveButtonClick.bind(this)}>
                        <i className="icon check" />
                        <FormattedMessage
                            id='ExamQuestionsList.form.button_save'
                            defaultMessage='Save' />
                    </button>
                    <button type="button" className="ui secondary labeled close icon button" onClick={this.cancelButtonClick.bind(this)}>
                        <i className="icon close" />
                        <FormattedMessage
                            id='ExamQuestionsList.form.button_cancel'
                            defaultMessage='Cancel' />
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
