import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
// import ContentQuestionsList from './ContentQuestionsList';
// import ContentQuestionForm from './ContentQuestionForm';

class ContentQuestionsPanel extends React.Component {
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

        let html = (
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
                      <h3 className="ui  header">Questions</h3>
                    </div>
                    <div className="column right aligned">
                      <button className="ui right floated compact button primary">
                        <i
                          className="small plus icon"
                          data-reactid={640} />
                        {/* react-text: 641 */}Add question{/* /react-text */}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="ui styled fluid accordion">
                  <div className="active title">
                    <i className="dropdown icon" />
                    What is the super exciting question?
                    <div
                      className="ui star rating"
                      data-rating={1}
                      aria-label="difficulty level 1"
                      tabIndex={0} />
                    <i className="ui small yellow star icon" />
                  </div>
                  <div
                    className="active content"
                    data-reactid={653}>
                    <div className="ui two column stackable grid">
                      <div className="column">
                        <div className="ui grouped fields">
                          <fieldset>
                            <div className="field">
                              <div className="ui checkbox">
                                <input
                                  type="checkbox"
                                  name="example2"
                                  id="answer1"
                                  defaultChecked="checked" />
                                <label htmlFor="answer1">
                                  Once a week
                                </label>
                              </div>
                            </div>
                            <div className="field">
                              <div className="ui checkbox">
                                <input
                                  type="checkbox"
                                  name="answer2"
                                  id="answer2"
                                  tabIndex={0} />
                                <label htmlFor="answer2">
                                  2-3 times a week
                                </label>
                              </div>
                            </div>
                            <div className="field">
                              <div className="ui checkbox">
                                <input
                                  type="checkbox"
                                  name="answer3"
                                  id="answer3"
                                  tabIndex={0} />
                                <label htmlFor="answer3">
                                  Once a day
                                </label>
                              </div>
                            </div>
                            <div className="field">
                              <div className="ui checkbox">
                                <input
                                  type="checkbox"
                                  name="answer4"
                                  id="answer4"
                                  tabIndex={0} />
                                <label htmlFor="answer4">
                                  Twice a day
                                </label>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                      <div className="column">
                        <button className="ui compact button primary">
                          <i className=" help circle icon" />
                          Show answer
                        </button>
                        <div className="ui item">
                          <div className="content">
                            <a className="header">
                              Once a day
                            </a>
                            <div className="description">
                              <p>
                                This is an explanation of the answer
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="active title">
                    <i className="dropdown icon" />
                    Can I solve the next exciting question?
                    <div
                      className="ui star rating"
                      data-rating={2}
                      aria-label="difficulty level 2"
                      tabIndex={0} />
                    <i className="ui small orange star icon" />
                    <i className="ui small orange star icon" />
                  </div>
                  <div className="content" data-reactid={653}>
                    <div className="ui two column stackable grid">
                      <div className="column">
                        <div className="ui grouped fields">
                          <fieldset>
                            <div className="field">
                              <div className="ui checkbox">
                                <input
                                  type="checkbox"
                                  name="example2"
                                  id="answer1"
                                  defaultChecked="checked" />
                                <label htmlFor="answer1">
                                  Once a week
                                </label>
                              </div>
                            </div>
                            <div className="field">
                              <div className="ui checkbox">
                                <input
                                  type="checkbox"
                                  name="answer2"
                                  id="answer2"
                                  tabIndex={0} />
                                <label htmlFor="answer2">
                                  2-3 times a week
                                </label>
                              </div>
                            </div>
                            <div className="field">
                              <div className="ui checkbox">
                                <input
                                  type="checkbox"
                                  name="answer3"
                                  id="answer3"
                                  tabIndex={0} />
                                <label htmlFor="answer3">
                                  Once a day
                                </label>
                              </div>
                            </div>
                            <div className="field">
                              <div className="ui checkbox">
                                <input
                                  type="checkbox"
                                  name="answer4"
                                  id="answer4"
                                  tabIndex={0} />
                                <label htmlFor="answer4">
                                  Twice a day
                                </label>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                      <div className="column">
                        <button className="ui compact button primary">
                          <i className=" help circle icon" />
                          Show answer
                        </button>
                        <div className="ui item">
                          <div className="content">
                            <a className="header">
                              Once a day
                            </a>
                            <div className="description">
                              <p>
                                This is an explanation of the answer
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="active title">
                    <i className="dropdown icon" />
                    Do you find this question really hard?
                    <div
                      className="ui star rating"
                      data-rating={3}
                      aria-label="difficulty label 3"
                      tabIndex={0} />
                    <i className="ui small red star icon" />
                    <i className="ui small red star icon" />
                    <i className="ui small red star icon" />
                  </div>
                  <div className="content" data-reactid={653}>
                    <div className="ui two column stackable grid">
                      <div className="column">
                        <div className="ui grouped fields">
                          <fieldset>
                            <div className="field">
                              <div className="ui checkbox">
                                <input
                                  type="checkbox"
                                  name="example2"
                                  id="answer1"
                                  defaultChecked="checked" />
                                <label htmlFor="answer1">
                                  Once a week
                                </label>
                              </div>
                            </div>
                            <div className="field">
                              <div className="ui checkbox">
                                <input
                                  type="checkbox"
                                  name="answer2"
                                  id="answer2"
                                  tabIndex={0} />
                                <label htmlFor="answer2">
                                  2-3 times a week
                                </label>
                              </div>
                            </div>
                            <div className="field">
                              <div className="ui checkbox">
                                <input
                                  type="checkbox"
                                  name="answer3"
                                  id="answer3"
                                  tabIndex={0} />
                                <label htmlFor="answer3">
                                  Once a day
                                </label>
                              </div>
                            </div>
                            <div className="field">
                              <div className="ui checkbox">
                                <input
                                  type="checkbox"
                                  name="answer4"
                                  id="answer4"
                                  tabIndex={0} />
                                <label htmlFor="answer4">
                                  Twice a day
                                </label>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                      <div className="column">
                        <button className="ui compact button primary">
                          <i className=" help circle icon" />
                          Show answer
                        </button>
                        <div className="ui item">
                          <div className="content">
                            <a className="header">
                              Once a day
                            </a>
                            <div className="description">
                              <p>
                                This is an explanation of the answer
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

        let content = (
      <div>
        {buttonBar}
        {/* <ContentQuestionsList items={questions} /> */}
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
        {html}
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
