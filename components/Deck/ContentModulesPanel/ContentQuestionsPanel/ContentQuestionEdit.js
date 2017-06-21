import React from 'react';
//import editQuestion from '../../../../actions/questions/editQuestion';

class ContentQuestionEdit extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const answerChoiceWidth = {
            width: '680px',
        };

        return (
            <div className="ui bottom attached" data-reactid="637">
                <div className="ui padded segment">
                    <form className="ui form">
                        <div className="two fields">
                            <div className="required field"><label htmlFor="question">Question</label>
                                <textarea rows="3"  name="question" id="question" aria-required="true">
                                </textarea>
                            </div>
                            <div className="ui grouped fields">
                                <fieldset>
                                    <legend>Difficulty</legend>
                                    <div className="inline fields">
                                        <div className="field">
                                            <div className="ui radio checkbox">
                                                <input type="radio" id="easy" checked="" tabIndex="0" className="hidden" />
                                                <label htmlFor="easy">Easy</label>
                                            </div>
                                        </div>
                                        <div className="field">
                                            <div className="ui radio checkbox">
                                                <input type="radio" id="moderate" checked="" tabIndex="0" className="hidden" />
                                                <label htmlFor="easy">Moderate</label>
                                            </div>
                                        </div><div className="field">
                                        <div className="ui radio checkbox">
                                            <input type="radio" id="Hard" checked="" tabIndex="0" className="hidden" />
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
                                        <input type="checkbox" name="example1" id="answer1" tabIndex="0" className="hidden" />
                                        <label htmlFor="answer1"></label>
                                    </div>
                                    <input style={answerChoiceWidth} type="text" name="response1" id="response1" />
                                    <label htmlFor="response1"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        <input  type="checkbox" name="example1" id="answer2" tabIndex="0" className="hidden" />
                                        <label htmlFor="answer2"></label>
                                    </div>
                                    <input style={answerChoiceWidth} type="text" name="response2" id="response2" />
                                    <label htmlFor="response2"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        <input type="checkbox" name="example1" id="answer3" tabIndex="0" className="hidden" />
                                        <label htmlFor="answer3"></label>
                                    </div>
                                    <input style={answerChoiceWidth} type="text" name="response3" id="response3" />
                                    <label htmlFor="response3"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        <input  type="checkbox" name="example1" id="answer4" tabIndex="0" className="hidden" />
                                        <label htmlFor="answer4"></label>
                                    </div>
                                    <input type="text" style={answerChoiceWidth} name="response4" id="response4" />
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

ContentQuestionEdit.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ContentQuestionEdit;
