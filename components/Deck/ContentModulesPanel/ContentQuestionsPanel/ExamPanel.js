import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
import DeckViewStore from '../../../../stores/DeckViewStore';
import ExamList from './ExamList';

class ExamPanel extends React.Component {

    render() {
        const questions = this.props.ContentQuestionsStore.questions;
        const selector = this.props.ContentQuestionsStore.selector;

        let title = '';
        if  (this.props.DeckViewStore.deckData && this.props.DeckViewStore.deckData.revisions) {
            let revisions = this.props.DeckViewStore.deckData.revisions;
            title = revisions[revisions.length - 1].title + ' - ';
        }

        let questionsList = (<ExamList items={questions} selector={selector} />);
        let content = (
            <div>
                {questions.length === 0 ? 'There are currently no questions for this ' + selector.stype + '.' : questionsList}
            </div>
        );

        return (
            <div ref="examPanel" className="ui container segments">
                <div className="ui secondary segment">
                    <h3 className="ui header">{title}Exam mode</h3>
                </div>
                { content }
            </div>
        );
    }
}

ExamPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ExamPanel = connectToStores(ExamPanel, [ContentQuestionsStore, DeckViewStore], (context, props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState(),
        DeckViewStore: context.getStore(DeckViewStore).getState()
    };
});
export default ExamPanel;
