import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { navigateAction} from 'fluxible-router';
import AddDeckStore from '../../stores/AddDeckStore';
import UserProfileStore from '../../stores/UserProfileStore';
import ImportStore from '../../stores/ImportStore';
import addDeckShowWrongFields from '../../actions/addDeck/addDeckShowWrongFields';
import addDeckSaveDeck from '../../actions/addDeck/addDeckSaveDeck';
import addDeckDestruct from '../../actions/addDeck/addDeckDestruct';
import addDeckDeleteError from '../../actions/addDeck/addDeckDeleteError';
import checkNoOfSlides from '../../actions/addDeck/checkNoOfSlides';
import importFinished from '../../actions/import/importFinished';
import uploadFile from '../../actions/import/uploadFile';
import storeTags from '../../actions/import/storeTags';
import ImportModal from '../Import/ImportModal';
import ImportPreviewModal from './ImportPreviewModal';
import LanguageDropdown from '../common/LanguageDropdown';
import TagInput from '../Deck/ContentModulesPanel/TagsPanel/TagInput';

import { Dropdown } from 'semantic-ui-react';
import { FormattedMessage, defineMessages } from 'react-intl';
import classNames from 'classnames';


import { educationLevels } from '../../lib/isced';

//TODO: update link to terms of use;

