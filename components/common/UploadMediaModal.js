import PropTypes from 'prop-types';
import React from 'react';
import Dropzone from 'react-dropzone';
import FocusTrap from 'focus-trap-react';
import {Button, Icon, Image, Input, Modal, Divider, TextArea, Dropdown, Popup} from 'semantic-ui-react';
import updateGraphic from '../../actions/media/updateGraphic';
import uploadMediaFiles from '../../actions/media/uploadMediaFiles';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import {isEmpty} from '../../common';
import cancelUploadMediaFile from '../../actions/media/cancelUploadMediaFile';
import SlideEditStore from '../../stores/SlideEditStore';
import MediaStore from '../../stores/MediaStore';
import {FormattedMessage, defineMessages} from 'react-intl';

class UploadMediaModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            activeTrap: false,
            active: true,
            files: [],
            license: false,
            licenseValue: 'CC0',
            copyrightHolder: '',
            alt: '',
            title: '',
            isLoading: false
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.showLicense = this.showLicense.bind(this);
        this.receiveDroppedFile = this.receiveDroppedFile.bind(this);
        this.submitPressed = this.submitPressed.bind(this);
        this.messages = defineMessages({
            swal_error_title : {
                id: 'uploadMediaModal.swal_error_title',
                defaultMessage:'Error'
            },
            swal_error_text :{
                id: 'uploadMediaModal.swal_error_text',
                defaultMessage:'Reading the selected file failed. Check you privileges and try again'
            },
            drop_message1:{
                id: 'uploadMediaModal.drop_message1',
                defaultMessage: 'Drop a file directly from your filebrowser here to upload it.'
            },
            drop_message2:{
                id: 'uploadMediaModal.drop_message2',
                defaultMessage: 'Alternatively, click'
            },
            drop_message3:{
                id: 'uploadMediaModal.drop_message3',
                defaultMessage: 'or anywhere around this text to select a file to upload.'
            },
            drop_message4:{
                id: 'uploadMediaModal.drop_message4',
                defaultMessage: 'Not the right image? Click on the image to upload another one.'
            },
            upload_button_aria:{
                id: 'uploadMediaModal.upload_button_aria',
                defaultMessage:'select file to upload'
            },
            upload_button_label:{
                id:'uploadMediaModal.upload_button_label',
                defaultMessage:'choose file'
            },
            modal_heading1:{
                id:'uploadMediaModal.modal_heading1',
                defaultMessage: 'Add image - upload image file from your computer'
            },
            modal_description1:{
                id:'uploadMediaModal.modal_description1',
                defaultMessage: 'This modal is used to upload media files and to provide additional information about these.'
            },
            modal_heading2:{
                id:'uploadMediaModal.modal_heading2',
                defaultMessage: 'License information'
            },
            modal_description2:{
                id:'uploadMediaModal.modal_description2',
                defaultMessage:'Please confirm the title, alt text and licence for this image.'
            },
            copyrightHolder_label:{
                id:'uploadMediaModal.copyrightHolder_label',
                defaultMessage:'Image created by/ attributed to:'
            },
            copyrightHolder_aria_label:{
                id: 'uploadMediaModal.copyrightHolder_aria_label',
                defaultMessage:'Copyrightholder'
            },
            media_title_label:{
                id: 'uploadMediaModal.media_title_label',
                defaultMessage:'Title:'
            },
            media_title_aria:{
                id: 'uploadMediaModal.media_title_aria',
                defaultMessage:'Title of the image'
            },
            media_altText_label:{
                id: 'uploadMediaModal.media_altText_label',
                defaultMessage:'Description/Alt'
            },
            media_altText_aria:{
                id: 'uploadMediaModal.media_altText_aria',
                defaultMessage: 'Description of the image',
            },
            media_altText_content:{
                id: 'uploadMediaModal.media_altText_content',
                defaultMessage: 'What does the picture mean?'
            },
            media_license_label:{
                id: 'uploadMediaModal.licence_label',
                defaultMessage:'Select a license:'
            },
            media_license_aria:{
                id: 'uploadMediaModal.licence_content',
                defaultMessage:'Select a license'

            },
            media_terms_aria:{
                id:'uploadMediaModal.media_terms_aria',
                defaultMessage:'Agree to terms and conditions'
            },
            media_terms_label1:{
                id:'uploadMediaModal.media_terms_label1',
                defaultMessage:'I confirm that I have the rights to upload this image as per the SlideWiki'
            },
            media_terms_label2:{
                id:'uploadMediaModal.media_terms_label2',
                defaultMessage:'terms and conditions'
            },
            media_terms_label3:{
                id:'uploadMediaModal.media_terms_label3',
                defaultMessage:'and that the'
            },
            media_terms_label4:{
                id:'uploadMediaModal.media_terms_label4',
                defaultMessage:'license information'
            },
            media_terms_label5:{
                id:'uploadMediaModal.media_terms_label5',
                defaultMessage:'I have provided is correct.'
            },
            submit_button_text1:{
                id:'uploadMediaModal.submit_button_text1',
                defaultMessage:'Next'
            },
            submit_button_text2:{
                id:'uploadMediaModal.submit_button_text2',
                defaultMessage:'Upload'
            },
            loading_text:{
                id:'uploadMediaModal.loading_text',
                defaultMessage:'Loading'
            },
            cancel_button:{
                id:'uploadMediaModal.cancel_button',
                defaultMessage:'Cancel'
            },
            background_aria:{
                id:'uploadMediaModal.background_aria',
                defaultMessage:'Use as background image?'
            },
            background_message1:{
                id:'uploadMediaModal.background_message1',
                defaultMessage:'Use as background image?'
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.files !== this.state.files && !isEmpty(this.state.files)){
            //TODO Bad approach to set focus, but setting it without timeout does not work
            setTimeout(() => {
                this.refs.UploadMediaModalSaveButton.focus();
            }, 100);
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleOpen(){
        $('#app').attr('aria-hidden','true');
        this.setState({
            modalOpen:true,
            activeTrap:true,
            isLoadingcopyrightHolder: false
        });
    }

    handleClose(){
        this.context.executeAction(cancelUploadMediaFile, {});
        $('#app').attr('aria-hidden','false');
        this.setState({
            modalOpen:false,
            activeTrap: false,
            files: [],
            license: false,
            licenseValue: 'CC0',
            copyrightHolder: '',
            alt: '',
            title: '',
            isLoading: false
        });
    }

    unmountTrap(){
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    showLicense() {
        this.setState({
            license: true
        });
    }

    onDrop(files) {
        this.setState({
            files
        });
    }

    receiveDroppedFile(file) {
        this.handleOpen();
        this.onDrop([file]);
    }

    changeLicense(event, data) {
        this.setState({
            licenseValue: data.value
        });
    }

    submitPressed(e) {
        e.preventDefault();
        if(this.state.copyrightHolder === undefined || this.state.copyrightHolder === ''){this.state.copyrightHolder = this.props.userFullName;}
        let fileType = this.state.files[0].type;

        let reader = new FileReader();

        reader.onloadend = (evt) => {
            console.log('read total length from file: ', reader.result.length, evt.target.readyState);
            if (evt.target.readyState === FileReader.DONE) {
                let payload = {
                    type: this.state.files[0].type,
                    license: this.state.licenseValue,
                    copyrightHolder: this.state.copyrightHolder,
                    title: this.state.title || this.state.files[0].name,
                    text: this.state.alt,
                    filesize: this.state.files[0].size,
                    filename: this.state.files[0].name,
                    checkbox_backgroundImage: $('#checkbox_backgroundImage')[0].checked,
                    bytes: null
                };

                if (fileType === 'image/svg+xml') {
                    payload.bytes = atob(reader.result.split('base64,')[1]);
                    payload.svg = payload.bytes;
                } else {
                    payload.bytes = reader.result;
                }
                this.context.executeAction(uploadMediaFiles, payload);
                this.setState({
                    isLoading: true
                });
            }
        };

        reader.onerror = (err) => {
            swal({
                title: this.context.intl.formatMessage(this.messages.swal_error_title),
                text: this.context.intl.formatMessage(this.messages.swal_error_text),
                type: 'error',
                confirmButtonText: 'Close',
                confirmButtonClass: 'negative ui button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            })
            .then(() => {
                return true;
            });
        };

        reader.readAsDataURL(this.state.files[0]);

        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.SlideEditStore.uploadMediaClick === 'true' && nextProps.SlideEditStore.uploadMediaClick !== this.props.SlideEditStore.uploadMediaClick) {
            this.handleOpen();
        }

        if (this.props.MediaStore.status === 'uploading') {
            if (nextProps.MediaStore.status === 'success') {
                this.handleClose();
            } else if (nextProps.MediaStore.status === 'error') {
                this.handleClose();
            }
        }

        if (nextProps.MediaStore.status === 'dropped') {
            this.receiveDroppedFile(nextProps.MediaStore.file);
        }
    }

    render() {
        this.context.getUser().username;
        let dropzone = '';
        if(this.state.files.length < 1){
            dropzone = <div className="dropzone">
              <Dropzone ref="initialDropzone" onDrop={this.onDrop.bind(this)} accept="image/*" multiple={false} className="ui grey inverted center aligned padded raised segment">
                <Icon name="cloud upload" size="massive"/>
                <p>{this.context.intl.formatMessage(this.messages.drop_message1)}</p>
                <p>{this.context.intl.formatMessage(this.messages.drop_message2)}
                <button id="upload" className="ui button" aria-label={this.context.intl.formatMessage(this.messages.upload_button_aria)}>
                <i className="upload icon large"></i>
                <label htmlFor="upload">{this.context.intl.formatMessage(this.messages.upload_button_label)}</label></button>
                {this.context.intl.formatMessage(this.messages.drop_message3)}</p>

              </Dropzone>
            </div>;
        } else { //TODO Implement a switch-case statement for other media files. Currently only works for images.
            dropzone = <div><div className="dropzone">
              <Dropzone onDrop={this.onDrop.bind(this)} accept="image/*" multiple={false} className="ui secondary clearing segment">
                <Image id="imageToProceed" src={this.state.files[0].preview} size="large" centered={true}/>
              </Dropzone>
            </div>
            <br/><p>{this.context.intl.formatMessage(this.messages.drop_message4)}</p></div>;
        }
        //let heading = 'Upload a media file';
        let heading = this.context.intl.formatMessage(this.messages.modal_heading1);
        let content = <div>
          <TextArea className="sr-only" id="UploadMediaModalDescription" value={this.context.intl.formatMessage(this.messages.modal_description1)} />
          {dropzone}
          </div>;
        let saveHandler= this.showLicense;
        let licenseBoxes = '';
        let submitButtonText = this.context.intl.formatMessage(this.messages.submit_button_text1);
        let submitButtonIcon = 'arrow right';
        if(this.state.license){
            heading = this.context.intl.formatMessage(this.messages.modal_heading2);
            //licenseBoxes = (this.state.licenseValue !== 'CC0') ? <div className="required field"><label htmlFor="copyrightHolder">Image created by/ attributed to:</label><Input id="copyrightHolder" aria-required="true" ref="copyrightHolder" name="copyrightHolder" onChange={this.handleChange.bind(this)} required defaultValue={this.props.userFullName}/></div> : '';
            licenseBoxes = (this.state.licenseValue !== 'CC0') ? <div className="required field">
            <label htmlFor="copyrightHolder">{this.context.intl.formatMessage(this.messages.copyrightHolder_label)}</label>
            <Input id="copyrightHolder" ref="copyrightHolder" name="copyrightHolder" onChange={this.handleChange.bind(this)} aria-label={this.context.intl.formatMessage(this.messages.copyrightHolder_aria_label)} aria-required="true" required defaultValue={this.props.userFullName}/></div> : '';
            content = <div>
              <TextArea className="sr-only" id="UploadMediaModalDescription" value={this.context.intl.formatMessage(this.messages.modal_description2)} />
              <Image src={this.state.files[0].preview} size="large" centered={true}/>
              <Divider/>
              <form className="ui form" onSubmit={this.submitPressed.bind(this)}>
                <div className="required field">
                  <label htmlFor="mediaTitle">{this.context.intl.formatMessage(this.messages.media_title_label)}</label>
                  <Input defaultValue={this.state.files[0].name} id="mediaTitle" ref="mediaTitle" name="title"
                    onChange={this.handleChange.bind(this)}
                    aria-label={this.context.intl.formatMessage(this.messages.media_title_aria)}
                    aria-required="true"
                    required autoFocus/>
                </div>
                <div className="field">
                  <div className="ui checkbox">
                    <input id="checkbox_backgroundImage" type="checkbox" tabIndex="0" id="checkbox_backgroundImage" ref="checkbox_backgroundImage"
                       aria-label={this.context.intl.formatMessage(this.messages.background_aria)}
                       aria-required="false"/>
                    <label htmlFor="checkbox_backgroundImage">{this.context.intl.formatMessage(this.messages.background_message1)}
                    </label>
                  </div>
                </div>                
                <div className="required field">
                  <label htmlFor="mediaAltText">{this.context.intl.formatMessage(this.messages.media_altText_label)} </label>
                  <Popup trigger={<input id="mediaAltText" ref="mediaAltText" id="UploadMediaModal_input_mediaAltText"
                                  name="alt" onChange={this.handleChange.bind(this)}
                                  aria-label={this.context.intl.formatMessage(this.messages.media_altText_aria)}
                                  aria-required="true" required/>}
                     content={this.context.intl.formatMessage(this.messages.media_altText_content)} position='top center'/>
                </div>
                <div className="required field">
                  <label htmlFor="mediaLicense">{this.context.intl.formatMessage(this.messages.media_license_label)}</label>
                  <Dropdown id="mediaLicense" selection
                    options={[{text: 'CC0 Public Domain', value: 'CC0'},
                            {text: 'CC-BY Creative Commons Attribution 4.0', value: 'CC BY 4.0'},
                            {text: 'CC-BY-SA Creative Common Attribution Share-Alike 4.0', value: 'CC BY SA 4.0'}]}
                    defaultValue='CC0'
                    onChange={this.changeLicense.bind(this)}
                    ref="mediaLicense"
                    aria-label={this.context.intl.formatMessage(this.messages.media_license_aria)}
                    aria-required="true" required/>
                </div>
                {licenseBoxes}
                <div className="required field">
                  <div className="ui checkbox">
                    <input id="terms" type="checkbox"
                       aria-label={this.context.intl.formatMessage(this.messages.media_terms_aria)}
                       aria-required="true" required/>
                    <label htmlFor="terms">{this.context.intl.formatMessage(this.messages.media_terms_label1)}
                      <a href="/terms"> {this.context.intl.formatMessage(this.messages.media_terms_label2)} </a>
                      {this.context.intl.formatMessage(this.messages.media_terms_label3)}
                      <a href="/license"> {this.context.intl.formatMessage(this.messages.media_terms_label4)} </a>
                      {this.context.intl.formatMessage(this.messages.media_terms_label5)}
                    </label>
                  </div>
                </div>
                <Button type='submit' id="UploadFormSubmitButton" style={{display: 'none'}}>Submit</Button> {/*black magic hack to trigger the form from the outside*/}
              </form>
              </div>;
            saveHandler = (() => {$('#UploadFormSubmitButton').click();});
            submitButtonText = this.context.intl.formatMessage(this.messages.submit_button_text2);
            submitButtonIcon = 'upload';
        }

        const buttonColorBlack = {
            color: 'black'
        };
        const uploadMediaModalStyle = {
            display: 'none'
        };
        /*trigger={
                <Button className="ui orange button" tabIndex='0' id="ChangePictureModalOpenButton" aria-hidden={this.state.modalOpen} onClick={this.handleOpen} value="">
                  <i className="upload icon large black"></i>
                  <a style={buttonColorBlack}>Add Image</a>
                </Button>
               }
        */

        return (
          <Modal trigger={
                  <Button style={uploadMediaModalStyle} className="ui orange button" tabIndex='0' id="ChangePictureModalOpenButton" aria-hidden={this.state.modalOpen} onClick={this.handleOpen} value="">
                  </Button>
                 }
              open={this.state.modalOpen}
              onClose={this.handleClose}
              size="small"
              role="dialog"
              id="UploadMediaModal"
              aria-labelledby="UploadMediaModalHeader"
              aria-describedby="UploadMediaModalDescription"
              tabIndex="0">
              <FocusTrap
                  id='focus-trap-UploadMediaModal'
                  className = "header"
                  active={this.state.activeTrap}
                  focusTrapOptions={{
                      onDeactivate: this.unmountTrap,
                      clickOutsideDeactivates: false,
                      //initialFocus: '#UploadMediaModalSaveButton',
                      initialFocus: '#upload',
                  }}>
                  <Modal.Header className="ui left aligned" as="h1" id="UploadMediaModalHeader">
                      {heading}
                  </Modal.Header>
                  <Modal.Content>
                    <Divider/>
                    {content}
                    {(this.state.isLoading === true) ? <div className="ui active dimmer">
                                                         <div className="ui text loader">
                                                          {this.context.intl.formatMessage(this.messages.loading_text)}
                                                         </div>
                                                        </div>
                                                      : ''}
                    <Divider />
                    <Modal.Actions className="ui center aligned" as="div" style={{'textAlign': 'right'}}>
                      <Button color='red' tabIndex="0" type="button"
                              aria-label={this.context.intl.formatMessage(this.messages.cancel_button)}
                              onClick={this.handleClose}
                              icon="minus circle"
                              labelPosition='left'
                              content={this.context.intl.formatMessage(this.messages.cancel_button)} />
                      <Button id="UploadMediaModalSaveButton"
                              ref="UploadMediaModalSaveButton"
                              color="green"
                              tabIndex="0"
                              type="button"
                              aria-label={submitButtonText}
                              onClick={saveHandler}
                              icon={submitButtonIcon}
                              labelPosition='left'
                              content={submitButtonText}
                              disabled={isEmpty(this.state.files)}/>
                    </Modal.Actions>
                  </Modal.Content>
              </FocusTrap>
          </Modal>
        );
    }
}

UploadMediaModal.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func,
    intl: PropTypes.object.isRequired
};

UploadMediaModal = connectToStores(UploadMediaModal, [SlideEditStore, MediaStore], (context, props) => {

    return {
        SlideEditStore: context.getStore(SlideEditStore).getState(),
        MediaStore: context.getStore(MediaStore).getState()
    };
});

export default UploadMediaModal;
