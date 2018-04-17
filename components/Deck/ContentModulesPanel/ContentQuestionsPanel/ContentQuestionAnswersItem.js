import React from 'react';
import {Icon} from 'semantic-ui-react';

class ContentQuestionAnswersItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checkboxValue: false};
    }

    handleCheckboxChange(event) {
        this.setState({checkboxValue: !this.state.checkboxValue});
    }

    render() {
        const answer = this.props.answer;
        const name = this.props.name;

        return (
            <div className="field">
              <div className="ui checkbox">
                <input type="checkbox" name={name} id={name} onChange={(event) => this.handleCheckboxChange(event)}/>
                <label htmlFor={name}>
                  {answer.answer}
                  {/* show check mark if this checkbox is correct */
                      this.props.showAnswer && (
                      (this.props.correct && this.state.checkboxValue) ||
                      (!this.props.correct && !this.state.checkboxValue)
                  ) &&
                    <Icon name="check" className={'green'}/>
                  }

                  {/* show cross mark if this checkbox is incorrect */
                      this.props.showAnswer && (
                      (!this.props.correct && this.state.checkboxValue) ||
                      (this.props.correct && !this.state.checkboxValue)
                  ) &&
                    <Icon name="close" className={'red'}/>
                  }
                </label>
              </div>
            </div>
        );
    }
}

export default ContentQuestionAnswersItem;