class AddDeck extends React.Component {
    constructor(props) {
        super(props);
        this.percentage = 0;
        
        this.state = {
            showPreviewModal: false
        };
        this.defaultTagNames = [];// used for saving defaultName properties for tags
    }
    componentDidMount() {
        // let that = this;
        /* deleted by Sole
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
        */
    }
    componentDidUpdate() {
        if (this.props.ImportStore.uploadProgress > 0 || (this.props.ImportStore.filename !== '' && this.props.ImportStore.uploadProgress === 100))
            this.updateProgressBar();
        if (this.props.ImportStore.uploadProgress === 0) {
            $('#progressbar_addDeck_upload').progress('reset');
            $('#progresslabel_addDeck_upload').text('');
        }

        if (this.props.ImportStore.error !== null)
            this.showError();
    }
    closePreviewModal() {
        // Reset form
        // this.initializeProgressBar();
        this.refs.checkbox_conditions.checked = false;
        this.refs.checkbox_imageslicense.checked = false;
        
        this.setState({showPreviewModal: false});
    }
    handleKeyPressUploadModal(event){
        if(event.key === 'Enter'){
            this.handleUploadModal(event);
        }
    }
    handleUploadModal(x) {
        //console.log('handleUploadModal: ', x);

        $('.ui.small.modal').modal('show');
    }
    handleKeyPressAddDeck(event) {
        if (event.key === 'Enter') {
            this.handleAddDeck(event);
        }
    }
    handleAddDeck(x) {
        //console.log('handleAddDeck');
        this.saveTags();
        
        this.context.executeAction(addDeckDeleteError, null);

        //validate input
        const title = this.refs.input_title.value;
        const language = this.refs.div_languages.getSelected();
        const description = this.refs.textarea_description.value;
        const theme = this.refs.select_themes.value;
        const { value: educationLevel } = this.refs.dropdown_level.getSelectedItem();
        // const license = this.refs.select_licenses.value;
        const license = 'CC BY-SA';//default license
        let tags = [...this.tagInput.getSelected(), ...this.topicInput.getSelected()];
        tags.forEach((tag) => {
            // check whether we have earlier assigned defaultName to tagName (in saveTags function) for this tag and restore the original state
            if (this.defaultTagNames.includes(tag.tagName)) {
                tag.defaultName = tag.tagName;
                delete tag.tagName;
            }
        });
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
        if (language === null || language === undefined || language.length < 2) {
            wrongFields.language = true;
            everythingIsFine = false;
        }
        else {
            wrongFields.language = false;
        }
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
            this.correctMetadata(title, language, description, theme, educationLevel, license, tags, acceptedConditions, acceptedImagesLicense);
        }
    }
    correctMetadata(title, language, description, theme, educationLevel, license, tags, acceptedConditions, acceptedImagesLicense) {
        if (this.props.ImportStore.filename !== '') {//import deck
            this.handleFileSubmit(title, language, description, theme, license, tags, acceptedConditions);
        } else {//create empty deck
            this.context.executeAction(addDeckSaveDeck, {
                title: title,
                language: language,
                description: description,
                theme: theme,
                educationLevel: educationLevel,
                license: license,
                tags: tags,
                deckId: this.props.ImportStore.deckId,
                selector: { id: this.props.ImportStore.deckId }
            });
        }
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
    handleRedirect() {
        //console.log('AddDeck: handleRedirect()');
        this.context.executeAction(importFinished, {});  // destroy import components state
        this.context.executeAction(navigateAction, {
            url: '/deck/' + this.props.AddDeckStore.redirectID + '/_/deck/' + this.props.AddDeckStore.redirectID
        });
    }
    updateProgressBar() {
        const progress_messages = defineMessages({
            uploading: {
                id: 'AddDeck.progress.uploading',
                defaultMessage: 'Uploading file',
            },
            converting: {
                id: 'AddDeck.progress.converting',
                defaultMessage: 'Converting file',
            },
            importing: {
                id: 'AddDeck.progress.importing',
                defaultMessage: 'Importing slide ',
            },
            of: {
                id: 'AddDeck.progress.of',
                defaultMessage: ' of ',
            },
            uploaded: {
                id: 'AddDeck.progress.uploaded',
                defaultMessage: 'Slides uploaded!',
            },
            imported: {
                id: 'AddDeck.progress.imported',
                defaultMessage: 'Imported ',
            },
            slides: {
                id: 'AddDeck.progress.slides',
                defaultMessage: ' slides',
            }
        });
        $('#progressbar_addDeck_upload').progress('set percent', this.props.ImportStore.uploadProgress);
        let noOfSlides = this.props.ImportStore.noOfSlides;
        let totalNoOfSlides = this.props.ImportStore.totalNoOfSlides;
        let progressLabel = this.context.intl.formatMessage(progress_messages.uploading);
        if (noOfSlides > 0) {
            if (this.props.ImportStore.uploadProgress === 100) {
                if (noOfSlides === totalNoOfSlides) {
                    progressLabel = this.context.intl.formatMessage(progress_messages.uploaded);
                } else {
                    progressLabel = this.context.intl.formatMessage(progress_messages.imported) + noOfSlides  + this.context.intl.formatMessage(progress_messages.of) + totalNoOfSlides + this.context.intl.formatMessage(progress_messages.slides);//this should not happen, but user should know in case it does
                }
            } else if (noOfSlides === 1) {
                progressLabel = this.context.intl.formatMessage(progress_messages.converting);
            } else {
                progressLabel = this.context.intl.formatMessage(progress_messages.importing) + noOfSlides + this.context.intl.formatMessage(progress_messages.of) + totalNoOfSlides;
            }
        }
        
        $('#progresslabel_addDeck_upload').text(parseInt(this.props.ImportStore.uploadProgress) + '% - ' + progressLabel);

        if (this.props.ImportStore.uploadProgress === 100) {
            if (this.props.ImportStore.deckId !== null) {
                if (!this.state.showPreviewModal) {
                    this.setState({
                        showPreviewModal: true
                    });
                }
            } else {
                const error_messages = defineMessages({
                    error_title_text: {
                        id: 'AddDeck.swal.error_title_text',
                        defaultMessage: 'Error',
                    },
                    error_text: {
                        id: 'AddDeck.swal.error_text',
                        defaultMessage: 'There was a problem with importing this file. Please, try again.',
                    },
                    error_confirm_text: {
                        id: 'AddDeck.swal.error_confirm_text',
                        defaultMessage: 'Close',
                    }
                });
                swal({
                    title: this.context.intl.formatMessage(error_messages.error_title_text),
                    text: this.context.intl.formatMessage(error_messages.error_text),
                    type: 'error',
                    confirmButtonText: this.context.intl.formatMessage(error_messages.error_confirm_text),
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

        const progress_messages = defineMessages({
            uploaded: {
                id: 'AddDeck.progress.uploaded',
                defaultMessage: 'Slides uploaded!',
            },
            failed: {
                id: 'AddDeck.progress.failed',
                defaultMessage: 'Upload failed!',
            }
        });
        $('#progressbar_addDeck_upload').progress({
            text: {
                // active  : 'Uploading: {percent}%',
                // active  : 'Importing: {percent}%',
                success: this.context.intl.formatMessage(progress_messages.uploaded),
                error: this.context.intl.formatMessage(progress_messages.failed)
            }
        });
    }
    showError() {
        //update progress bar
        $('#progressbar_addDeck_upload').progress('set error');
    }
    handleFileSubmit(title, language, description, theme, license, tags, acceptedConditions) {
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
            console.error('Submission not possible - no file or not pptx/odp/zip');
        }
    }
    
    saveTags() {
        let tags = this.tagInput.getSelected();
        tags.forEach((tag) => {
            if (!tag.tagName && tag.defaultName) {
                tag.tagName = tag.defaultName;//assign defaultName to tagName to avoid errors during the initialization of the TagInput component
                this.defaultTagNames.push((tag.defaultName));//save defaultName in the array so that in the end we can restore the tag state in handleAddDeck
            }
        });
        let topics = this.topicInput.getSelected();
        topics.forEach((topic) => {
            if (!topic.tagName && topic.defaultName) {
                topic.tagName = topic.defaultName;
                this.defaultTagNames.push((topic.defaultName));
            }
        });
        //save tags in the store so that they can be restored during the initialization of TagInput component
        this.context.executeAction(storeTags, {tags:tags, topics: topics});
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
        let themeOptions = <select className="ui search dropdown" id="themes" aria-labelledby="theme" ref="select_themes">
            <option value="default">White - Default</option>
            <option value="beige">Cream</option>
            <option value="black">Black</option>
            <option value="league">Dark Grey</option>
            <option value="sky">Pale Blue</option>
            <option value="solarized">Beige</option>
            <option value="moon">Dark Slate Blue</option>
            <option value="night">High Contrast 1</option>
            <option value="blood">High Contrast 2</option>
            <option value="serif">Serif</option>
            <option value="simple">Simple</option>
            <option value="openuniversity">Open University</option>
            <option value="odimadrid">ODI Madrid</option>
            <option value="oeg">OEG</option>
        </select>;
        // let licenseOptions = <select className="ui search dropdown" aria-labelledby="license" id="license" ref="select_licenses">
        //   <option value="CC BY-SA" >Creative Commons Attribution-ShareAlike</option>
        //   <option value="CC BY" >Creative Commons Attribution</option>
        //   <option value="CC0" >Creative Commons CC0 Public Domain</option>
        // </select>;


        const form_messages = defineMessages({
            hint_title: {
                id: 'AddDeck.form.hint_title',
                defaultMessage: 'Please enter a title.',
            },
            hint_language: {
                id: 'AddDeck.form.hint_language',
                defaultMessage: 'Please select a language.',
            },
            selected_message: {
                id: 'AddDeck.form.selected_message',
                defaultMessage: '(Selected for upload: {filename})',
            },
            button_create: {
                id: 'AddDeck.form.button_create',
                defaultMessage: 'Create deck',
            }
        });
        let hint_title = this.props.AddDeckStore.wrongFields.title ? this.context.intl.formatMessage(form_messages.hint_title) : undefined;
        let hint_language = this.props.AddDeckStore.wrongFields.language ? this.context.intl.formatMessage(form_messages.hint_language) : undefined;
        // let hint_license = this.props.AddDeckStore.wrongFields.license ? 'Please select a license.' : undefined;
        //let hint_tags = 'Please separate tags with ", " - one comma and one whitespace.';

        //check number of slides in order to update progressbar
        if (this.props.ImportStore.deckId !== null &&
            this.props.ImportStore.uploadProgress < 100 &&
            this.props.ImportStore.error === null) {
            setTimeout(() => {
                this.context.executeAction(checkNoOfSlides, { id: this.props.ImportStore.deckId });
            }, 100);
        }

        return (
            <div className="ui vertically padded grid container">
                <div className="sixteen wide column">
                    <h3>
                        <FormattedMessage
                            id='AddDeck.form.heading'
                            defaultMessage='Add a deck to SlideWiki' />
                    </h3>
                </div>
                <div className="sixteen wide column">
                    <form className="ui form upload">
                        <div className={fieldClass_title} data-tooltip={hint_title} ref="div_title" >
                            <label htmlFor="title">
                                <FormattedMessage
                                    id='AddDeck.form.label_title'
                                    defaultMessage='Title' />
                            </label>
                            <input type="text" placeholder="Title" id="title" aria-required="true" ref="input_title" />
                        </div>
                        <div className="two fields">
                            <div className={fieldClass_language}>
                                <label htmlFor="language">
                                    <FormattedMessage
                                        id='AddDeck.form.label_language'
                                        defaultMessage='Language' />
                                </label>
                                <LanguageDropdown type="spoken" required={true} tooltip={hint_language} ref="div_languages" aria-required="true" error={this.props.AddDeckStore.wrongFields.language} />
                            </div>
                            <div className="field" ref="div_themes" >
                                <label htmlFor="themes">
                                    <FormattedMessage
                                        id='AddDeck.form.label_themes'
                                        defaultMessage='Choose deck theme' />
                                </label>
                                {themeOptions}
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="deck-description" id="deck-description-label" >
                                <FormattedMessage
                                    id='AddDeck.form.label_description'
                                    defaultMessage='Description' />
                            </label>
                            <textarea rows="4" aria-labelledby="deck-description-label" ref="textarea_description" />
                        </div>
                        <div className="ui message" id="metadata">
                            <p>
                                <FormattedMessage
                                    id='AddDeck.form.metadata'
                                    values={{
                                        link_help: <a href="/help" target="_blank">
                                            <FormattedMessage id="add.help" defaultMessage="Help decks"/>
                                        </a>
                                    }}
                                    defaultMessage='Please select from the following lists to specify the education level and subject area of your deck. You can find out more about these options in our {link_help}.' />
                            </p>
                        </div>
                        <div className="two fields">
                            <div className="sr-only" id="describe_level"><FormattedMessage id='AddDeck.sr.education' defaultMessage='Select education level of deck content'/></div>
                            <div className="sr-only" id="describe_topic"><FormattedMessage id='AddDeck.sr.subject' defaultMessage='Select subject of deck content from autocomplete. Multiple subjects can be selected'/></div>
                            <div className="sr-only" id="describe_tags"><FormattedMessage id='AddDeck.sr.tags' defaultMessage='Add tags or keywords for your deck. Multiple tags can be provided.'/></div>
                            <div className="field">
                                <label htmlFor="level_input" id="level-label">
                                    <FormattedMessage id='DeckProperty.Education.Choose' defaultMessage='Choose Education Level' /></label>
                                <Dropdown id="level_input" fluid selection ref="dropdown_level" aria-labelledby="level-label" aria-describedby="describe_level"
                                    options={ [{ value: null, text: '' }, ...Object.entries(educationLevels).map(([value, text]) => ({value, text}) )] }
                                    defaultValue={null} />
                            </div>
                            <div className="field">
                                <label htmlFor="topics_input_field" id="topics_label"><FormattedMessage id='DeckProperty.Tag.Topic.Choose' defaultMessage='Choose Subject' /></label>
                                <TagInput id="topics_input_field" initialTags={this.props.ImportStore.topics} ref={(i) => (this.topicInput = i)} tagFilter={{ tagType: 'topic' }} aria-labelledby="topics_label" aria-describedby="describe_topic" />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="tags_input_field" id="tags_label"><FormattedMessage id='DeckProperty.Tag.Choose' defaultMessage='Choose Tags' /></label>
                            <TagInput id="tags_input_field" initialTags={this.props.ImportStore.tags} ref={(i) => (this.tagInput = i)} allowAdditions={true} aria-labelledby="tags_label" aria-describedby="describe_tags" />
                        </div>

                        <div className="ui message" id="uploadDesc">
                            <p>
                                <FormattedMessage
                                    id='AddDeck.form.format_message'
                                    defaultMessage='You can upload existing slides to your new deck in the following file formats: PowerPoint pptx, OpenOffice ODP, SlideWiki HTML downloads (*.zip files) and RevealJS slideshows (*.zip files).' />
                            </p>
                        </div>
                        <div className="ui grid">
                            <div className="two column row">
                                <div className="column">
                                    {/*
                                    <div className={btnClasses_upload} role="button" tabIndex="0" aria-describedby="uploadDesc" onClick={this.handleUploadModal.bind(this)} onKeyPress={this.handleKeyPressUploadModal.bind(this)}  >
                                        <FormattedMessage
                                            id='AddDeck.form.button_select'
                                            defaultMessage='Select file' />
                                    </div>
                                    */}
                                    <ImportModal savetags={this.saveTags.bind(this)}/>
                                    {/*    <Import />*/}

                                </div>
                                <div className="column" ref="div_filename">
                                    {filename ? this.context.intl.formatMessage(form_messages.selected_message, { filename: filename }) : ''}
                                </div>
                            </div>
                        </div>
                        <ImportPreviewModal isOpen={this.state.showPreviewModal} handleClose={this.closePreviewModal.bind(this)} />
                        <div className="ui indicating progress" ref="div_progress" id="progressbar_addDeck_upload" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" tabIndex="0" >
                            <div className="bar"></div>
                            <div className="label" ref="div_progress_text" id="progresslabel_addDeck_upload" aria-live="polite"></div>
                        </div>
                        <div className={fieldClass_conditions} >
                            <div className="ui checkbox" ref="div_conditions" >
                                <input type="checkbox" tabIndex="0" id="terms" aria-required="true" ref="checkbox_conditions" />
                                <label htmlFor="terms">
                                    <FormattedMessage
                                        id='AddDeck.form.label_terms1'
                                        defaultMessage='I agree to the SlideWiki ' />{' '}
                                    <a className="item" href="/terms" target="_blank">
                                        <FormattedMessage
                                            id='AddDeck.form.label_terms2'
                                            defaultMessage='terms and conditions' />
                                    </a>{' '}
                                    <FormattedMessage
                                        id='AddDeck.form.label_terms3'
                                        defaultMessage=' and that content I upload, create and edit can be published under a Creative Commons ShareAlike license.' />
                                </label>
                            </div>
                        </div>
                        <div className={fieldClass_imageslicense} >
                            <div className="ui checkbox" ref="div_imageslicense" >
                                <input type="checkbox" tabIndex="0" id="termsimages" aria-required="true" ref="checkbox_imageslicense" />
                                <label htmlFor="termsimages">
                                    <FormattedMessage
                                        id='AddDeck.form.label_termsimages'
                                        defaultMessage='I agree that images within my imported slides are in the public domain or made available under a Creative Commons Attribution (CC-BY or CC-BY-SA) license.' />
                                </label>
                            </div>
                        </div>

                        <div className="ui buttons">
                            <div className={btnClasses_submit} aria-label={this.context.intl.formatMessage(form_messages.button_create)} role="button" tabIndex="0" onClick={this.handleAddDeck.bind(this)} onKeyPress={this.handleKeyPressAddDeck.bind(this)} >
                                {this.context.intl.formatMessage(form_messages.button_create)}
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        );
    }
}


AddDeck.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};
AddDeck = connectToStores(AddDeck, [AddDeckStore, UserProfileStore, ImportStore], (context, props) => {
    return {
        AddDeckStore: context.getStore(AddDeckStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        ImportStore: context.getStore(ImportStore).getState()
    };
});
export default AddDeck;
