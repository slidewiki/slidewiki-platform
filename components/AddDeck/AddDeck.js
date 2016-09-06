import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import AddDeckStore from '../../stores/AddDeckStore';
import UserProfileStore from '../../stores/UserProfileStore';
import ImportStore from '../../stores/ImportStore';
import addDeckShowWrongFields from '../../actions/addDeck/addDeckShowWrongFields';
import addDeckSaveDeck from '../../actions/addDeck/addDeckSaveDeck';
import addDeckDestruct from '../../actions/addDeck/addDeckDestruct';
import addDeckDeleteError from '../../actions/addDeck/addDeckDeleteError';
import importFinished from '../../actions/import/importFinished';
import uploadFile from '../../actions/import/uploadFile';
import Import from '../Import/Import';
import Error from '../Error/Error';
let ReactDOM = require('react-dom');
let classNames = require('classnames');

//TODO: update link to terms of use;

class AddDeck extends React.Component {
    constructor(props) {
        super(props);
        this.percentage = 0;
    }
    componentDidMount() {
        let that = this;
        $('.ui.small.modal').modal({
            onDeny: function(){
                console.log('modal cancelled');
            },
            onApprove : function(data) {
                console.log('modal clicked on upload', data);
                that.handleFileSubmit();
            }
        });
    }
    componentDidUpdate() {
        if (this.props.ImportStore.uploadProgress > 0 || (this.props.ImportStore.filename !== '' && this.props.ImportStore.uploadProgress === 100))
            this.updateProgressBar();

        if (this.props.ImportStore.error !== null)
            this.showError();
    }

