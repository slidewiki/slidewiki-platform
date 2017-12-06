import React from 'react';

class ContentQuestionAnswersItem extends React.Component {

    render() {
        const answer = this.props.answer;
        const name = this.props.name;

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

            <div className="field">
                <div className="ui checkbox">
                    <input type="checkbox" name={name} id={name} /> {/* defaultChecked={answer.correct} */}
                    <label htmlFor={name}>
                        {answer.answer}
                    </label>
                </div>
            </div>

        );
    }
}

export default ContentQuestionAnswersItem;
