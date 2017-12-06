import React from 'react';
import Dropzone from 'react-dropzone';
import FocusTrap from 'focus-trap-react';
import {Button, Icon, Image, Input, Modal, Divider, TextArea, Dropdown, Popup} from 'semantic-ui-react';
import uploadMediaFiles from '../../actions/media/uploadMediaFiles';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import {isEmpty} from '../../common';

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
        this.submitPressed = this.submitPressed.bind(this);
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
            isLoading: false
        });
    }

    handleClose(){
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

    changeLicense(event, data) {
        this.setState({
            licenseValue: data.value
        });
    }

    submitPressed(e) {
        e.preventDefault();
        let that = this;
        if(this.state.copyrightHolder === undefined || this.state.copyrightHolder === ''){this.state.copyrightHolder = this.props.userFullName;}
        console.log('copyrighthodler: ' + this.state.copyrightHolder);
        let payload = {
            type: this.state.files[0].type,
            license: this.state.licenseValue,
            copyrightHolder: this.state.copyrightHolder,
            title: this.state.title || this.state.files[0].name,
            text: this.state.alt,
            filesize: this.state.files[0].size,
            filename: this.state.files[0].name,
            bytes: null
        };
        console.log(this.state, payload);

        let reader = new FileReader();

        reader.onloadend = function (evt) {
            console.log('read total length from file: ', reader.result.length, evt.target.readyState);

            if (evt.target.readyState === FileReader.DONE) {
                payload.bytes = reader.result;
                that.context.executeAction(uploadMediaFiles, payload);

                that.setState({
                    isLoading: true
                });
            }
        };

        reader.onerror = (err) => {
            swal({
                title: 'Error',
                text: 'Reading the selected file failed. Check you privileges and try again.',
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

    render() {
        this.context.getUser().username;
        let dropzone = '';
        if(this.state.files.length < 1){
            dropzone = <div className="dropzone">
                <Dropzone ref="initialDropzone" onDrop={this.onDrop.bind(this)} accept="image/*" multiple={false} className="ui grey inverted center aligned padded raised segment">
                    <Icon name="cloud upload" size="massive"/>
                    <p>Drop a file directly from your filebrowser here to upload it.</p><p>Alternatively, click <button id="upload" className="ui button" aria-label='select file to upload'><i className="outline upload icon large black"></i><label htmlFor="upload">choose file</label></button> or anywhere around this text to select a file to upload.</p>
                </Dropzone>
            </div>;
        } else { //TODO Implement a switch-case statement for other media files. Currently only works for images.
            dropzone = <div><div className="dropzone">
                <Dropzone onDrop={this.onDrop.bind(this)} accept="image/*" multiple={false} className="ui secondary clearing segment">
                    <Image id="imageToProceed" src={this.state.files[0].preview} size="large" centered={true}/>
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
            //licenseBoxes = (this.state.licenseValue !== 'CC0') ? <div className="required field"><label htmlFor="copyrightHolder">Image created by/ attributed to:</label><Input id="copyrightHolder" aria-required="true" ref="copyrightHolder" name="copyrightHolder" onChange={this.handleChange.bind(this)} required defaultValue={this.props.userFullName}/></div> : '';
            licenseBoxes = (this.state.licenseValue !== 'CC0') ? <div className="required field"><label htmlFor="copyrightHolder">Image created by/ attributed to:</label><Input id="copyrightHolder" ref="copyrightHolder" name="copyrightHolder" onChange={this.handleChange.bind(this)} aria-label="Copyrightholder" aria-required="true" required defaultValue={this.props.userFullName}/></div> : '';
            content = <div>
                <Image src={this.state.files[0].preview} size="large" centered={true}/>
                <Divider/>
                <form className="ui form" onSubmit={this.submitPressed.bind(this)}>
                    <div className="required field">
                        <label htmlFor="mediaTitle">Title:</label>
                        <Input defaultValue={this.state.files[0].name} id="mediaTitle" ref="mediaTitle" name="title" onChange={this.handleChange.bind(this)} aria-label="Title of the image" aria-required="true"required autoFocus/>
                    </div>
                    <div className="required field">
                        <label htmlFor="mediaAltText">Description/Alt Text:</label>
                        <Popup trigger={<input id="mediaAltText" ref="mediaAltText" id="UploadMediaModal_input_mediaAltText" name="alt" onChange={this.handleChange.bind(this)} aria-label="Description of the image" aria-required="true" required/>} content='What does the picture mean?' position='top center'/>
                    </div>
                    <div className="required field">
                        <label htmlFor="mediaLicense">Choose a license:</label>
                        <Dropdown id="mediaLicense" selection options={[{text: 'CC0 Public Domain', value: 'CC0'},{text: 'CC-BY Creative Commons Attribution 4.0', value: 'CC BY 4.0'},{text: 'CC-BY-SA Creative Common Attribution Share-Alike 4.0', value: 'CC BY SA 4.0'}]} defaultValue='CC0' onChange={this.changeLicense.bind(this)} ref="mediaLicense" aria-label="Select a license" aria-required="true" required/>
                    </div>
                    {licenseBoxes}
                    <div className="required field">
                        <div className="ui checkbox">
                            <input id="terms" type="checkbox" aria-label="Agree to terms and conditions" aria-required="true" required/>
                            <label htmlFor="terms">I confirm that I have the rights to upload this image as per the SlideWiki <a href="/imprint">terms and conditions</a> and that the <a href="/license">license information</a> I have provided is correct.</label>{/*TODO Add a link to the slidewiki terms/cond site, currently not exising*/}
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
                    <i className="outline upload icon large black"></i>
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
                        //initialFocus: '#UploadMediaModalSaveButton',
                        initialFocus: '#upload',
                    }}>
                    <Modal.Header className="ui left aligned" as="h1" id="UploadMediaModalHeader">
                        {heading}
                    </Modal.Header>
                    <Modal.Content>
                        <Divider/>
                        {content}
                        {(this.state.isLoading === true) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                        <Divider />
                        <Modal.Actions className="ui center aligned" as="div" style={{'textAlign': 'right'}}>
                            <Button color='red' tabIndex="0" type="button" aria-label="Cancel" onClick={this.handleClose} icon="minus circle" labelPosition='left' content="Cancel"/>
                            <Button id="UploadMediaModalSaveButton" ref="UploadMediaModalSaveButton" color="green" tabIndex="0" type="button" aria-label="Upload" onClick={saveHandler} icon={submitButtonIcon} labelPosition='left' content={submitButtonText} disabled={isEmpty(this.state.files)}/>
                        </Modal.Actions>
                    </Modal.Content>
                </FocusTrap>
            </Modal>
        );
    }
}

UploadMediaModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    getUser: React.PropTypes.func
};

export default UploadMediaModal;
