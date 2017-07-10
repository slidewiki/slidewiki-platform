import React from 'react';

class ContentQuestionEdit extends React.Component {

    constructor(props){
        super(props);
    };

    render() {
        const title = this.props.question.title;
        const difficulty = this.props.question.difficulty;
        const answers = this.props.question.answers;
        const numAnswers = answers.length;
        const answerChoiceWidth = {
            width: '680px',
        };
        console.log(answers);
        return (
            <div className="ui bottom attached" data-reactid="637">
                <div className="ui padded segment">
                    <form className="ui form">
                        <div className="two fields inline">
                            <div className="required field"><label htmlFor="question">Question</label>
                                <textarea rows="3"  name="question" id="question" aria-required="true" value={title} />
                            </div>
                            <div className="ui grouped fields">
                                <fieldset>
                                    <legend>Difficulty</legend>
                                    <div className="inline fields">
                                        <div className="field">
                                            <div className="ui radio checkbox">
                                                {difficulty === 1 ?
                                                    <input type="radio" id="easy" checked="checked" tabIndex="0" className="hidden" /> :
                                                    <input type="radio" id="easy" checked="" tabIndex="0" className="hidden" />
                                                }
                                                <label htmlFor="easy">Easy</label>
                                            </div>
                                        </div>
                                        <div className="field">
                                            <div className="ui radio checkbox">
                                                {difficulty === 2 ?
                                                    <input type="radio" id="moderate" checked="checked" tabIndex="0" className="hidden" /> :
                                                    <input type="radio" id="moderate" checked="" tabIndex="0" className="hidden" />
                                                }
                                                <label htmlFor="easy">Moderate</label>
                                            </div>
                                        </div><div className="field">
                                        <div className="ui radio checkbox">
                                            {difficulty === 3 ?
                                                <input type="radio" id="hard" checked="checked" tabIndex="0" className="hidden" /> :
                                                <input type="radio" id="hard" checked="" tabIndex="0" className="hidden" />
                                            }
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
                                            <input type="checkbox" name="example1" id="answer1" tabIndex="0" className="hidden" checked="checked"/> :
                                            <input type="checkbox" name="example1" id="answer1" tabIndex="0" className="hidden"/>
                                        }
                                        <label htmlFor="answer1"></label>
                                    </div>
                                    <input style={answerChoiceWidth} type="text" name="response1" id="response1" value={answers[0].answer} />
                                    <label htmlFor="response1"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        {numAnswers > 1 && answers[1].correct ?
                                            <input  type="checkbox" name="example2" id="answer2" tabIndex="0" className="hidden" checked="checked"/> :
                                            <input  type="checkbox" name="example2" id="answer2" tabIndex="0" className="hidden" />
                                        }
                                        <label htmlFor="answer2"></label>
                                    </div>
                                    <input style={answerChoiceWidth} type="text" name="response2" id="response2" value={numAnswers > 1 ? answers[1].answer: ''}/>
                                    <label htmlFor="response2"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        {numAnswers > 2 && answers[2].correct ?
                                            <input type="checkbox" name="example3" id="answer3" tabIndex="0" className="hidden" checked="checked"/> :
                                            <input type="checkbox" name="example3" id="answer3" tabIndex="0" className="hidden" />
                                        }
                                        <label htmlFor="answer3"></label>
                                    </div>
                                    <input type="text" style={answerChoiceWidth} name="response4" id="response4" value={numAnswers > 2 ? answers[2].answer: ''}/>
                                    <label htmlFor="response3"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        {numAnswers > 3 && answers[3].correct ?
                                            <input  type="checkbox" name="example4" id="answer4" tabIndex="0" className="hidden" checked="checked"/> :
                                            <input  type="checkbox" name="example4" id="answer4" tabIndex="0" className="hidden" />
                                        }
                                        <label htmlFor="answer4"></label>
                                    </div>
                                    <input type="text" style={answerChoiceWidth} name="response4" id="response4" value={numAnswers > 3 ? answers[3].answer: ''}/>
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
                                    <button className="ui primary button">Save</button>
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
