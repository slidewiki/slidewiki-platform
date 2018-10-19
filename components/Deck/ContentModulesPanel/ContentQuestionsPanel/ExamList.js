import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import ExamItem from './ExamItem';
import UserProfileStore from '../../../../stores/UserProfileStore';
import DeckTreeStore from '../../../../stores/DeckTreeStore';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
import Util from '../../../common/Util';
import showCorrectExamAnswers from '../../../../actions/questions/showCorrectExamAnswers';
import addActivity from '../../../../actions/activityfeed/addActivity';
class ExamList extends React.Component {
    getPath(){
        const selector = this.props.selector;
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
    handleSubmitAnswers(e) {
        e.preventDefault();
        let questions = this.props.items;
        let errorsCount = 0;
        questions.forEach((question) => {
            const answers = question.answers;
            for(let answer of answers) {
                if (answer.selectedAnswer === undefined) {
                    answer.selectedAnswer = false;
                }
                if (answer.correct !== answer.selectedAnswer) {
                    errorsCount++;
                    break;
                }
            }
        });
        const roundedScore = Math.round((questions.length - errorsCount) / questions.length * 100);
        swal({
            title: 'Exam submitted',
            text: 'Your score: ' + roundedScore,
            type: 'success',
            showCloseButton: false,
            showCancelButton: false,
            allowEscapeKey: false,
            showConfirmButton: true
        });
        this.context.executeAction(showCorrectExamAnswers, {});
        //create an activity
        let activity = {
            activity_type: 'exam',
            user_id: String(this.props.UserProfileStore.userid),
            content_id: this.props.selector.sid,
            content_kind: this.props.selector.stype,
            exam_info: {
                score: roundedScore
            }
        };
        this.context.executeAction(addActivity, {activity: activity});
        return false;
    }
    render() {
        let showCorrectAnswers = this.props.ContentQuestionsStore.showCorrectExamAnswers;
        let list = this.props.items.map((node, index) => {
            return (
                <ExamItem question={node} key={index} questionIndex={index} selector={this.props.selector} showCorrectAnswers={showCorrectAnswers}/>
            );
        });
        return (
            <div className="ui segment">
              <form className="ui form exam" onSubmit={this.handleSubmitAnswers.bind(this)}>
                {list}
                <div className="ui hidden divider" />
                <button type="submit" className="ui blue labeled submit icon button">
                    <i className="icon checkmark"/>Submit answers
                </button>
                <button type="button" className="ui secondary labeled close icon button" onClick={this.cancelButtonClick.bind(this)}>
                    <i className="icon close" />Cancel
                </button>
              </form>
            </div>
        );
    }
}
ExamList.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ExamList = connectToStores(ExamList, [UserProfileStore, DeckTreeStore, ContentQuestionsStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState()
    };
});
export default ExamList;
