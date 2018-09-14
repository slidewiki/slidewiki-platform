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
        /*nikki add accordion here? Does it need the activeIfFirst bit? since we don't really want the first one open...*/
        /*nikki what does the data-reactid do? */
        return (
            <div className="ui segment" ref="attachquestionsanswers">
                <div className="ui accordion">
                <div ref="attachquestionanswersList" className='title'>
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
/*nikki previously in the return section
            <div ref="contentquestionanswersList">
                <div className="ui relaxed list">
                    {answersList}
                </div>
            </div> */

export default AttachQuestionsAnswersList;