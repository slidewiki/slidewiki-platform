import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import DeckViewStore from '../../../../stores/DeckViewStore';
import ContentQuestionsList from './ContentQuestionsList';

class ExamPanel extends React.Component {

    render() {
        const questions = this.props.ContentQuestionsStore.questions;
        const selector = this.props.ContentQuestionsStore.selector;
        const userId = this.props.UserProfileStore.userid;

        let title = '';
        if  (this.props.DeckViewStore.deckData && this.props.DeckViewStore.deckData.revisions) {
            let revisions = this.props.DeckViewStore.deckData.revisions;
            title = revisions[revisions.length - 1].title + ' - ';
        }
        let questionsHeader = (
            <div className="ui segment attached" >
                <div className="ui two column stackable grid">
                    <div className="column">
                        <h3 className="ui  header">{title}Exam mode</h3>
                    </div>
                </div>

            </div>
        );

        let questionsList = (<ContentQuestionsList items={questions} selector={selector} editPermission={false}/>);
        let content = (
            <div>
                {questions.length === 0 ? 'There are currently no questions for this ' + selector.stype + '.' : questionsList}
            </div>
        );

        return (
            <div ref="examPanel" className="ui bottom attached">
                {questionsHeader}
                { content }
            </div>
        );
    }
}

ExamPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ExamPanel = connectToStores(ExamPanel, [ContentQuestionsStore, UserProfileStore, DeckViewStore], (context, props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        DeckViewStore: context.getStore(DeckViewStore).getState()
    };
});
export default ExamPanel;
