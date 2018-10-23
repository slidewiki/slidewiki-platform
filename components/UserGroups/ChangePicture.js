import PropTypes from 'prop-types';
import React from 'react';
import UserPicture from '../common/UserPicture';
import ChangePictureModal from './ChangePictureModal';
import { FormattedMessage, defineMessages } from 'react-intl';
import saveUsergroup from '../../actions/usergroups/saveUsergroup';

class ChangePicture extends React.Component {

    constructor(){
        super();
        this.filePath = '';
        this.filesize = 0;
    }

    componentDidMount() {
        let that = this;
    }

    openFileDialog() {
        $(this.refs.fileDialog).click();
    }

    openCropPictureModal(e) {
        const messages = defineMessages({
            modalTitle: {
                id: 'ChangePicture.modalTitle',
                defaultMessage: 'Big file',
            },
            modalText: {
                id: 'ChangePicture.modalText',
                defaultMessage: 'The selected file is quite big (> 10MB). This could cause problems like a white profile picture. You should upload a smaller picture if you notice strange things.',
            },
            modalTitle2: {
                id: 'ChangePicture.modalTitle2',
                defaultMessage: 'Wrong file type',
            },
            modalText2: {
                id: 'ChangePicture.modalText2',
                defaultMessage: 'You have selected a file type that we currently do not support',
            },
        });
        this.filePath = URL.createObjectURL(e.target.files[0]);
        let toCheck = e.target.files[0].name.toLowerCase().trim();
        this.filesize = e.target.files[0].size;
        // console.log('filesize:', this.filesize);
        this.filetype = toCheck.substr(toCheck.length - 3);
        if(toCheck.endsWith('.jpg') || toCheck.endsWith('.jpeg') || toCheck.endsWith('.png')) {
            if (this.filesize > 10000000) {
                swal({
                    title: this.context.intl.formatMessage(messages.modalTitle),
                    text: this.context.intl.formatMessage(messages.modalText),
                    type: 'warning',
                    confirmButtonClass: 'ui primary button',
                    buttonsStyling: false
                }).then(() => {
                    this.forceUpdate();
                    $('#ChangeGroupPictureModalOpenButton').click();
                });
            }
            else {
                this.forceUpdate();
                $('#ChangeGroupPictureModalOpenButton').click();
            }
        } else
            swal({
                title: this.context.intl.formatMessage(messages.modalTitle2),
                text: this.context.intl.formatMessage(messages.modalText2),
                type: 'error',
                confirmButtonClass: 'ui primary button',
                buttonsStyling: false
            }).then(() => {});
        //The actual processing of the picture is implemented in the modal
    }

    removePicture(e) {
        let payload = {};
        Object.assign(payload, this.props.group);
        payload.picture = '';
        this.context.executeAction(saveUsergroup, payload);
    }

    render() {
        return (
            <div>
                <div className="ui centered  grid">
                    <div className="eight wide column">
                        <UserPicture picture={ this.props.group.picture } link={ false } private={ true } width={ 150 } centered={ true } size={ 'small' }/>
                    </div>
                    <div className="eight wide column">
                        <div className="ui vertical buttons">
                            <br />
                            <input type="file" accept="image/jpg, image/jpeg, image/png" style={{display: 'none'}} onChange={ this.openCropPictureModal.bind(this) } ref="fileDialog"/>
                            <button className="ui primary labeled icon button" onClick={ this.openFileDialog.bind(this) }>
                                <i className="icon upload"/>
                                <FormattedMessage
                                  id='ChangePicture.upload'
                                  defaultMessage='Upload new Image'
                                />
                            </button>
                            <div className="ui hidden divider"/>
                            <button className="ui red labeled icon button" onClick={ this.removePicture.bind(this) }>
                                <i className="icon ban"/>
                                <FormattedMessage
                                  id='ChangePicture.remove'
                                  defaultMessage='Remove Image'
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <ChangePictureModal ref='ChangePictureModal' filePath={this.filePath} filesize={this.filesize} filetype={this.filetype} group={this.props.group} />
            </div>
        );
    }
}

ChangePicture.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default ChangePicture;
