import React from 'react';

class ContentQuestionAnswersItem extends React.Component {

    render() {
        const answer = this.props.answer;
        
        return (
            <div className="field">
              <div className="ui ">
                <i className="ui small circle outline icon" />
                <label >
                  {answer.answer}
                </label>
              </div>
            </div>

        );
    }
}

export default ContentQuestionAnswersItem;
