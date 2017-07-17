import React from 'react';
import updateQuestion from '../../../../actions/questions/updateQuestion';

class ContentQuestionEdit extends React.Component {

    constructor(props) {
        super(props);
        const numAnswers = this.props.question.answers.length;
        this.state = {
            id: this.props.question.id,
            title: this.props.question.title,
            difficulty: this.props.question.difficulty,
            answer1: this.props.question.answers[0].answer,
            answer2: numAnswers > 1 ? this.props.question.answers[1].answer: '',
            answer3: numAnswers > 2 ? this.props.question.answers[2].answer: '',
            answer4: numAnswers > 3 ? this.props.question.answers[3].answer: '',
            correct1: this.props.question.answers[0].correct,
            correct2: numAnswers > 2 ? this.props.question.answers[1].correct: '',
            correct3: numAnswers > 3 ? this.props.question.answers[2].correct: '',
            correct4: numAnswers > 3 ? this.props.question.answers[3].correct: '',
            explanation: 'Test explanation', //this.props.question.explanation,
            userId: this.props.userId,
            relatedObjectId: this.props.selector.sid,
            relatedObject: this.props.selector.stype,
        };
        this.updateQuestionTitle = this.updateQuestionTitle.bind(this);
        this.updateQuestionDifficulty = this.updateQuestionDifficulty.bind(this);
        /* update answers */
        this.updateAnswer1 = this.updateAnswer1.bind(this);
        this.updateAnswer2 = this.updateAnswer2.bind(this);
        this.updateAnswer3 = this.updateAnswer3.bind(this);
        this.updateAnswer4 = this.updateAnswer4.bind(this);
        /* update correct answer choice */
        this.updateCorrect1 = this.updateCorrect1.bind(this);
        this.updateCorrect2 = this.updateCorrect2.bind(this);
        this.updateCorrect3 = this.updateCorrect3.bind(this);
        this.updateCorrect4 = this.updateCorrect4.bind(this);

        this.updateExplanation = this.updateExplanation.bind(this);
        this.saveButtonClick = this.saveButtonClick.bind(this);
    };

    saveButtonClick(e) {
        e.preventDefault();
        this.context.executeAction(updateQuestion, {question: this.state});
    }

    /* Update answer choice text */
    updateAnswer1(e) {
        this.setState({answer1: e.target.value});
    }

    updateAnswer2(e) {
        this.setState({answer2: e.target.value});
    }

    updateAnswer3(e) {
        this.setState({answer3: e.target.value});
    }

    updateAnswer4(e) {
        //console.log(e.target.value);
        this.setState({answer4: e.target.value});
    }

    /* Update correct choice among available answer choices */
    updateCorrect1(e) {
        this.setState({correct1: e.target.checked});
    }

    updateCorrect2(e) {
        this.setState({correct2: e.target.checked});
    }

    updateCorrect3(e) {
        this.setState({correct3: e.target.checked});
    }

    updateCorrect4(e) {
        console.log(e.target.value);
        this.setState({correct4: e.target.checked});
    }

    updateExplanation(e) {
        this.setState({explanation: e.target.value});
    }

    updateQuestionTitle(e) {
        this.setState({title: e.target.value});
    };

    updateQuestionDifficulty(e) {
        this.setState({difficulty: e.target.value});
    }

    render() {
        const numAnswers = this.props.question.answers.length;
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
                                                {this.state.difficulty === 1 ?
                                                    <input type="radio" id="easy" name="difficulty" checked="checked" defaultValue={1} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                                    : <input type="radio" id="easy" name="difficulty" defaultValue={1} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                                }
                                                <label htmlFor="easy">Easy</label>
                                            </div>
                                        </div>
                                        <div className="field">
                                            <div className="ui radio checkbox">
                                                {this.state.difficulty === 2 ?
                                                    <input type="radio" id="moderate" name="difficulty" checked="checked" defaultValue={2} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                                    : <input type="radio" id="moderate" name="difficulty" defaultValue={2} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                                }
                                                <label htmlFor="moderate">Moderate</label>
                                            </div>
                                        </div>
                                        <div className="field">
                                            <div className="ui radio checkbox">
                                            {this.state.difficulty === 3 ?
                                                <input type="radio" id="hard" name="difficulty" checked="checked" defaultValue={3} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                                : <input type="radio" id="hard" name="difficulty" defaultValue={3} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                            }
                                                <label htmlFor="hard">Hard</label>
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
                                        <input type="checkbox" name="example1" id="answer1" tabIndex="0" className="hidden" defaultChecked={this.state.correct1} onChange={this.updateCorrect1}/>
                                        <label htmlFor="answer1"></label>
                                    </div>
                                    <input style={answerChoiceWidth} type="text" name="response1" id="response1" defaultValue={this.state.answer1}  onChange={this.updateAnswer1}/>
                                    <label htmlFor="response1"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        <input  type="checkbox" name="example2" id="answer2" tabIndex="0" className="hidden" defaultChecked={numAnswers > 2 && this.state.correct2} onChange={this.updateCorrect2}/>
                                        <label htmlFor="answer2"></label>
                                    </div>
                                    <input style={answerChoiceWidth} type="text" name="response2" id="response2" defaultValue={numAnswers > 1 ? this.state.answer2: ''}  onChange={this.updateAnswer2}/>
                                    <label htmlFor="response2"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        <input type="checkbox" name="example3" id="answer3" tabIndex="0" className="hidden" defaultChecked={numAnswers > 2 && this.state.correct3} onChange={this.updateCorrect3}/>
                                        <label htmlFor="answer3"></label>
                                    </div>
                                    <input type="text" style={answerChoiceWidth} name="response4" id="response4" defaultValue={numAnswers > 2 ? this.state.answer3: ''} onChange={this.updateAnswer3}/>
                                    <label htmlFor="response3"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        <input type="checkbox" name="example4" id="answer4" tabIndex="0" className="hidden" defaultChecked={(numAnswers > 3 && this.state.correct4)} onChange={this.updateCorrect4}/>
                                        <label htmlFor="answer4"></label>
                                    </div>
                                    <input type="text" style={answerChoiceWidth} name="response4" id="response4" defaultValue={numAnswers > 3 ? this.state.answer4: ''} onChange={this.updateAnswer4}/>
                                    <label htmlFor="response4"></label>
                                </div>
                            </fieldset>
                        </div>
                        <div className="field">
                            <label htmlFor="explanation">Explanation (optional)</label>
                            <textarea rows="2" id="explanation" defaultValue={this.state.explanation} onChange={this.updateExplanation}></textarea>
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

ContentQuestionEdit.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ContentQuestionEdit;
