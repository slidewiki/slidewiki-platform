import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import ImportStore from '../../stores/ImportStore';
import storeFile from '../../actions/import/storeFile';
import importFinished from '../../actions/import/importFinished';
import importCanceled from '../../actions/import/importCanceled';
import ReactDOM  from 'react-dom';
import classNames from 'classnames';
import { Button, Icon, Modal, Container, Segment, TextArea, Popup } from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';
import {defineMessages} from 'react-intl';
//TODO - nice feature (later/non-critical) = drag & drop + upload multiple files

const MAX_FILESIZE_MB = 300;
const MAX_FILESIZE = MAX_FILESIZE_MB * 1024 * 1024;

class Import extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            activeTrap: false,
            cancelled: false,
            accepted: false,
            onShowError: false,
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.uploadButton = null;
        this.messages = defineMessages({
            modal_header:{
                id: 'importFileModal.modal_header',
                defaultMessage:'Upload your presentation'
            },
            swal_button:{
                id:'importFileModal.swal_button',
                defaultMessage:'Accept'

            },
            swal_message:{
                id:'importFileModal.swal_message',
                defaultMessage:'This file is not supported. Please, remember only pptx and odp files are supported.',
            },
            modal_selectButton:{
                id:'importFileModal.modal_selectButton',
                defaultMessage:'Select file',
            },
            modal_uploadButton:{
                id:'importFileModal.modal_uploadButton',
                defaultMessage:'Upload',
            },
            modal_explanation1:{
                id:'importFileModal.modal_explanation1',
                defaultMessage:'Select your presentation file and upload it to SlideWiki.'
            },
            modal_explanation2:{
                id:'importFileModal.modal_explanation2',
                defaultMessage:'Only PowerPoint (.pptx) and OpenOffice (.odp) are supported (Max size:'
            },
            modal_cancelButton:{
                id:'importFileModal.modal_cancelButton',
                defaultMessage:'Cancel'
            }

        });
    }

    componentDidUpdate(){
        if (this.props.ImportStore.file === null)
            $('#import_file_chooser').val('');
    }
    handleOpen(){
        $('#app').attr('aria-hidden','true');
        this.setState({
            modalOpen:true,
            activeTrap:true
        });
    }
    handleUpload(){
        this.setState({
            accepted:true
        });
        this.handleClose();

    }

    handleCancel(){
        if(!this.state.cancelled){

            this.setState({
                cancelled:true
            });
            if(this.props.ImportStore.fileReadyForUpload){
                this.context.executeAction(importCanceled, {});
            }
        }
        this.handleClose();
    }
    handleClose(){
        $('#app').attr('aria-hidden','false');
        this.setState({
            modalOpen:false,
            activeTrap:false
        });
    }
    unmountTrap(){
        if(!this.state.onShowError){
            if(!this.state.cancelled && !this.state.accepted){ //user clicks outside to cancel without pressing upload button
                this.setState({
                    cancelled:true
                });

                if(this.props.ImportStore.fileReadyForUpload){
                    this.context.executeAction(importCanceled, {});
                }
            }
            if(this.state.activeTrap){
                this.setState({
                    activeTrap:false,
                });
                $('#app').attr('aria-hidden','false');
            }
        }
    }
    handleFileSelect(evt){


        this.context.executeAction(importFinished, null);

        //console.log(evt.target.files[0]);
        let file = evt.target.files[0];
        if (file === null || file === undefined)
            file = {
                type: '',
                size: 0
            };

        //check metadata like size, file ending, ...
        let isCorrect = true;
        const filetype = file.type;
        const size = file.size;
        isCorrect = ( filetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                      filetype === 'application/wps-office.pptx' ||
                      filetype === 'application/vnd.oasis.opendocument.presentation' ) && ( size < MAX_FILESIZE );

        if (isCorrect) {
            let reader = new FileReader();

            function errorHandler(evt) {
                switch(evt.target.error.code) {
                    case evt.target.error.NOT_FOUND_ERR:
                        //console.error('File Not Found!');
                        break;
                    case evt.target.error.NOT_READABLE_ERR:
                        //console.error('File is not readable');
                        break;
                    case evt.target.error.ABORT_ERR:
                        //console.info('Cancel clicked');
                        break; // noop
                    default:
                        //console.error('An error occurred reading this file.', evt.target.error);
                };
            }

            let that = this;

            // Closures to capture the file information/data
            reader.onloadend = (function(theFile) {
                return function(e) {
                    //console.log('file was read: ', file);
                    //console.log('also', theFile);
                    //console.log(e.target.result.length, 'bytes');

                    //Save it to store
                    const payload = {
                        file: file ? file : theFile,
                        base64: e.target.result
                    };
                    that.context.executeAction(storeFile, payload);
                };
            })();
            reader.onerror = errorHandler;
            reader.onabort = function(e) {
              //  console.error('File read cancelled');
            };

            // Read in the file
            reader.readAsDataURL(file);
            //


            if(this.uploadButton){ //upload button rendered
                this.uploadButton.focus();
            }
        } else{
            this.setState({
                onShowError : true,
                activeTrap : false,
            });
            swal({
                title: this.context.intl.formatMessage(this.messages.modal_header),
                text:  this.context.intl.formatMessage(this.messages.swal_message),
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(this.messages.swal_button),
                confirmButtonClass: 'blue ui button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            })
          .then(() => {
              this.setState({
                  activeTrap : true,
                  onShowError : false,
              });
          });

        }

        return false;
    }
    render() {
        //variable for intermediate storage of output
        let outputDIV = '';

        let acceptedFormats = '.key, .odp, .pps, .ppsx, .ppt, .pptm, .pptx,  ';
        let btnClasses_upload = classNames({
            'ui': true,
            'primary': true,
            'disabled': (this.props.ImportStore.uploadProgress > 0 && this.props.ImportStore.uploadProgress < 100) || this.props.ImportStore.isUploaded,
            'button': true

        });

        let importBtn = <Popup trigger={<Button as="button" className={btnClasses_upload}
                                                    type="button"
                                                    aria-label="Select file"
                                                    aria-describedby="uploadDesc"
                                                    aria-hidden={this.state.modalOpen}
                                                    onClick={this.handleOpen}>
                                           {this.context.intl.formatMessage(this.messages.modal_selectButton)}
                                          </Button>}
                                content='Select file' on='hover'/>;
        let uploadButton = !this.props.ImportStore.fileReadyForUpload ?<Button ref={(upload) => {this.uploadButton = upload;}} color="blue" tabIndex="0" icon type="button" aria-label={this.context.intl.formatMessage(this.messages.modal_uploadButton)} data-tooltip={this.context.intl.formatMessage(this.messages.modal_uploadButton)} disabled ><Icon name="upload" /> {this.context.intl.formatMessage(this.messages.modal_uploadButton)}</Button>:
                                <Button ref={(upload) => {this.uploadButton = upload;}} color="blue" tabIndex="0" icon type="button" aria-label={this.context.intl.formatMessage(this.messages.modal_uploadButton)} data-tooltip={this.context.intl.formatMessage(this.messages.modal_uploadButton)} onClick={this.handleUpload} ><Icon name="upload" />{this.context.intl.formatMessage(this.messages.modal_uploadButton)}
                                </Button>;

        outputDIV =   <Modal trigger={importBtn}
                             //Aqui estoy
                             open={this.state.modalOpen}
                             onClose={this.handleClose}
                             size="small"
                             role="dialog"
                             id="importFileModal"
                             aria-labelledby="importFileModalHeader"
                             aria-describedby="importFileModalDesc"
                             tabIndex="0"
                      >
                          <FocusTrap
                              id="focusTrapImportFileModal"
                              className="header"
                              active={this.state.activeTrap}
                              focusTrapOptions={{
                                  onDeactivate: this.unmountTrap,
                                  clickOutsideDeactivate: true,
                                  initialFocus:'#importFileModalDesc'
                              }}
                          >
                            <Modal.Header className="ui center aligned" as="h1" id="importFileModalHeader">
                                {this.context.intl.formatMessage(this.messages.modal_header)}
                            </Modal.Header>
                            <Modal.Content>
                              <Container>
                                <Segment color="blue" textAlign="center" padded>
                                  <Segment attached="bottom" textAlign="left">
                                      <div id="importFileModalDesc" tabIndex="0">
                                        <p>  {this.context.intl.formatMessage(this.messages.modal_explanation1)}</p>
                                        <p>{this.context.intl.formatMessage(this.messages.modal_explanation2)}{MAX_FILESIZE_MB}MB).</p>
                                      </div>
                                      <div className="ui input file focus animated">
                                        <input  accept={ acceptedFormats + 'application/vnd.openxmlformats-officedocument.presentationml.presentation'} type="file" tabIndex="0" onChange={this.handleFileSelect.bind(this)}  id="import_file_chooser" ></input>
                                      </div>

                                  </Segment>
                                  <Modal.Actions>
                                    {uploadButton}
                                    <Button color="grey" tabIndex="0" type="button" aria-label="Cancel" data-tooltip="Cancel" onClick={this.handleCancel} >
                                      {this.context.intl.formatMessage(this.messages.modal_cancelButton)}
                                    </Button>
                                  </Modal.Actions>
                                </Segment>
                              </Container>
                            </Modal.Content>
                          </FocusTrap>
                      </Modal>;

                      //from https://github.com/risis-eu/risis-datasets/blob/2a790c3b20b6c83c775d144cd69393032cdfaf82/components/object/ObjectIEditor.js
                      //editor = <FileUploader spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} onEnterPress={this.handleEnterPress.bind(this)} allowActionByKey="1"/>;


        return outputDIV;
    }
}


Import.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};
Import = connectToStores(Import, [ImportStore], (context, props) => {
    return {
        ImportStore: context.getStore(ImportStore).getState()
    };
});
export default Import;
