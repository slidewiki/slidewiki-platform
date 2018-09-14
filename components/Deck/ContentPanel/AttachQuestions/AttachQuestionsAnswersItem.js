import React from 'react';

class AttachQuestionsAnswersItem extends React.Component {

    render() {
        const answer = this.props.answer;
        //const name = this.props.name;

        // let rightIcon = (<i className="icon"></i>);
        // switch (answer.correct) {
        //     case true:
        //         rightIcon = (<i className="checkmark icon teal"></i>);
        //         break;
        // }

        return (
            //<div className="item"> {rightIcon}
            //        <div className="content"> {answer.answer} </div>
            //    </div>

            <div className="ui item">
                {answer.answer}
            </div>

        );
    }
}

export default AttachQuestionsAnswersItem;
