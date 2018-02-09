import React from 'react';
import ReactDOM from 'react-dom';
import updateQuestion from '../../../../actions/questions/updateQuestion';
import cancelQuestion from '../../../../actions/questions/cancelQuestion';
import deleteQuestion from '../../../../actions/questions/deleteQuestion';

class ContentQuestionEdit extends React.Component {

    constructor(props) {
        super(props);
        const numAnswers = this.props.question.answers.length;
        this.state = {
            qid: this.props.question.id,
            title: this.props.question.title,
            difficulty: this.props.question.difficulty,
            answer1: this.props.question.answers[0].answer,
            answer2: numAnswers > 1 ? this.props.question.answers[1].answer: '',
            answer3: numAnswers > 2 ? this.props.question.answers[2].answer: '',
            answer4: numAnswers > 3 ? this.props.question.answers[3].answer: '',
            correct1: this.props.question.answers[0].correct,
            correct2: numAnswers > 1 ? this.props.question.answers[1].correct: false,
            correct3: numAnswers > 2 ? this.props.question.answers[2].correct: false,
            correct4: numAnswers > 3 ? this.props.question.answers[3].correct: false,
            explanation: this.props.question.explanation,
            userId: this.props.userId,
            relatedObjectId: this.props.question.relatedObjectId,
            relatedObject: this.props.question.relatedObject
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
        this.cancelButtonClick = this.cancelButtonClick.bind(this);
        this.deleteButtonClick = this.deleteButtonClick.bind(this);
    }

    componentDidMount() {
        const questionValidation = {
            fields: {
                question: {
                    identifier: 'question',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please, enter question',
                    }]
                },
                response1: {
                    identifier: 'response1',
                    rules: [{
                        type: 'atleastoneanswer',
                        prompt: 'Please, add answers',
                    }]
                }
            },
            onSuccess: this.saveButtonClick
        };

        // Custom form validation rule
        $.fn.form.settings.rules.atleastoneanswer = (() => {
            return (this.state.answer1 !== '' && this.state.correct1) ||
                (this.state.answer2 !== '' && this.state.correct2) ||
                (this.state.answer3 !== '' && this.state.correct3) ||
                (this.state.answer4 !== '' && this.state.correct4);
        });
        $(ReactDOM.findDOMNode(this.refs.questionedit_form)).form(questionValidation);
        // $('.ui.form')
        //     .form(questionValidation);
    }

    saveButtonClick(e) {
        e.preventDefault();
        this.context.executeAction(updateQuestion, {question: this.state});
        return false;
    }

    cancelButtonClick() {
        this.context.executeAction(cancelQuestion, {});
    }

    deleteButtonClick() {
        swal({
            title: 'Delete this question. Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete!'
        }).then((accepted) => {
            this.context.executeAction(deleteQuestion, {questionId: this.state.qid});
        }, (reason) => {/*do nothing*/}).catch(swal.noop);
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
        this.setState({correct4: e.target.checked});
    }

    updateExplanation(e) {
        this.setState({explanation: e.target.value});
    }

    updateQuestionTitle(e) {
        this.setState({title: e.target.value});
    }

    updateQuestionDifficulty(e) {
        this.setState({difficulty: e.target.value});
    }

    render() {
        // const numAnswers = this.props.question.answers.length;
        const answerChoiceWidth = {
            width: '680px',
        };
        return (
            <div className="ui bottom attached" data-reactid="637">
                <div className="ui padded segment">
                    <form className="ui form" ref="questionedit_form">
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
                                        <input  type="checkbox" name="example2" id="answer2" tabIndex="0" className="hidden" defaultChecked={this.state.correct2} onChange={this.updateCorrect2}/>
                                        <label htmlFor="answer2"></label>
                                    </div>
                                    <input style={answerChoiceWidth} type="text" name="response2" id="response2" defaultValue={this.state.answer2}  onChange={this.updateAnswer2}/>
                                    <label htmlFor="response2"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        <input type="checkbox" name="example3" id="answer3" tabIndex="0" className="hidden" defaultChecked={this.state.correct3} onChange={this.updateCorrect3}/>
                                        <label htmlFor="answer3"></label>
                                    </div>
                                    <input type="text" style={answerChoiceWidth} name="response3" id="response3" defaultValue={this.state.answer3} onChange={this.updateAnswer3}/>
                                    <label htmlFor="response3"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        <input type="checkbox" name="example4" id="answer4" tabIndex="0" className="hidden" defaultChecked={this.state.correct4} onChange={this.updateCorrect4}/>
                                        <label htmlFor="answer4"></label>
                                    </div>
                                    <input type="text" style={answerChoiceWidth} name="response4" id="response4" defaultValue={this.state.answer4} onChange={this.updateAnswer4}/>
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
                                <div >
                                    <button type="submit" className="ui blue labeled submit icon button" >
                                        <i className="icon check" />Save
                                    </button>
                                    <button type="button" className="ui secondary labeled close icon button" onClick={this.cancelButtonClick}>
                                        <i className="icon close" />Cancel
                                    </button>
                                    <button type="button" className="ui red labeled icon button" onClick={this.deleteButtonClick}>
                                        <i className="icon minus circle" />Delete
                                    </button>
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
