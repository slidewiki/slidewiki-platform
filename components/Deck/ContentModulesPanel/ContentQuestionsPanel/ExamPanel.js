import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
import DeckViewStore from '../../../../stores/DeckViewStore';
import DeckTreeStore from '../../../../stores/DeckTreeStore';
import Util from '../../../common/Util';
import ExamList from './ExamList';

class ExamPanel extends React.Component {
    getPath(){
        const selector = this.props.ContentQuestionsStore.selector;
        if (selector.id === undefined || selector.id === 'undefined') {//this can happen when exam has not been opened from the deck view
            return '/' + selector.stype + '/' + selector.sid;
        } else {
            const flatTree = this.props.DeckTreeStore.flatTree;
            let path = '';
            for (let i=0; i < flatTree.size; i++) {
                if (flatTree.get(i).get('type') === selector.stype && flatTree.get(i).get('id').split('-')[0] === selector.sid.split('-')[0]) {
                    path = flatTree.get(i).get('path');
                    let nodeSelector = {id: selector.id, stype: selector.stype, sid: selector.sid.split('-')[0], spath: path};
                    let nodeURL = Util.makeNodeURL(nodeSelector, 'deck', 'view', undefined, undefined, true);
                    return nodeURL;
                }
            }
            return path;
        }
    }
    cancelButtonClick(e) {
        e.preventDefault();
        this.context.executeAction(navigateAction, {
            url: this.getPath()
        });
    }
    render() {
        const questions = this.props.ContentQuestionsStore.questions;
        let examQuestions = [];
        questions.forEach((question) => {
            if (question.isExamQuestion) {
                question.originalQIndex = questions.indexOf(question);
                examQuestions.push(question);
            }
        });
        const selector = this.props.ContentQuestionsStore.selector;
        let title = '';
        if  (this.props.DeckViewStore.deckData && this.props.DeckViewStore.deckData.revisions) {
            let revisions = this.props.DeckViewStore.deckData.revisions;
            title = revisions[revisions.length - 1].title + ' - ';
        }
        let questionsList = (<ExamList items={examQuestions} selector={selector} />);
        let noExamQuestionsNotification = (
            <div>
                <h4>There are currently no exam questions for this {selector.stype}.</h4>
                <button type="button" className="ui blue labeled close icon button" onClick={this.cancelButtonClick.bind(this)}>
                    <i className="icon angle left" />Back
                </button>
            </div>
        );
        
        return (
            <div ref="examPanel" className="ui container segments">
                <div className="ui secondary segment">
                    <h1 className="ui medium header">{title}Exam mode</h1>
                </div>
                {examQuestions.length !== 0 ? noExamQuestionsNotification : questionsList}
            </div>
        );
    }
}
ExamPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ExamPanel = connectToStores(ExamPanel, [ContentQuestionsStore, DeckTreeStore, DeckViewStore], (context, props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        DeckViewStore: context.getStore(DeckViewStore).getState()
    };
});
export default ExamPanel;
