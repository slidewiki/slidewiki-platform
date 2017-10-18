import React from 'react';
import FocusTrap from 'focus-trap-react';
import {Cropper} from 'react-image-cropper';
import changeUserData from '../../../actions/user/userprofile/changeUserData';
import { Button, Icon, Modal, Container, Segment, Menu,Label,Input,Divider, TextArea} from 'semantic-ui-react';

class ChangePictureModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            activeTrap: false
        };

        this.cropperWidth = 200;
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

    handleImgLoad(){
        console.log('here');
        console.log(this.refs.cropper.values());
        this.cropperWidth = this.refs.cropper.values().imgWidth;
        if(this.refs.cropper.values().imgWidth > this.refs.cropper.values().imgHeight)
            this.cropperWidth = this.refs.cropper.values().imgHeight;
        else
            this.cropperWidth = this.refs.cropper.values().imgWidth;
        this.forceUpdate();
    }

    uploadCroppedPicture(e) {
        let payload = {};
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
                      <TextArea className="sr-only" id="ChangePictureModalDescription" value="This windows allows you to crop and then save a picture meant to be used as a user-profile picture. The crop tool is set to maximum size." />
                      <Cropper src={this.props.filePath} ref="cropper" fixedRatio={true} width={this.cropperWidth} height={this.cropperWidth} rate={1} styles={{source_img: {WebkitFilter: 'blur(3.5px)', filter: 'blur(3.5px)'}}} onImgLoad={this.handleImgLoad.bind(this)}/>
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
