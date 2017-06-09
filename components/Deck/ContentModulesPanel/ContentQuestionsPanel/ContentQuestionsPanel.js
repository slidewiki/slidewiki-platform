import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
import ContentQuestionsList from './ContentQuestionsList';
import ContentQuestionAdd from './ContentQuestionAdd';
// import ContentQuestionForm from './ContentQuestionForm';

class ContentQuestionsPanel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            showAddPanel: false,
        };
        this.handleAddClick = this.handleAddClick.bind(this);
    }

    handleAddClick() {
        this.setState({
            showAddPanel: !this.state.showAddPanel,
        });
    }

    render() {
        const questions = this.props.ContentQuestionsStore.questions;
        const question = this.props.ContentQuestionsStore.question;
        const selector = this.props.ContentQuestionsStore.selector;

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
                <div className="column right aligned">
                  <button
                    className="ui right floated compact button primary"
                    onClick={this.handleAddClick}
                  >
                    <i
                      className="small plus icon"
                      data-reactid={640} />
                    {/* react-text: 641 */}Add question{/* /react-text */}
                  </button>
                </div>
              </div>
            </div>
            {content}
          </div>
        </div>
      </div>

    );

        let content = (
      <div>
        {this.state.showAddPanel ?
          <ContentQuestionAdd /> :
          <div>
            {buttonBar}
            {questionsHeader}
            <ContentQuestionsList items={questions} />
          </div>}
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

ContentQuestionsPanel = connectToStores(ContentQuestionsPanel, [ContentQuestionsStore], (context, props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState()
    };
});
export default ContentQuestionsPanel;
