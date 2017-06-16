import React from 'react';
import Dropzone from 'react-dropzone';
import FocusTrap from 'focus-trap-react';
import {Button, Icon, Image, Input, Modal, Divider, TextArea, Dropdown} from 'semantic-ui-react';

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
        console.log('Jay!');
        //TODO Upload + hand something to CKeditor
        //this.handleClose();
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
        let heading = 'Upload a media file';
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
            licenseBoxes = (this.state.licenseValue !== 'CC0') ? <div className="required field"><label>Attribution:</label><TextArea fluid ref="mediaAttribution" required/></div> : '';
            content = <div>
              <Image src={this.state.files[0].preview} size="large" centered={true}/>
              <Divider/>
              <form className="ui form" onSubmit={this.submitPressed.bind(this)}>
                <div className="required field">
                  <label>Title:</label>
                  <Input fluid defaultValue={this.state.files[0].name} ref="mediaTitle" required/>
                </div>
                <div className="required field">
                  <label>Alt Text:</label>
                  <input fluid ref="mediaAltText" required/>
                </div>
                <div className="required field">
                  <label>Choose a license:</label>
                  <Dropdown fluid fluid selection options={[{text: 'No Copyright Reserved (CC0)', value: 'CC0'},{text: 'Creative Commons Attribution (CC BY) 4.0', value: 'CC BY 4.0'},{text: 'Creative Common Attribution Share-Alike (CC BY SA) 4.0', value: 'CC BY SA 4.0'}]} defaultValue='CC0' onChange={this.changeLicense.bind(this)} ref="mediaLicense" required/>
                </div>
                {licenseBoxes}
                <div className="required field">
                  <div className="ui checkbox">
                    <input type="checkbox" required/>
                    <label>I assure that I am able to to upload and use this file and that the license information is correct.</label>
                  </div>
                </div>
                <Button type='submit' id="UploadFormSubmitButton" style={{display: 'none'}}>Submit</Button> {/*black magic hack to trigger the form from the outside*/}
              </form>
              </div>;
            saveHandler = (() => {$('#UploadFormSubmitButton').click();});
            submitButtonText = 'Upload';
            submitButtonIcon = 'upload';
        }

        return (
          <Modal trigger={
                  <Button tabIndex='-1' id="ChangePictureModalOpenButton" aria-hidden={this.state.modalOpen} basic onClick={this.handleOpen} value="">Upload Media File</Button>
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
