import React from 'react';
import ContentQuestionAnswersItem from './ContentQuestionAnswersItem';

class ContentQuestionAnswersList extends React.Component {
    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <ContentQuestionAnswersItem answer={node} name={'answer' + index} key={index}/>
            );
        });

        let correctAnswers = this.props.items.filter((item) => item.correct).map((node, index) => {
            return (
              <div key={index}>
                <a className="header">
                  {node.answer}
                </a>
                <div className="description">
                  <p>
                    {node.explanation}
                  </p>
                </div>
              </div>
            );
        });

        let answers = (
          <div className="ui two column stackable grid">
                <div className="column">
                  <div className="ui grouped fields">
                    <fieldset>
                      {list}
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
                      {correctAnswers}
                    </div>
                  </div>
                </div>
              </div>
        );

        return (
            <div ref="contentquestionanswersList">
                <div className="ui relaxed list">
                    {answers}
                </div>
             </div>
        );
    }
}

export default ContentQuestionAnswersList;
