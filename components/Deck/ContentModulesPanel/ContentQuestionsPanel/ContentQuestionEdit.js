import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import updateQuestion from '../../../../actions/questions/updateQuestion';
import cancelQuestion from '../../../../actions/questions/cancelQuestion';
import deleteQuestion from '../../../../actions/questions/deleteQuestion';
import { FormattedMessage, defineMessages } from 'react-intl';

class ContentQuestionEdit extends React.Component {

    constructor(props) {
        super(props);
        const numAnswers = this.props.question.answers.length;
        const initAnswers = this.props.question.answers.map((item) => item.answer);
        const initCorrects = this.props.question.answers.map((item) => item.correct);
        this.state = {
            qid: this.props.question.id,
            title: this.props.question.title,
            difficulty: this.props.question.difficulty,
            answers: initAnswers,
            corrects: initCorrects,
            explanation: this.props.question.explanation,
            userId: this.props.userId,
            relatedObjectId: this.props.question.relatedObjectId,
            relatedObject: this.props.question.relatedObject,
            isExamQuestion: this.props.question.isExamQuestion
        };
        this.updateQuestionTitle = this.updateQuestionTitle.bind(this);
        this.updateQuestionDifficulty = this.updateQuestionDifficulty.bind(this);
        /* update answers */
        this.updateAnswer = this.updateAnswer.bind(this);
        /* update correct answer choice */
        this.updateCorrect = this.updateCorrect.bind(this);

        this.addAnswerClick = this.addAnswerClick.bind(this);
        this.removeAnswerClick = this.removeAnswerClick.bind(this);

        this.updateExplanation = this.updateExplanation.bind(this);
        this.updateIsExamQuestion = this.updateIsExamQuestion.bind(this);
        this.saveButtonClick = this.saveButtonClick.bind(this);
        this.cancelButtonClick = this.cancelButtonClick.bind(this);
        this.deleteButtonClick = this.deleteButtonClick.bind(this);
    }

