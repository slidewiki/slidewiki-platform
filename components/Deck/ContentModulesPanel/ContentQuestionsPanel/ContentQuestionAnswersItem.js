import React from 'react';

class ContentQuestionAnswersItem extends React.Component {

    render() {
        const answer = this.props.answer;

        let rightIcon = (<i className="icon"></i>);
        switch (answer.correct) {
          case true:
            rightIcon = (<i className="checkmark icon teal"></i>);
            break;
        }

        return (
            <div className="item">
              {rightIcon}
              <div className="content">
                {answer.answer}
              </div>
            </div>
        );
    }
}

export default ContentQuestionAnswersItem;
