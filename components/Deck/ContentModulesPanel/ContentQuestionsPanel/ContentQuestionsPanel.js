import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import fetchUser from '../../../../actions/user/userprofile/fetchUser';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
import DeckViewStore from '../../../../stores/DeckViewStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import ContentQuestionsList from './ContentQuestionsList';
// import ContentQuestionForm from './ContentQuestionForm';

class ContentQuestionsPanel extends React.Component {
    render() {
        const questions = this.props.ContentQuestionsStore.questions;
        const question = this.props.ContentQuestionsStore.question;
        const selector = this.props.ContentQuestionsStore.selector;
        const creatorId = this.props.DeckViewStore.creatorData._id;
        const userId = this.props.UserProfileStore.userid;

    // Button bar differs for Slide and Folder
        let buttonBar = '';
        switch(selector.stype){
            case 'slide':
                buttonBar = (
        <button className='ui button blue'>
          <i className='plus icon'>
          </i>
          Add question
        </button>
      );
                break;
            case 'deck':
                buttonBar = (
        <div className='ui buttons'>
          <button className='ui button'>
            Exam mode
          </button>
          <button className='ui button'>
            Test mode
          </button>
          <button className='ui button blue'>
            <i className='file pdf outline icon'>
            </i>
            Export to PDF
          </button>
        </div>
      );
                break;
        }

        let addQuestionButton = (
          <div className="column right aligned">
            <button className="ui right floated compact button primary">
              <i
                className="small plus icon"
                data-reactid={640} />
              {/* react-text: 641 */}Add question{/* /react-text */}
            </button>
          </div>
        );

        const getUserButton = () => {
            if(userId && creatorId === userId){
                return addQuestionButton;
            }
            return null;
        };

        let questionsHeader = (
      <div
        className="ui segment attached"
        data-reactid={636}>
        <div
          className="ui bottom attached"
          data-reactid={637}>
          <div data-reactid={638}>
            <div className="ui vertical segment">
              <div className="ui two column stackable grid">
                <div className="column">
                  <h3 className="ui  header">Questions
            <div className="ui label red">Prototype interface - not functional</div></h3>
                </div>
                {getUserButton()}
              </div>
            </div>
            {content}
          </div>
        </div>
      </div>

    );

        let content = (
      <div>
        {buttonBar}
        {questionsHeader}
        <ContentQuestionsList items={questions} />
      </div>
    );

    //   if (question !== undefined && question !== null) {
    // //Question is selected -> show its data
    //       content = (
    //   <div>
    //     <ContentQuestionForm question={question} />
    //   </div>
    // );
    //   }

        return (
      <div
        ref="contentQuestionsPanel"
        className="ui bottom attached">
        {content}
      </div>
        );
    }
}
ContentQuestionsPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ContentQuestionsPanel = connectToStores(ContentQuestionsPanel, [ContentQuestionsStore, DeckViewStore, UserProfileStore], (context, props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState(),
        DeckViewStore: context.getStore(DeckViewStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
    };
});
export default ContentQuestionsPanel;
