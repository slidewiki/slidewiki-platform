import React from 'react';

class ContentQuestionAdd extends React.Component {

    render() {

        const getAnswerChoiceFields = () => {
            let array = [];
            for (let i = 0; i < 4; i++) {
                array.push(
            <div key={i} className="inline field">
              <div className="ui checkbox">
                <input
                  type="checkbox"
                  name="example1"
                  id="answer4"
                  tabindex={0}
                  className="hidden" />
                <label htmlFor="answer4" />
              </div>
              <input
                type="text"
                style={{width: 680}}
                name="response4"
                id="response4" />
              <label htmlFor="response4" />
            </div>
          );
            }
            return array;
        };

        return (
      <div
        className="ui segment attached"
        data-reactid={636}>
        <div
          className="ui bottom attached"
          data-reactid={637}>
          <div className="ui vertical segment">
            <div className="ui two column stackable grid">
              <div className="column">
                <h3 className="ui header">
                  Question 1 of 5
                </h3>
              </div>
              <div className="column right aligned">
                <button className="ui right floated compact button blue">
                  <i className=" wizard icon" data-reactid={640} />
                </button>
              </div>
            </div>
          </div>
          <div className="ui padded segment">
            <form className="ui form">
              <div className="two fields">
                <div className="required field">
                  <label htmlFor="question">Question</label>
                  <textarea
                    rows={3}
                    name="question"
                    id="question"
                    aria-required="true">
                  </textarea>
                </div>
                <div className="ui grouped fields">
                  <fieldset>
                    <legend>Difficulty</legend>
                    <div className="inline fields">
                      <div className="field">
                        <div className="ui radio checkbox">
                          <input
                            type="radio"
                            id="easy"
                            defaultChecked
                            tabindex={0}
                            className="hidden" />
                          <label htmlFor="easy">Easy</label>
                        </div>
                      </div>
                      <div className="field">
                        <div className="ui radio checkbox">
                          <input
                            type="radio"
                            id="moderate"
                            defaultChecked
                            tabindex={0}
                            className="hidden" />
                          <label htmlFor="easy">Moderate</label>
                        </div>
                      </div>
                      <div className="field">
                        <div className="ui radio checkbox">
                          <input
                            type="radio"
                            id="Hard"
                            defaultChecked
                            tabindex={0}
                            className="hidden" />
                          <label htmlFor="easy">Hard</label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="ui grouped fields">
                <fieldset>
                  <legend>
                    Answer Choices
                  </legend>
                  {getAnswerChoiceFields()}
                </fieldset>
              </div>
              <div className="field">
                <label htmlFor="explanation">
                  Explanation (optional)
                </label>
                <textarea rows={2} id="explanation" />
              </div>
              <div className="field">
                <div className="ui container">
                  <div className="ui right floated buttons">
                    <button className="ui primary button">Save</button>
                    <button className="ui secondary button">Cancel</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
        );
    }
}

export default ContentQuestionAdd;
