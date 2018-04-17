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
        console.log(this.props.correctValue, this.state.checkboxValue);

        return (
            <div className="field">
              <div className="ui checkbox">
                <input type="checkbox" name={name} id={name} onChange={(event) => this.handleCheckboxChange(event)}/>
                <label htmlFor={name}>
                  {answer.answer}
                  {this.props.showAnswer && (
                      (this.props.correct && this.state.checkboxValue) ||
                      (!this.props.correct && !this.state.checkboxValue)
                  ) &&
                    <Icon name="check"/>
                  }
                  {this.props.showAnswer && (
                      (!this.props.correct && this.state.checkboxValue) ||
                      (this.props.correct && !this.state.checkboxValue)
                  ) &&
                    <Icon name="close"/>
                  }
                </label>
              </div>
            </div>

        );
    }
}

export default ContentQuestionAnswersItem;
