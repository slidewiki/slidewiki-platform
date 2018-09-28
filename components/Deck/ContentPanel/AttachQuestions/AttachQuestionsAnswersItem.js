import React from 'react';

class AttachQuestionsAnswersItem extends React.Component {

    render() {
        const answer = this.props.answer;
        //const name = this.props.name;

        let rightIcon = (<i className="icon"></i>);
        switch (answer.correct) {
            case true:
            rightIcon = (<i className="checkmark icon teal"></i>);
            break;
        }

        /*nikki should this be classname ui item below? or just item? want these next to each other*/
        //add some aria stuff to this
        return (
                <div className="content">{rightIcon} {answer.answer} </div>

            // <div className="ui item">
            //     {answer.answer}
            // </div>

        );
    }
}

export default AttachQuestionsAnswersItem;