    componentDidMount() {
        const messages = defineMessages({
            no_question: {
                id: 'ContentQuestionEdit.no_question',
                defaultMessage: 'Please, enter question',
            },
            no_answers: {
                id: 'ContentQuestionEdit.no_answers',
                defaultMessage: 'Please, add answers',
            },
            
        });
        const questionValidation = {
            fields: {
                question: {
                    identifier: 'question',
                    rules: [{
                        type: 'empty',
                        prompt: this.context.intl.formatMessage(messages.no_question),
                    }]
                },
                response1: {
                    identifier: 'response1',
                    rules: [{
                        type: 'atleastoneanswer',
                        prompt: this.context.intl.formatMessage(messages.no_answers),
                    }]
                }
            },
            onSuccess: this.saveButtonClick
        };

        // Custom form validation rule
        $.fn.form.settings.rules.atleastoneanswer = (() => {
            let ruleState = (this.state.answers[0] !== '' && this.state.corrects[0]);
            for(let i = 1; i < this.state.answers.length; i++) {
                ruleState = ruleState || (this.state.answers[i] !== '' && this.state.corrects[i]);
            } 
            return ruleState;
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
        const swal_messages = defineMessages({
            text: {
                id: 'ContentQuestionEdit.swal.text',
                defaultMessage: 'Delete this question. Are you sure?',
            },
            confirmButtonText: {
                id: 'ContentQuestionEdit.swal.confirmButtonText',
                defaultMessage: 'Yes, delete!',
            }
        });
        swal({
            title: this.context.intl.formatMessage(swal_messages.text),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: this.context.intl.formatMessage(swal_messages.confirmButtonText),
        }).then((accepted) => {
            this.context.executeAction(deleteQuestion, {questionId: this.state.qid});
        }, (reason) => {/*do nothing*/}).catch(swal.noop);
    }

    getItemId(id, type) {
        let result = 0;
        if(type === 'response') {
            result = id.replace('response', '');
        } else if (type === 'answer') {
            result = id.replace('answer', '');
        } else if (type === 'remove') {
            result = id.replace('remove', '');
        }

        return parseInt(result, 10) - 1;
    }

    addAnswerClick() {
        this.setState((prevState) => ({
            answers: [...prevState.answers, '']
        }));
        this.setState((prevState) => ({
            corrects: [...prevState.corrects, false]
        }));
    }

    removeAnswerClick(e) {
        let indexShouldBeRemoved = this.getItemId(e.currentTarget.id, 'remove');
        const tmp_array_answers = [...this.state.answers];
        tmp_array_answers.splice(indexShouldBeRemoved, 1);

        const tmp_array_corrects = [...this.state.corrects];
        tmp_array_corrects.splice(indexShouldBeRemoved, 1);
        
        this.setState({
            answers: tmp_array_answers,
            corrects: tmp_array_corrects
        });
    }

    /* Update answer choice text */
    updateAnswer(e) {
        const tmp_array = [...this.state.answers];
        let indexShouldBeChanged = this.getItemId(e.target.id, 'response');
        tmp_array[indexShouldBeChanged] = e.target.value;
        this.setState({answers:tmp_array});
    }

    /* Update correct choice among available answer choices */
    updateCorrect(e) {
        const tmp_array = [...this.state.corrects];
        let indexShouldBeChanged = this.getItemId(e.target.id, 'answer');
        tmp_array[indexShouldBeChanged] = e.target.checked;
        this.setState({corrects:tmp_array});
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
    
    updateIsExamQuestion(e) {
        this.setState({isExamQuestion: e.target.checked});
    }
    
    render() {
        // const numAnswers = this.props.question.answers.length;
        const answerChoiceWidth = {
            width: '680px',
        };

        let answers = this.state.answers.map((item, index) =>
        <div className="inline field">
            <div className="ui checkbox">
                <input  type="checkbox" name={'example' + (index+1)} checked={this.state.corrects[index]?'checked':''} id={'answer' + (index+1)} tabIndex="0" className="hidden" onChange={this.updateCorrect}/>
                <label htmlFor={'answer' + (index+1)}></label>
            </div>
            <i id={'remove' + (index+1)} onClick={this.removeAnswerClick} className="ui delete icon" />
            <input style={answerChoiceWidth} type="text" value={item} name={'response' + (index+1)} id={'response' + (index+1)} onChange={this.updateAnswer}/>
            <label htmlFor={'response' + (index+1)}></label>
        </div>
        );

        return (
            <div className="ui bottom attached">
                <div className="ui padded segment">
                    <form className="ui form" ref="questionedit_form">
                        <div className="two fields inline">
                            <div className="required field">
                                <label htmlFor="question">
                                    <FormattedMessage
                                        id='ContentQuestionEdit.form.question'
                                        defaultMessage='Question' />
                                </label>
                                <textarea rows="3"  name="question" id="question" aria-required="true" defaultValue={this.state.title} onChange={this.updateQuestionTitle} />
                            </div>
                            <div className="ui grouped fields">
                                <fieldset>
                                    <legend>
                                        <FormattedMessage
                                            id='ContentQuestionEdit.form.difficulty'
                                            defaultMessage='Difficulty' />
                                    </legend>
                                    <div className="inline fields">
                                        <div className="field">
                                            <div className="ui radio checkbox">
                                                {this.state.difficulty === 1 ?
                                                    <input type="radio" id="easy" name="difficulty" checked="checked" defaultValue={1} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                                    : <input type="radio" id="easy" name="difficulty" defaultValue={1} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                                }
                                                <label htmlFor="easy">
                                                    <FormattedMessage
                                                        id='ContentQuestionEdit.form.difficulty_easy'
                                                        defaultMessage='Easy' />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="field">
                                            <div className="ui radio checkbox">
                                                {this.state.difficulty === 2 ?
                                                    <input type="radio" id="moderate" name="difficulty" checked="checked" defaultValue={2} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                                    : <input type="radio" id="moderate" name="difficulty" defaultValue={2} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                                }
                                                <label htmlFor="moderate">
                                                    <FormattedMessage
                                                        id='ContentQuestionEdit.form.difficulty_moderate'
                                                        defaultMessage='Moderate' />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="field">
                                            <div className="ui radio checkbox">
                                            {this.state.difficulty === 3 ?
                                                <input type="radio" id="hard" name="difficulty" checked="checked" defaultValue={3} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                                : <input type="radio" id="hard" name="difficulty" defaultValue={3} tabIndex="0" onChange={this.updateQuestionDifficulty} />
                                            }
                                                <label htmlFor="hard">
                                                    <FormattedMessage
                                                        id='ContentQuestionEdit.form.difficulty_hard'
                                                        defaultMessage='Hard' />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="ui grouped fields">
                            <fieldset>
                                <legend>
                                    <FormattedMessage
                                        id='ContentQuestionEdit.form.answer_choices'
                                        defaultMessage='Answer Choices' />
                                </legend>
                                {answers}
                                <button type="button" className="ui right floated compact button primary" onClick={this.addAnswerClick} >
                                        <i className="small plus icon" />
                                        <FormattedMessage
                                            id='ContentQuestionAdd.form.button_add_answer'
                                            defaultMessage='Add Answer' />
                                </button>
                            </fieldset>
                        </div>
                        <div className="field">
                            <label htmlFor="explanation">
                                <FormattedMessage
                                    id='ContentQuestionEdit.form.explanation'
                                    defaultMessage='Explanation (optional)' />
                            </label>
                            <textarea rows="2" id="explanation" defaultValue={this.state.explanation} onChange={this.updateExplanation}></textarea>
                        </div>
                        <div className="field">
                            <div className="ui checkbox">
                                <input type="checkbox" name="exam" id="exam" tabIndex="0" className="hidden" defaultChecked={this.state.isExamQuestion} onChange={this.updateIsExamQuestion}/>
                                <label htmlFor="exam">
                                    <FormattedMessage
                                        id='ContentQuestionEdit.form.exam_question'
                                        defaultMessage='This is an exam question' />
                                </label>
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui container">
                                <div >
                                    <button type="submit" className="ui blue labeled submit icon button" >
                                        <i className="icon check" />
                                        <FormattedMessage
                                            id='ContentQuestionEdit.form.button_save'
                                            defaultMessage='Save' />
                                    </button>
                                    <button type="button" className="ui secondary labeled close icon button" onClick={this.cancelButtonClick}>
                                        <i className="icon close" />
                                        <FormattedMessage
                                            id='ContentQuestionEdit.form.button_cancel'
                                            defaultMessage='Cancel' />
                                    </button>
                                    <button type="button" className="ui red labeled icon button" onClick={this.deleteButtonClick}>
                                        <i className="icon minus circle" />
                                        <FormattedMessage
                                            id='ContentQuestionEdit.form.button_delete'
                                            defaultMessage='Delete' />
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
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default ContentQuestionEdit;
