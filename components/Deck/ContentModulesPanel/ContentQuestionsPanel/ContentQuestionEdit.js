import React from 'react';

class ContentQuestionEdit extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: this.props.question.id,
            title: this.props.question.title,
            difficulty: this.props.question.difficulty,
            answer1: '',
            answer2: '',
            answer3: '',
            answer4: '',
            userid: this.props.question.user_id,
            relatedObjectId: this.props.selector.sid,
            relatedObject: this.props.selector.stype,
        };
        this.updateQuestionTitle = this.updateQuestionTitle.bind(this);
        this.updateQuestionDifficulty = this.updateQuestionDifficulty.bind(this);
        //this.updateQuestionAnswer1 = this.updateQuestionAnswer1.bind(this);
        //this.updateQuestionAnswer2 = this.updateQuestionAnswer2.bind(this);
        //this.updateQuestionAnswer3 = this.updateQuestionAnswer3.bind(this);
        //this.updateQuestionAnswer4 = this.updateQuestionAnswer4.bind(this);
        //this.updateQuestionExplanation = this.updateQuestionExplanation.bind(this);
        this.saveButtonClick = this.saveButtonClick.bind(this);
    };

    saveButtonClick(e) {
        //this.context.executeAction(saveQuestion, {
            // TODO collect values from input elements by id
        //    qstid: this.props.question.id
        //});
        e.preventDefault();
        console.log('Title:', this.state.title);
        console.log('Difficulty:', this.state.difficulty);
    }

    updateQuestionTitle(e) {
        this.setState({title: e.target.value});
    };

    updateQuestionDifficulty(e) {
        this.setState({difficulty: e.currentTarget.value});
    }

    render() {
        console.log(this.props);
        const answers = this.props.question.answers;
        const numAnswers = answers.length;
        const answerChoiceWidth = {
            width: '680px',
        };

        return (
            <div className="ui bottom attached" data-reactid="637">
                <div className="ui padded segment">
                    <form className="ui form">
                        <div className="two fields inline">
                            <div className="required field"><label htmlFor="question">Question</label>
                                <textarea rows="3"  name="question" id="question" aria-required="true" defaultValue={this.state.title} onChange={this.updateQuestionTitle} />
                            </div>
                            <div className="ui grouped fields">
                                <fieldset>
                                    <legend>Difficulty</legend>
                                    <div className="inline fields">
                                        <div className="field">
                                            <div className="ui radio checkbox">
                                                <input type="radio" id="easy" name="difficulty" checked={this.state.difficulty === 1 ? 'checked': false} value={1} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                                <label htmlFor="easy">Easy</label>
                                            </div>
                                        </div>
                                        <div className="field">
                                            <div className="ui radio checkbox">
                                                <input type="radio" id="moderate" name="difficulty" checked={this.state.difficulty === 2 ? 'checked': false} value={2} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                                <label htmlFor="easy">Moderate</label>
                                            </div>
                                        </div><div className="field">
                                        <div className="ui radio checkbox">
                                                <input type="radio" id="hard" name="difficulty" checked={this.state.difficulty === 3 ? 'checked': false} value={3} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                                <label htmlFor="easy">Hard</label>
                                        </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="ui grouped fields">
                            <fieldset>
                                <legend>Answer Choices</legend>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        {answers[0].correct ?
                                            <input type="checkbox" name="example1" id="answer1" tabIndex="0" className="hidden" defaultChecked="checked"/> :
                                            <input type="checkbox" name="example1" id="answer1" tabIndex="0" className="hidden"/>
                                        }
                                        <label htmlFor="answer1"></label>
                                    </div>
                                    <input style={answerChoiceWidth} type="text" name="response1" id="response1" defaultValue={answers[0].answer} />
                                    <label htmlFor="response1"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        {numAnswers > 1 && answers[1].correct ?
                                            <input  type="checkbox" name="example2" id="answer2" tabIndex="0" className="hidden" defaultChecked="checked"/> :
                                            <input  type="checkbox" name="example2" id="answer2" tabIndex="0" className="hidden" />
                                        }
                                        <label htmlFor="answer2"></label>
                                    </div>
                                    <input style={answerChoiceWidth} type="text" name="response2" id="response2" defaultValue={numAnswers > 1 ? answers[1].answer: ''}/>
                                    <label htmlFor="response2"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        {numAnswers > 2 && answers[2].correct ?
                                            <input type="checkbox" name="example3" id="answer3" tabIndex="0" className="hidden" defaultChecked="checked"/> :
                                            <input type="checkbox" name="example3" id="answer3" tabIndex="0" className="hidden" />
                                        }
                                        <label htmlFor="answer3"></label>
                                    </div>
                                    <input type="text" style={answerChoiceWidth} name="response4" id="response4" defaultValue={numAnswers > 2 ? answers[2].answer: ''}/>
                                    <label htmlFor="response3"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        {numAnswers > 3 && answers[3].correct ?
                                            <input  type="checkbox" name="example4" id="answer4" tabIndex="0" className="hidden" defaultChecked="checked"/> :
                                            <input  type="checkbox" name="example4" id="answer4" tabIndex="0" className="hidden" />
                                        }
                                        <label htmlFor="answer4"></label>
                                    </div>
                                    <input type="text" style={answerChoiceWidth} name="response4" id="response4" defaultValue={numAnswers > 3 ? answers[3].answer: ''}/>
                                    <label htmlFor="response4"></label>
                                </div>
                            </fieldset>
                        </div>
                        <div className="field">
                            <label htmlFor="explanation">Explanation (optional)</label>
                            <textarea rows="2" id="explanation"></textarea>
                        </div>
                        <div className="field">
                            <div className="ui container">
                                <div className="ui right floated buttons">
                                    <button className="ui primary button" onClick={this.saveButtonClick}>Save</button>
                                    <button className="ui secondary button">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default ContentQuestionEdit;
