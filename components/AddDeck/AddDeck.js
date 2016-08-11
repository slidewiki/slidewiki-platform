import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import AddDeckStore from '../../stores/AddDeckStore';
import addDeckShowWrongFields from '../../actions/addDeckShowWrongFields';
let ReactDOM = require('react-dom');
let classNames = require('classnames');

class AddDeck extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
    }
    componentDidUpdate(){
    }

    handleUpload(x) {
        console.log('handleUpload: ', x);
    }
    handleAddDeck(x) {
        console.log('handleAddDeck');

        //validate input
        const title = this.refs.input_title.value;
        const language = this.refs.select_languages.value;
        const description = this.refs.textarea_description.value;
        const theme = this.refs.select_themes.value;
        const licence = this.refs.select_licences.value;
        const tags = this.refs.input_tags.value.split(', ');
        const acceptedConditions = this.refs.checkbox_conditions.checked;
        console.log(title, language, description, theme, licence, tags, acceptedConditions);

        //check empty or not selected
        let everythingIsFine = true;
        let wrongFields = {};
        if (title === null || title === undefined || title === '') {
            wrongFields.title = true;
            everythingIsFine = false;
        }
        else {
            wrongFields.title = false;
        }
        if (language === null || language === undefined || language.length !== 2) {
            wrongFields.language = true;
            everythingIsFine = false;
        }
        else {
            wrongFields.language = false;
        }
        if (licence === null || licence === undefined || licence.length < 2) {
            wrongFields.licence = true;
            everythingIsFine = false;
        }
        else {
            wrongFields.licence = false;
        }
        if (acceptedConditions === false) {
            wrongFields.conditions = true;
            everythingIsFine = false;
        }
        else {
            wrongFields.conditions = false;
        }

        //call action to update view
        this.context.executeAction(addDeckShowWrongFields, wrongFields);

        //if everything is fine then create the deck
        if (everythingIsFine) {
            this.correctMetadata(title, language, description, theme, licence, tags, acceptedConditions);
        }
    }
    correctMetadata(title, language, description, theme, licence, tags, acceptedConditions) {

    }
    handleCancel(x) {
        console.log('handleCancel: ', x);
        //TODO: check if there already inputs which should be stored?

        this.context.executeAction(navigateAction, {
            url: '/'
        });
    }

    render() {
        let fieldClass_title = classNames({
            'required': true,
            'field': true,
            'error': this.props.AddDeckStore.wrongFields.title
        });
        let fieldClass_language = classNames({
            'required': true,
            'field': true,
            'error': this.props.AddDeckStore.wrongFields.language
        });
        let fieldClass_licence = classNames({
            'required': true,
            'field': true,
            'error': this.props.AddDeckStore.wrongFields.licence
        });
        let fieldClass_conditions = classNames({
            'required': true,
            'inline': true,
            'field': true,
            'error': this.props.AddDeckStore.wrongFields.conditions
        });
        let languageOptions = <select className="ui search dropdown" aria-labelledby="language" aria-required="true" ref="select_languages">
            <option>
                Select Language
            </option>
            <option value="TD" >
                Chad
            </option>
            <option value="CL" >
                Chile
            </option>
        </select>;
        let themeOptions = <select className="ui search dropdown" aria-labelledby="theme" ref="select_themes">
          <option value="" >Select Theme</option>
          <option value="DefaultTheme" >Default</option>
          <option value="TH1" >Theme1</option>
          <option value="TH2" >Theme2</option>
          <option value="TH3" >Theme3</option>
        </select>;
        let licenceOptions = <select className="ui search dropdown" aria-labelledby="license" ref="select_licences">
          <option value="" >Select License</option>
          <option value="CCBY" >CC BY</option>
          <option value="CCBHYSA" >CC BY-SA</option>
        </select>;
        return (
          <div className="ui container">
          <h3>Add deck</h3>
          <div className="ui grid">
              <div className="sixteen wide column">
                  <div className="ui grid">
                      <div className="two column row">
                          <div className="column">
                              <div className="ui primary button" aria-label="upload" tabIndex="0" onClick={this.handleUpload.bind(this)} >
                                  Upload file
                              </div>
                          </div>
                          <div className="column" ref="div_filename"></div>
                      </div>
                  </div>
                  <div className="ui progress" data-percent="60" ref="div_progress">
                      <div className="bar">
                          <div className="progress"></div>
                      </div>
                      <div className="label" ref="div_progress_text" ></div>
                  </div>
                  <form className="ui form upload">
                      <div className="two fields">
                          <div className={fieldClass_title} ref="div_title" >
                              <label>
                                  Title
                              </label>
                              <input type="text" name="deck-title" placeholder="Title" aria-required="true" ref="input_title" />
                          </div>
                          <div className={fieldClass_language} ref="div_languages" >
                              <label id="language">
                                  Language
                              </label>
                              {languageOptions}
                          </div>
                      </div>
                      <div className="field">
                          <label id="deck-description">Description</label>
                          <textarea rows="4" aria-labelledby="deck-description" ref="textarea_description" ></textarea>
                      </div>
                      <div className="two fields">
                          <div className="field" ref="div_themes" >
                              <label id="themes">Choose deck theme</label>
                                  {themeOptions}
                          </div>
                          <div className={fieldClass_licence} ref="div_licences" >
                              <label id="license">License</label>
                                  {licenceOptions}
                          </div>
                      </div>
                      <div className="fluid inline field ">
                          <i className="ui tags large icon" aria-label="Add tags"></i>
                          <input type="text" name="tags" placeholder="Add Tags" ref="input_tags" />
                      </div>
                      <div className={fieldClass_conditions} >
                          <div className="ui checkbox" ref="div_conditions" >
                              <input type="checkbox" tabIndex="0" aria-labelledby="terms" aria-required="true" ref="checkbox_conditions" />
                              <label id="terms">
                                  I agree to the terms and conditions
                              </label>
                          </div>
                      </div>
                  </form>
              </div>
              <div className="two column row">
                  <div className="column">
                      <div className="ui primary button" aria-label="submit" tabIndex="0" onClick={this.handleAddDeck.bind(this)} >
                          Add deck
                      </div>
                  </div>
                  <div className="column">
                      <div className="ui secondary button" aria-label="cancel" tabIndex="0" onClick={this.handleCancel.bind(this)} >
                          Cancel
                      </div>
                  </div>
              </div>
          </div>
      </div>
        );
    }
}


AddDeck.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
AddDeck = connectToStores(AddDeck, [AddDeckStore], (context, props) => {
    return {
        AddDeckStore: context.getStore(AddDeckStore).getState()
    };
});
export default AddDeck;
