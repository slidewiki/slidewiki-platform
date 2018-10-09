import PropTypes from 'prop-types';
import React from 'react';
import FocusTrap from 'focus-trap-react';
import {Cropper} from 'slidewiki-react-image-cropper';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Button, Modal, Divider, TextArea} from 'semantic-ui-react';
import uploadMediaFile from '../../actions/media/uploadMediaFile';

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
        this.cropperWidth = this.refs.cropper.values().imgWidth;
        if(this.refs.cropper.values().imgWidth > this.refs.cropper.values().imgHeight)
            this.cropperWidth = this.refs.cropper.values().imgHeight;
        else
            this.cropperWidth = this.refs.cropper.values().imgWidth;
        this.forceUpdate();
    }

    uploadCroppedPicture(e) {
        const messages = defineMessages({
            modalTitle: {
                id: 'ChangeGroupPictureModal.modalTitle',
                defaultMessage: 'Photo selection not processible!',
            },
            modalText: {
                id: 'ChangeGroupPictureModal.modalText',
                defaultMessage: 'Sorry, we could not process your chosen selection. Please try again with a different photo or selection.',
            },
        });
        let payload = {};
        payload.bytes = this.refs.cropper.crop(170);
        payload.fileurl = this.props.filePath;
        payload.filesize = payload.picture.length - 22;// minus 22 for data:image/png;base64, which is the prefix
        payload.type = 'png';
        payload.license = 'CC0';
        payload.title = '';
        payload.text = '';
        // console.log('ChangePictureModal: uploadCroppedPicture:', payload);
        if(payload.picture.length > 50){ //check if this is a picture or not - if not, the base64 repesentation is about 5 chars
            this.context.executeAction(uploadMediaFile, payload);
            this.handleClose();
        } else {
            this.handleClose();
            swal({
                title: this.context.intl.formatMessage(messages.modalTitle),
                text: this.context.intl.formatMessage(messages.modalText),
                type: 'error',
                confirmButtonClass: 'ui primary button',
                buttonsStyling: false
            });
        }
    }

    render() {
        const messages = defineMessages({
            description: {
                id: 'ChangeGroupPictureModal.description',
                defaultMessage: 'This modal is used to crop and save a picture meant to be used as a group picture.',
            },
            cancel: {
                id: 'ChangeGroupPictureModal.cancel',
                defaultMessage: 'Cancel',
            },
            save: {
                id: 'ChangeGroupPictureModal.save',
                defaultMessage: 'Save',
            },
        });
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
                  id='focus-trap-ChangeGroupPictureModal'
                  className = "header"
                  active={this.state.activeTrap}
                  focusTrapOptions={{
                      onDeactivate: this.unmountTrap,
                      clickOutsideDeactivates: false,
                      initialFocus: '#ChangePictureModalSaveButton',
                  }}>
                  <Modal.Header className="ui left aligned" as="h1" id="ChangePictureModalHeader">
                    <FormattedMessage
                      id='ChangeGroupPictureModal.modalHeader'
                      defaultMessage='Crop your image'
                    />
                  </Modal.Header>
                  <Modal.Content>
                      <Divider />
                      <TextArea className="sr-only" id="ChangePictureModalDescription" value={this.context.intl.formatMessage(messages.description)}/>
                      <Cropper src={this.props.filePath} ref="cropper" fixedRatio={true} width={this.cropperWidth} height={this.cropperWidth} rate={1} limitHeight={400} styles={{source_img: {WebkitFilter: 'blur(3.5px)', filter: 'blur(3.5px)'}}} onImgLoad={this.handleImgLoad.bind(this)}/>
                      <Divider />
                      <Modal.Actions className="ui center aligned" as="div" style={{'textAlign': 'right'}}>
                        <Button color='red' tabIndex="0" type="button" aria-label={this.context.intl.formatMessage(messages.cancel)} onClick={this.handleClose} icon="minus circle" labelPosition='left' content={this.context.intl.formatMessage(messages.cancel)}/>
                        <Button id="ChangePictureModalSaveButton" color="green" tabIndex="0" type="button" aria-label={this.context.intl.formatMessage(messages.save)} onClick={this.uploadCroppedPicture} icon="save" labelPosition='left' content={this.context.intl.formatMessage(messages.save)}/>
                      </Modal.Actions>
                  </Modal.Content>
              </FocusTrap>
          </Modal>
        );
    }
}

ChangePictureModal.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default ChangePictureModal;
