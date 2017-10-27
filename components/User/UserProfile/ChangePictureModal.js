import React from 'react';
import FocusTrap from 'focus-trap-react';
import {Cropper} from 'react-image-cropper';
import uploadPicture from '../../../actions/user/userprofile/uploadPicture';
import { Button, Modal, Divider, TextArea} from 'semantic-ui-react';

class ChangePictureModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            activeTrap: false
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.uploadCroppedPicture = this.uploadCroppedPicture.bind(this);
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
            activeTrap: false
        });
    }

    unmountTrap(){
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    uploadCroppedPicture(e) {
        let payload = {};
        Object.assign(payload, this.props.user);
        payload.picture = this.refs.cropper.crop({ maxWidth: 170 });//NOTE maxWidth is not used by the cropper
        payload.fileurl = this.props.filePath;
        payload.filesize = payload.picture.length - 22;// minus 22 for data:image/png;base64, which is the prefix
        payload.filetype = 'png';
        // console.log('ChangePictureModal: uploadCroppedPicture:', payload);
        if(payload.picture.length > 50){ //check if this is a picture or not - if not, the base64 repesentation is about 5 chars
            this.context.executeAction(uploadPicture, payload);
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
        }
    }

    render() {
        return (
          <Modal trigger={
                  <Button tabIndex='-1' id="ChangePictureModalOpenButton" aria-hidden={this.state.modalOpen} basic onClick={this.handleOpen} style={{'display': 'none'}}/>
                 }
              open={this.state.modalOpen}
              onClose={this.handleClose}
              size="small"
              role="dialog"
              id="ChangePictureModal"
              aria-labelledby="ChangePictureModalHeader"
              aria-describedby="ChangePictureModalDescription"
              tabIndex="0">
              <FocusTrap
                  id='focus-trap-ChangePictureModal'
                  className = "header"
                  active={this.state.activeTrap}
                  focusTrapOptions={{
                      onDeactivate: this.unmountTrap,
                      clickOutsideDeactivates: false,
                      initialFocus: '#ChangePictureModalSaveButton',
                  }}>
                  <Modal.Header className="ui left aligned" as="h1" id="ChangePictureModalHeader">
                      Crop your image
                  </Modal.Header>
                  <Modal.Content>
                      <Divider />
                      <TextArea className="sr-only" id="ChangePictureModalDescription" value="This modal is used to crop and save a picture meant to be used as a user-profile picture." />
                      <Cropper src={this.props.filePath} ref="cropper" fixedRatio={true} rate={1} styles={{source_img: {WebkitFilter: 'blur(3.5px)', filter: 'blur(3.5px)'}}}/>
                      <Divider />
                      <Modal.Actions className="ui center aligned" as="div" style={{'textAlign': 'right'}}>
                        <Button color='red' tabIndex="0" type="button" aria-label="Cancel" onClick={this.handleClose} icon="minus circle" labelPosition='left' content="Cancel"/>
                        <Button id="ChangePictureModalSaveButton" color="green" tabIndex="0" type="button" aria-label="Save" onClick={this.uploadCroppedPicture} icon="save" labelPosition='left' content="Save"/>
                      </Modal.Actions>
                  </Modal.Content>
              </FocusTrap>
          </Modal>
        );
    }
}

ChangePictureModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ChangePictureModal;
