import React from 'react';
import Dropzone from 'react-dropzone';
import FocusTrap from 'focus-trap-react';

import { Button, Icon, Image, Input, Modal, Divider, TextArea, Dimmer, Dropdown, Checkbox} from 'semantic-ui-react';

class UploadMediaModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            activeTrap: false,
            files: [],
            license: false
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.uploadMedia = this.uploadMedia.bind(this);
        this.showLicense = this.showLicense.bind(this);
        this.state = { files: [], active: true };
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
            license: false
        });
    }

    unmountTrap(){
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    uploadMedia(e) {

        /*let payload = {};
        Object.assign(payload, this.props.user);
        payload.picture = this.refs.cropper.crop({ maxWidth: 170 });
        if(payload.picture.length > 50){ //check if this is a picture or not - if not, the base64 repesentation is about 5 chars
            this.context.executeAction(changeUserData, payload);
            this.handleClose();
        } else {
            this.handleClose();
            swal({
                title: 'A wild error has been spotted!',
                text: 'There it is. You catched it! - Seems like we can not handle your picture. Please try another one.',
                type: 'error',
                confirmButtonClass: 'ui primary button',
                buttonsStyling: false
            });
        }*/
        this.handleClose();
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

    render() {
        let dropzone = '';
        if(this.state.files.length < 1){
            dropzone = <div className="dropzone">
              <Dropzone onDrop={this.onDrop.bind(this)} accept="image/*" multiple={false} className="ui grey inverted center aligned padded raised segment">
                <Icon name="cloud upload" size="massive"/>
                <p>Try drop a file here, or click to select a file to upload.</p>
              </Dropzone>
            </div>;
        } else {
            dropzone = <div><div className="dropzone">
              <Dropzone onDrop={this.onDrop.bind(this)} accept="image/*" multiple={false} className="ui secondary clearing segment">
                <Image src={this.state.files[0].preview} size="large" centered={true}/>
              </Dropzone>
            </div>
            <br/><p>Not the right image? Click on the image to upload another one!</p></div>;
        }
        let heading = 'Upload a media file';
        let content = <div>
          <TextArea className="sr-only" id="UploadMediaModalDescription" value="This modal is used to upload media files and to provide additional information about these." />
          {dropzone}
          </div>;
        let saveHandler= this.showLicense;
        if(this.state.license){
            heading = 'License information';
            content = <div>
              <Image src={this.state.files[0].preview} size="large" centered={true}/>
              <Divider/>
              <Input fluid label='Title:'/><br/>
              <Input fluid label='Alt Text:'/><br/>
              <Input fluid label='Owner:'/><br/>
              <Dropdown fluid placeholder='Select a license' fluid selection options={[{text: 'CC0', value: 'CC0'},{text: 'CC BY 4.0', value: 'CC BY 4.0'},{text: 'CC BY SA 4.0', value: 'CC BY SA 4.0'}]} /><br/>
              <Checkbox label='I am allowed to upload and use this file' />
              </div>;
            saveHandler = this.uploadMedia;
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
                      <Button id="UploadMediaModalSaveButton" color="green" tabIndex="0" type="button" aria-label="Upload" onClick={saveHandler} icon="upload" labelPosition='left' content="Upload"/>
                    </Modal.Actions>
                  </Modal.Content>
              </FocusTrap>
          </Modal>
        );
    }
}

export default UploadMediaModal;
