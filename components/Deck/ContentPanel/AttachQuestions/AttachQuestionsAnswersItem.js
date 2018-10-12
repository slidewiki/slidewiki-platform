import React from 'react';

class AttachQuestionsAnswersItem extends React.Component {

    render() {
        const answer = this.props.answer;

        let rightIcon = (<i className="icon"></i>);
        switch (answer.correct) {
            case true:
            rightIcon = (<i className="checkmark icon teal"></i>);
            break;
        }

        //add some aria stuff to this
        return (
                <div className="content">{rightIcon} {answer.answer} </div>
        );
    }
}

export default AttachQuestionsAnswersItem;
