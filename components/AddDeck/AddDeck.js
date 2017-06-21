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
import checkNoOfSlides from '../../actions/addDeck/checkNoOfSlides';
import importFinished from '../../actions/import/importFinished';
import importCanceled from '../../actions/import/importCanceled';
import uploadFile from '../../actions/import/uploadFile';
import addActivity from '../../actions/activityfeed/addActivity';
import Import from '../Import/Import';
import Error from '../Error/Error';
import LanguageDropdown from '../common/LanguageDropdown';
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
                //console.log('modal cancelled');
                that.handleCancelSelectFile();
                $('.ui.small.modal').modal('hide');//Added to remove duplicate modals
            },
            onApprove : function(data) {
                //console.log('modal clicked on upload', data);
                // that.handleFileSubmit();
                $('.ui.small.modal').modal('hide');
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
        //console.log('handleUploadModal: ', x);

        $('.ui.small.modal').modal('show');
    }
    handleAddDeck(x) {
        //console.log('handleAddDeck');

        this.context.executeAction(addDeckDeleteError, null);

        //validate input
        const title = this.refs.input_title.value;
        const language = this.refs.div_languages.getSelected();
        const description = this.refs.textarea_description.value;
        const theme = this.refs.select_themes.value;
        // const license = this.refs.select_licenses.value;
        const license = 'CC BY-SA';//default license
        //const tags = this.refs.input_tags.value.split(', ');
        const tags = [];
        const acceptedConditions = this.refs.checkbox_conditions.checked;
        const acceptedImagesLicense = this.refs.checkbox_imageslicense.checked;
        //console.log(title, language, description, theme, license, tags, acceptedConditions);

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
        // if (license === null || license === undefined || license.length < 2) {
        //     wrongFields.license = true;
        //     everythingIsFine = false;
        // }
        // else {
        //     wrongFields.license = false;
        // }
        if (acceptedConditions === false) {
            wrongFields.conditions = true;
            everythingIsFine = false;
        }
        else {
            wrongFields.conditions = false;
        }
        if (acceptedImagesLicense === false) {
            wrongFields.imageslicense = true;
            everythingIsFine = false;
        }
        else {
            wrongFields.imageslicense = false;
        }

        //call action to update view
        this.context.executeAction(addDeckShowWrongFields, wrongFields);

        //if everything is fine then create the deck
        if (everythingIsFine) {
            this.correctMetadata(title, language, description, theme, license, tags, acceptedConditions, acceptedImagesLicense);
        }
    }
    correctMetadata(title, language, description, theme, license, tags, acceptedConditions, acceptedImagesLicense) {
        if (this.props.ImportStore.filename !== '') {//import deck
            this.handleFileSubmit(title, language, description, theme, license, tags, acceptedConditions);
        } else {//create empty deck
            this.context.executeAction(addDeckSaveDeck, {
                title: title,
                language: language,
                description: description,
                theme: theme,
                license: license,
                tags: tags,
                userid: this.props.UserProfileStore.userid,
                deckId: this.props.ImportStore.deckId,
                selector: {id: this.props.ImportStore.deckId}
            });
        }
    }
    handleCancelSelectFile() {
        this.context.executeAction(importCanceled, {});
    }
    handleCancel(x) {
        //console.log('handleCancel: ', x);
        //TODO: check if there already inputs which should be stored?

        this.context.executeAction(addDeckDeleteError, null);
        this.context.executeAction(importFinished, {});  // destroy import components state
        this.context.executeAction(navigateAction, {
            url: '/'
        });
    }
    handleRedirect(){
        //console.log('AddDeck: handleRedirect()');
        this.context.executeAction(importFinished, {});  // destroy import components state
        this.context.executeAction(navigateAction, {
            url: '/deck/' + this.props.AddDeckStore.redirectID
        });
    }
    handleImportRedirect(){
        this.context.executeAction(importFinished, {});  // destroy import components state
        this.context.executeAction(navigateAction, {
            url: '/deck/' + this.props.ImportStore.deckId
        });
    }
    updateProgressBar() {
        //console.log('updateProgressBar() called!', this.props.ImportStore.uploadProgress);
        $('#progressbar_addDeck_upload').progress('set percent', this.props.ImportStore.uploadProgress);
        let noOfSlides = String(this.props.ImportStore.noOfSlides);
        let totalNoOfSlides = String(this.props.ImportStore.totalNoOfSlides);
        let progressLabel = (totalNoOfSlides === '0' && this.props.ImportStore.uploadProgress < 65) ? 'Uploading file' :
          (this.props.ImportStore.uploadProgress === 65) ? 'Converting file' :
          (this.props.ImportStore.uploadProgress !== 100) ? 'Importing slide ' + noOfSlides + ' of ' + totalNoOfSlides :
          (noOfSlides === totalNoOfSlides) ? 'Slides uploaded!' :
          'Imported ' + noOfSlides  + ' of ' + totalNoOfSlides + ' slides';//this should not happen, but user should know in case it does
        $('#progresslabel_addDeck_upload').text(parseInt(this.props.ImportStore.uploadProgress) + '% - ' + progressLabel);

        if (this.props.ImportStore.uploadProgress === 100) {
            if (this.props.ImportStore.deckId !== null) {
                // createActivity
                let activity = {
                    activity_type: 'add',
                    user_id: String(this.props.UserProfileStore.userid),
                    content_id: String(this.props.ImportStore.deckId) + '-1',
                    content_name: this.refs.input_title.value,
                    content_owner_id: String(this.props.UserProfileStore.userid),
                    content_kind: 'deck'
                };
                context.executeAction(addActivity, {activity: activity});

                swal({
                    title: 'Deck created!',
                    text: 'The selected file has been imported and a new deck nas been created.',
                    type: 'success',
                    confirmButtonText: 'View deck',
                    confirmButtonClass: 'positive ui button',
                    buttonsStyling: false
                })
                .then((dismiss) => {
                    this.handleImportRedirect();
                    return true;
                })
                .catch(() => {
                    return true;
                });
            } else {
                swal({
                    title: 'Error',
                    text: 'There was a problem with importing this file. Please, try again.',
                    type: 'error',
                    confirmButtonText: 'Close',
                    confirmButtonClass: 'negative ui button',
                    buttonsStyling: false
                })
                .then(() => {
                    return true;
                })
                .catch(() => {
                    return true;
                });
            }
        }
    }
    initializeProgressBar() {
        $('#progressbar_addDeck_upload').progress('set active');
        $('#progressbar_addDeck_upload').progress('reset');
        $('#progressbar_addDeck_upload').progress({
            text: {
                // active  : 'Uploading: {percent}%',
                // active  : 'Importing: {percent}%',
                success : 'Slides uploaded!',
                error   : 'Upload failed!'
            }
        });
    }
    showError() {
        //update progress bar
        $('#progressbar_addDeck_upload').progress('set error');
    }
    handleFileSubmit(title, language, description, theme, license, tags, acceptedConditions){
        //console.log('handleFileSubmit()');

        this.context.executeAction(addDeckDeleteError, null);

        if (this.props.ImportStore.file !== null) {

            //call action
            const payload = {
                title: title,
                language: language,
                description: description,
                theme: theme,
                license: license,
                tags: tags,
                filename: this.props.ImportStore.file.name,
                user: this.props.UserProfileStore.userid,
                jwt: this.props.UserProfileStore.jwt,
                base64: this.props.ImportStore.base64
            };
            this.initializeProgressBar();
            this.context.executeAction(uploadFile, payload);
        }
        else {
            console.error('Submission not possible - no file or not pptx/odp');
        }
    }

    render() {
        //redirect to new deck if created
        if (this.props.AddDeckStore.redirectID !== 0) {
            // setTimeout( () => {
            this.redirectID = this.props.AddDeckStore.redirectID;
            this.handleRedirect();
            this.context.executeAction(addDeckDestruct, {});
            // }, 1000);
        }


        let fieldClass_title = classNames({
            'required': true,
            'field': true,
            'error': this.props.AddDeckStore.wrongFields.title
        });
        // let fieldClass_license = classNames({
        //     'required': true,
        //     'field': true,
        //     'error': this.props.AddDeckStore.wrongFields.license
        // });
        let fieldClass_conditions = classNames({
            'required': true,
            'inline': true,
            'field': true,
            'error': this.props.AddDeckStore.wrongFields.conditions
        });
        let fieldClass_imageslicense = classNames({
            'required': true,
            'inline': true,
            'field': true,
            'error': this.props.AddDeckStore.wrongFields.imageslicense
        });
        let btnClasses_submit = classNames({
            'ui': true,
            'primary': true,
            'disabled': this.props.ImportStore.uploadProgress > 0 && this.props.ImportStore.uploadProgress < 100,
            'loading': this.props.ImportStore.uploadProgress > 0 && this.props.ImportStore.uploadProgress < 100,
            'button': true
        });
        let btnClasses_upload = classNames({
            'ui': true,
            'primary': true,
            'disabled': (this.props.ImportStore.uploadProgress > 0 && this.props.ImportStore.uploadProgress < 100) || this.props.ImportStore.isUploaded,
            'button': true

        });
        let fieldClass_language = classNames({
            'required': true,
            'field': true,
            'error': this.props.AddDeckStore.wrongFields.language
        });


        let filename = this.props.ImportStore.filename;
        if (filename.length > 40)
            filename = filename.substr(0, 40) + ' ...';

    /*    let themeOptions = <select className="ui search dropdown" aria-labelledby="theme" id="themes" ref="select_themes">
            <option value="default">Default - Reveal.js White</option>
            <option value="beige">Reveal.js Beige</option>
            <option value="black">Reveal.js Black</option>
            <option value="blood">Reveal.js Blood</option>
            <option value="league">Reveal.js League</option>
            <option value="moon">Reveal.js Moon</option>
            <option value="night">Reveal.js Night</option>
            <option value="serif">Reveal.js Serif</option>
            <option value="simple">Reveal.js Simple</option>
            <option value="sky">Reveal.js Sky</option>
            <option value="solarized">Reveal.js Solarized</option>
        </select>;
        */
        let themeOptions = <select className="ui search dropdown" id="themes" aria-labelledby="theme"  ref="select_themes">
            <option value="default">Default - Reveal.js White</option>
            <option value="beige">Reveal.js Beige</option>
            <option value="black">Reveal.js Black</option>
            <option value="blood">Reveal.js Blood</option>
            <option value="league">Reveal.js League</option>
            <option value="moon">Reveal.js Moon</option>
            <option value="night">Reveal.js Night</option>
            <option value="serif">Reveal.js Serif</option>
            <option value="simple">Reveal.js Simple</option>
            <option value="sky">Reveal.js Sky</option>
            <option value="solarized">Reveal.js Solarized</option>
            <option value="openuniversity">Open University Theme</option>
            <option value="odimadrid">ODI Madrid</option>
            <option value="oeg">OEG</option>
        </select>;
        // let licenseOptions = <select className="ui search dropdown" aria-labelledby="license" id="license" ref="select_licenses">
        //   <option value="CC BY-SA" >Creative Commons Attribution-ShareAlike</option>
        //   <option value="CC BY" >Creative Commons Attribution</option>
        //   <option value="CC0" >Creative Commons CC0 Public Domain</option>
        // </select>;


        let hint_title = this.props.AddDeckStore.wrongFields.title ? 'Please enter a title.' : undefined;
        let hint_language = this.props.AddDeckStore.wrongFields.language ? 'Please select a language.' : undefined;
        // let hint_license = this.props.AddDeckStore.wrongFields.license ? 'Please select a license.' : undefined;
        let hint_tags = 'Please separate tags with ", " - one comma and one whitespace.';

        //check number of slides in order to update progressbar
        if (this.props.ImportStore.deckId !== null &&
            this.props.ImportStore.uploadProgress < 100 &&
            this.props.ImportStore.error === null) {
            setTimeout( () => {
                this.context.executeAction(checkNoOfSlides, {id: this.props.ImportStore.deckId});
            }, 100);
        }

        return (
          <div className="ui vertically padded grid container">
              <div className="sixteen wide column">
                <h3>Add a deck to SlideWiki</h3>
              </div>
              <div className="sixteen wide column">
                  <form className="ui form upload">
                      <div className="two fields">
                        <div className={fieldClass_title} data-tooltip={hint_title} ref="div_title" >
                            <label htmlFor="title">
                                Title
                            </label>
                            <input type="text" placeholder="Title" id="title" aria-required="true" ref="input_title" />
                        </div>
                        <div className={fieldClass_language}>
                            <label htmlFor="language">Language</label>
                            <LanguageDropdown type="spoken" required={true} tooltip={hint_language} ref="div_languages" error={this.props.AddDeckStore.wrongFields.language} />
                        </div>
                      </div>

                      <div className="field">
                          <label htmlFor="deck-description">Description</label>
                          <textarea rows="4" aria-labelledby="deck-description" id="deck-description" ref="textarea_description" ></textarea>
                      </div>
                      <div className="two fields">
                          <div className="field" ref="div_themes" >
                              <label htmlFor="themes">Choose deck theme</label>
                                  {themeOptions}
                          </div>

                      </div>

                        <div className="ui message" id="uploadDesc">
                          <p>You can upload existing slides to your new deck. Currently only PowerPoint pptx and OpenOffice odp files are supported.</p>
                          </div>
                     <div className="ui grid">
                         <div className="two column row">
                          <div className="column">
                              <div className={btnClasses_upload} role="button" tabIndex="0" aria-describedby="uploadDesc" onClick={this.handleUploadModal.bind(this)} >
                                  Select file
                              </div>
                              <Import />
                          </div>
                          <div className="column" ref="div_filename">
                              {filename ? '"Selected for upload: '+filename+'"' : ''}
                          </div>
                      </div>
                  </div>
                  <div className="ui indicating progress" ref="div_progress" id="progressbar_addDeck_upload" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" tabIndex="0" >
                      <div className="bar"></div>
                      <div className="label" ref="div_progress_text" id="progresslabel_addDeck_upload" aria-live="polite"></div>
                  </div>
                      <div className={fieldClass_conditions} >
                          <div className="ui checkbox" ref="div_conditions" >
                              <input type="checkbox" tabIndex="0" id="terms" aria-required="true" ref="checkbox_conditions" />
                              <label htmlFor="terms">
                                  I agree to the SlideWiki <NavLink className="item" routeName="imprint">terms and conditions</NavLink> and that content I upload, create and edit can be published under a Creative Commons ShareAlike license.
                              </label>
                          </div>
                      </div>
                      <div className={fieldClass_imageslicense} >
                          <div className="ui checkbox" ref="div_imageslicense" >
                              <input type="checkbox" tabIndex="0" id="termsimages" aria-required="true" ref="checkbox_imageslicense" />
                              <label htmlFor="termsimages">
                                  I agree that images within my imported slides are in the public domain or made available under a Creative Commons ShareAlike license.
                              </label>
                          </div>
                      </div>

                      <div className="ui buttons">
                      <div className={btnClasses_submit} aria-label="Create deck" role="button" tabIndex="0" onClick={this.handleAddDeck.bind(this)} >
                          Create deck
                        </div>
                      </div>

                  </form>
              </div>
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