    handleUploadModal(x) {
        console.log('handleUploadModal: ', x);

        $('.ui.small.modal').modal('show');
    }
    handleAddDeck(x) {
        console.log('handleAddDeck');

        this.context.executeAction(addDeckDeleteError, null);

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
        if (language === null || language === undefined || language.length !== 5) {
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
        this.context.executeAction(addDeckSaveDeck, {
            title: title,
            language: language,
            description: description,
            theme: theme,
            licence: licence,
            tags: tags,
            userid: this.props.UserProfileStore.userid,
            deckId: this.props.ImportStore.deckId
        });
    }
    handleCancel(x) {
        console.log('handleCancel: ', x);
        //TODO: check if there already inputs which should be stored?

        this.context.executeAction(addDeckDeleteError, null);
        this.context.executeAction(importFinished, {});  // destroy import components state
        this.context.executeAction(navigateAction, {
            url: '/'
        });
    }
    handleRedirect(){
        console.log('AddDeck: handleRedirect()');
        this.context.executeAction(importFinished, {});  // destroy import components state
        this.context.executeAction(navigateAction, {
            url: '/deck/' + this.props.AddDeckStore.redirectID
        });
    }
    updateProgressBar() {
        console.log('updateProgressBar() called!', this.props.ImportStore.uploadProgress);

        $('#progressbar_addDeck_upload').progress('set percent', this.props.ImportStore.uploadProgress);
    }
    initializeProgressBar() {
        $('#progressbar_addDeck_upload').progress('set active');
        $('#progressbar_addDeck_upload').progress('reset');
        $('#progressbar_addDeck_upload').progress({
            text: {
                active  : 'Uploading: {percent}%',
                success : 'Slides uploaded!',
                error   : 'Upload failed!'
            }
        });
    }
    showError() {
        //update progress bar
        $('#progressbar_addDeck_upload').progress('set error');
    }
    handleFileSubmit(){
        console.log('handleFileSubmit()');

        this.context.executeAction(addDeckDeleteError, null);

        if (this.props.ImportStore.file !== null) {
            //call action
            const payload = {
                filename: this.props.ImportStore.file.name,
                user: this.props.UserProfileStore.userid,
                base64: this.props.ImportStore.base64
            };
            this.initializeProgressBar();
            this.context.executeAction(uploadFile, payload);
        }
        else {
            console.error('Submission not possible - no file or not pptx');
        }
    }

    render() {
        //redirect to new deck if created
        if (this.props.AddDeckStore.redirectID !== 0) {
            setTimeout( () => {
                this.redirectID = this.props.AddDeckStore.redirectID;
                this.handleRedirect();
                this.context.executeAction(addDeckDestruct, {});
            }, 1000);
        }

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
        let btnClasses_submit = classNames({
            'ui': true,
            'primary': true,
            'disabled': this.props.ImportStore.uploadProgress > 0 && this.props.ImportStore.uploadProgress < 100,
            'button': true
        });
        let btnClasses_upload = classNames({
            'ui': true,
            'primary': true,
            'disabled': (this.props.ImportStore.uploadProgress > 0 && this.props.ImportStore.uploadProgress < 100) || this.props.ImportStore.isUploaded,
            'button': true
        });

        let filename = this.props.ImportStore.filename;
        if (filename.length > 40)
            filename = filename.substr(0, 40) + ' ...';

        let languageOptions = <select className="ui search dropdown" aria-labelledby="language" aria-required="true" ref="select_languages">
            <option>
                Select Language
            </option>
            <option value="en_EN" >
                English
            </option>
        </select>;
        let themeOptions = <select className="ui search dropdown" aria-labelledby="theme" ref="select_themes">
          <option value="DefaultTheme" >Default</option>
        </select>;
        let licenceOptions = <select className="ui search dropdown" aria-labelledby="license" ref="select_licences">
          <option value="CC0" >CC0</option>
          <option value="CC BY" >CC BY</option>
          <option value="CC BY-SA" >CC BY-SA</option>
        </select>;

        let errorView = '';
        if (this.props.AddDeckStore.error !== null)
            errorView = <Error error={this.props.AddDeckStore.error} />;
        else
            errorView = '';

        let hint_title = this.props.AddDeckStore.wrongFields.title ? 'The title is a must have.' : undefined;
        let hint_language = this.props.AddDeckStore.wrongFields.language ? 'The language is a must have.' : undefined;
        let hint_licence = this.props.AddDeckStore.wrongFields.licence ? 'The licence is a must have.' : undefined;
        let hint_tags = 'Please separate tags with ", " - one comma and one whitespace.';

        return (
          <div className="ui container">
          <h3>Add deck</h3>
          <div className="ui grid">
              <div className="sixteen wide column">
                  <div className="ui grid">
                      <div className="two column row">
                          <div className="column">
                              <div className={btnClasses_upload} aria-label="upload" tabIndex="0" onClick={this.handleUploadModal.bind(this)} >
                                  Upload file
                              </div>
                              <Import />
                          </div>
                          <div className="column" ref="div_filename">
                              {filename ? '"'+filename+'"' : ''}
                          </div>
                      </div>
                  </div>
                  <div className="ui progress" ref="div_progress" id="progressbar_addDeck_upload" >
                      <div className="bar">
                          <div className="progress"></div>
                      </div>
                      <div className="label" ref="div_progress_text" ></div>
                  </div>
                  <form className="ui form upload">
                      <div className="two fields">
                          <div className={fieldClass_title} data-tooltip={hint_title} ref="div_title" >
                              <label>
                                  Title
                              </label>
                              <input type="text" name="deck-title" placeholder="Title" aria-required="true" ref="input_title" />
                          </div>
                          <div className={fieldClass_language} data-tooltip={hint_language} ref="div_languages" >
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
                          <div className="field disabled" ref="div_themes" >
                              <label id="themes">Choose deck theme</label>
                                  {themeOptions}
                          </div>
                          <div className={fieldClass_licence} data-tooltip={hint_licence} ref="div_licences" >
                              <label id="license">License</label>
                                  {licenceOptions}
                          </div>
                      </div>
                      <div className="fluid inline field">
                          <i className="ui tags large icon" aria-label="Add tags"></i>
                          <input type="text" name="tags" placeholder="Add Tags" ref="input_tags" data-tooltip={hint_tags} />
                      </div>
                      <div className={fieldClass_conditions} >
                          <div className="ui checkbox" ref="div_conditions" >
                              <input type="checkbox" tabIndex="0" aria-labelledby="terms" aria-required="true" ref="checkbox_conditions" />
                              <label id="terms">
                                  I agree to the <a href="//platform.manfredfris.ch/termsOfUse">terms and conditions</a>
                              </label>
                          </div>
                      </div>
                  </form>
              </div>
              <div className="two column row">
                  <div className="column">
                      <div className={btnClasses_submit} aria-label="submit" tabIndex="0" onClick={this.handleAddDeck.bind(this)} >
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
          {errorView}
      </div>
        );
    }
}


AddDeck.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
AddDeck = connectToStores(AddDeck, [AddDeckStore, UserProfileStore, ImportStore], (context, props) => {
    return {
        AddDeckStore: context.getStore(AddDeckStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        ImportStore: context.getStore(ImportStore).getState()
    };
});
export default AddDeck;
