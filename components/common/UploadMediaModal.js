import React from 'react';
import Dropzone from 'react-dropzone';
import FocusTrap from 'focus-trap-react';
import {Button, Icon, Image, Input, Modal, Divider, TextArea, Dropdown, Popup} from 'semantic-ui-react';
import uploadMediaFiles from '../../actions/media/uploadMediaFiles';

class UploadMediaModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            activeTrap: false,
            active: true,
            files: [],
            license: false,
            licenseValue: 'CC0'
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.showLicense = this.showLicense.bind(this);
        this.submitPressed = this.submitPressed.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleOpen(){
        $('#app').attr('aria-hidden','true');
        this.setState({
            modalOpen:true,
            activeTrap:true
        });
    }

    handleClose(){
        $('#app').attr('aria-hidden','false');
        this.setState({
            modalOpen:false,
            activeTrap: false,
            files: [],
            license: false,
            licenseValue: 'CC0'
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

    changeLicense(event, data) {
        this.setState({
            licenseValue: data.value
        });
    }

    submitPressed(e) {
        e.preventDefault();
        let context = this.context;
        let payload = {
            type: 'image',
            license: this.state.licenseValue,
            title: this.state.title || this.state.files[0].name,
            text: this.state.alt,
            filesize: this.state.files[0].size,
            filename: this.state.files[0].name,
            base64: ''
        };
        // console.log(this.state, payload, e.target);

        let reader = new FileReader();

        reader.onloadend = function () {
            // console.log(reader.result.substr(0,100));
            payload.base64 = reader.result;
            context.executeAction(uploadMediaFiles, payload);
        };

        reader.readAsDataURL(this.state.files[0]);

        return false;
    }

    render() {
        let dropzone = '';
        if(this.state.files.length < 1){
            dropzone = <div className="dropzone">
              <Dropzone onDrop={this.onDrop.bind(this)} accept="image/*" multiple={false} className="ui grey inverted center aligned padded raised segment">
                <Icon name="cloud upload" size="massive"/>
                <p>Try drop a file here, or click to select a file to upload.</p>
              </Dropzone>
            </div>;
        } else { //TODO Implement a switch-case statement for other media files. Currently only works for images.
            dropzone = <div><div className="dropzone">
              <Dropzone onDrop={this.onDrop.bind(this)} accept="image/*" multiple={false} className="ui secondary clearing segment">
                <Image src={this.state.files[0].preview} size="large" centered={true}/>
              </Dropzone>
            </div>
            <br/><p>Not the right image? Click on the image to upload another one.</p></div>;
        }
        //let heading = 'Upload a media file';
        let heading = 'Add image - upload image file from your computer';
        let content = <div>
          <TextArea className="sr-only" id="UploadMediaModalDescription" value="This modal is used to upload media files and to provide additional information about these." />
          {dropzone}
          </div>;
        let saveHandler= this.showLicense;
        let licenseBoxes = '';
        let submitButtonText = 'Next';
        let submitButtonIcon = 'arrow right';
        if(this.state.license){
            heading = 'License information';
            licenseBoxes = (this.state.licenseValue !== 'CC0') ? <div className="required field"><label>Image created by/ attributed to:</label><TextArea fluid ref="mediaAttribution" required/></div> : '';
            content = <div>
              <Image src={this.state.files[0].preview} size="large" centered={true}/>
              <Divider/>
              <form className="ui form" onSubmit={this.submitPressed.bind(this)}>
                <div className="required field">
                  <label>Title:</label>
                  <Input fluid defaultValue={this.state.files[0].name} ref="mediaTitle" name="title" onChange={this.handleChange.bind(this)} required/>
                </div>
                <div className="required field">
                  <label>Description/Alt Text:</label>
                  <Popup trigger={<input fluid ref="mediaAltText" id="UploadMediaModal_input_mediaAltText" name="alt" onChange={this.handleChange.bind(this)} required/>} content='What does the picture mean?' position='top center'/>
                </div>
                <div className="required field">
                  <label>Choose a license:</label>
                  <Dropdown fluid fluid selection options={[{text: 'CC0 Public Domain', value: 'CC0'},{text: 'CC-BY Creative Commons Attribution 4.0', value: 'CC BY 4.0'},{text: 'CC-BY-SA Creative Common Attribution Share-Alike 4.0', value: 'CC BY SA 4.0'}]} defaultValue='CC0' onChange={this.changeLicense.bind(this)} ref="mediaLicense" required/>
                </div>
                {licenseBoxes}
                <div className="required field">
                  <div className="ui checkbox">
                    <input type="checkbox" required/>
                    <label>I confirm that I have the rights to upload this image as per the SlideWiki terms and conditions and that the license information I have provided is correct.</label>{/*TODO Add a link to the slidewiki terms/cond site, currently not exising*/}
                  </div>
                </div>
                <Button type='submit' id="UploadFormSubmitButton" style={{display: 'none'}}>Submit</Button> {/*black magic hack to trigger the form from the outside*/}
              </form>
              </div>;
            saveHandler = (() => {$('#UploadFormSubmitButton').click();});
            submitButtonText = 'Upload';
            submitButtonIcon = 'upload';
        }

        const buttonColorBlack = {
            color: 'black'
        };

        return (
          <Modal trigger={
                  <Button className="ui orange button" tabIndex='0' id="ChangePictureModalOpenButton" aria-hidden={this.state.modalOpen} onClick={this.handleOpen} value="">
                    <i className="outline upload icon black"></i>
                    <a style={buttonColorBlack}>Add Image</a>
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
                      initialFocus: '#UploadMediaModalSaveButton',
                  }}>
                  <Modal.Header className="ui left aligned" as="h1" id="UploadMediaModalHeader">
                      {heading}
                  </Modal.Header>
                  <Modal.Content>
                    <Divider/>
                    {content}
                    <Divider />
                    <Modal.Actions className="ui center aligned" as="div" style={{'textAlign': 'right'}}>
                      <Button color='red' tabIndex="0" type="button" aria-label="Cancel" onClick={this.handleClose} icon="minus circle" labelPosition='left' content="Cancel"/>
                      <Button id="UploadMediaModalSaveButton" color="green" tabIndex="0" type="button" aria-label="Upload" onClick={saveHandler} icon={submitButtonIcon} labelPosition='left' content={submitButtonText}/>
                    </Modal.Actions>
                  </Modal.Content>
              </FocusTrap>
          </Modal>
        );
    }
}

export default UploadMediaModal;
