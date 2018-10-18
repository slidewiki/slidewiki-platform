import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import AttachQuestionsAnswersItem from './AttachQuestionsAnswersItem';
import AttachQuestionsModalStore from '../../../../stores/AttachQuestionsModalStore';
import { Accordion } from 'semantic-ui-react';

class AttachQuestionsAnswersList extends React.Component{

    //
    componentDidMount() {
        this.enableAccordion();
    }

    componentDidUpdate() {
        this.refreshAccordion();
    }

    enableAccordion(status) {
        let accordionDIV = this.refs.attachquestionsanswers;
        $(accordionDIV).find('.ui.accordion').accordion({
            exclusive: false
        });
    }

    refreshAccordion(status) {
        let accordionDIV = this.refs.attachquestionsanswers;
        $(accordionDIV).find('.ui.accordion').accordion('refresh');
    }

    render(){
        let answersList = this.props.items.map((node, index) => {
            return (
                <AttachQuestionsAnswersItem answer={node} name={'answer' + index} key={index}/>
            );
        });
        let explanation = `Explanation: ${this.props.explanation}`;
        return (
            <div className="ui segment questions unpadded" ref="attachquestionsanswers">
                <div className="ui accordion">
                <div ref="attachquestionanswersList" className='title' tabIndex="0">
                    <i className="dropdown icon" />
                    Show Answers
                </div>
                <div className='content'>
                    <div className="ui two column list">
                        <div>{answersList}</div>
                        <div>{this.props.explanation ? explanation : ''}</div>
                    </div>
                </div>
            </div>
            </div>
        );
    } 
}

export default AttachQuestionsAnswersList;