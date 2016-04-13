import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
import ContentQuestionsList from './ContentQuestionsList';

class ContentQuestionsPanel extends React.Component {
      render() {

        let buttonBar = "";
        switch(this.props.ContentQuestionsStore.selector.stype){
          case 'slide':
            buttonBar = (
              <button className="ui button blue">
                <i className="plus icon"></i>
                Add question
              </button>
            );
            break;
          case 'deck':
            buttonBar = (
              <div className="ui buttons">
                <button className="ui button tial">Exam mode</button>
                <button className="ui button tial">Test mode</button>
                <button className="ui button blue">
                  <i className="file pdf outline icon"></i>
                  Export to PDF
                </button>
              </div>
            );
            break;
        }

        return (
            <div ref="contentQuestionsPanel" className="ui bottom attached segment">
                <div>
                  {buttonBar}
                </div>
                <div>
                  <ContentQuestionsList items={this.props.ContentQuestionsStore.questions} />
                </div>
            </div>
        );
    }
}

ContentQuestionsPanel = connectToStores(ContentQuestionsPanel, [ContentQuestionsStore], (context, props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState()
    };
});
export default ContentQuestionsPanel;
