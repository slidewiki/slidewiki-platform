import React from 'react';
import editQuestion from '../../../../actions/questions/editQuestion';

class ContentQuestionEdit extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="ui bottom attached" data-reactid="637">
                <div className="ui padded segment">
                    <form className="ui form">
                        <div className="two fields">
                            <div className="required field"><label for="question">Question</label>
                                <textarea rows="3"  name="question" id="question" aria-required="true">
                                </textarea>
                            </div>
                            <div className="ui grouped fields">
                                <fieldset>
                                    <legend>Difficulty</legend>
                                    <div className="inline fields">
                                        <div className="field">
                                            <div className="ui radio checkbox">
                                                <input type="radio" id="easy" checked="" tabindex="0" className="hidden" />
                                                <label for="easy">Easy</label>
                                            </div>
                                        </div>
                                        <div className="field">
                                            <div className="ui radio checkbox">
                                                <input type="radio" id="moderate" checked="" tabindex="0" className="hidden" />
                                                <label for="easy">Moderate</label>
                                            </div>
                                        </div><div className="field">
                                        <div className="ui radio checkbox">
                                            <input type="radio" id="Hard" checked="" tabindex="0" className="hidden" />
                                            <label for="easy">Hard</label>
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
                                        <input type="checkbox" name="example1" id="answer1" tabindex="0" className="hidden" />
                                        <label for="answer1"></label>
                                    </div>
                                    <input style="width:680px;" type="text" name="response1" id="response1" />
                                    <label for="response1"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        <input  type="checkbox" name="example1" id="answer2" tabindex="0" className="hidden" />
                                        <label for="answer2"></label>
                                    </div>
                                    <input style="width:680px;" type="text" name="response2" id="response2" />
                                    <label for="response2"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        <input type="checkbox" name="example1" id="answer3" tabindex="0" className="hidden" />
                                        <label for="answer3"></label>
                                    </div>
                                    <input style="width:680px;" type="text" name="response3" id="response3" />
                                    <label for="response3"></label>
                                </div>
                                <div className="inline field">
                                    <div className="ui checkbox">
                                        <input  type="checkbox" name="example1" id="answer4" tabindex="0" className="hidden" />
                                        <label for="answer4"></label>
                                    </div>
                                    <input type="text" style="width:680px;" name="response4" id="response4" />
                                    <label for="response4"></label>
                                </div>
                            </fieldset>
                        </div>
                        <div className="field">
                            <label for="explanation">Explanation (optional)</label>
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
