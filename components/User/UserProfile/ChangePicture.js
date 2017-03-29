import React from 'react';
import UserPicture from '../../common/UserPicture';
import changeUserData from '../../../actions/user/userprofile/changeUserData';
import {Cropper} from 'react-image-cropper';

class ChangePicture extends React.Component {

    constructor(){
        super();
        this.open = false;
        this.fielPath = '';
    }

    componentDidMount() {
        let that = this;
        $(this.refs.cropModal).modal({ observeChanges: true, closable: false, onVisible: function() {that.open = true; that.forceUpdate();}, onHidden:  function() {that.open = false; that.filePath = ''; that.forceUpdate();}});
    }

    openFileDialog() {
        $(this.refs.fileDialog).click();
    }

    openCropPictureModal(e) {
        this.filePath = URL.createObjectURL(e.target.files[0]);
        $(this.refs.cropModal).modal('show');
    }

    uploadCroppedPicture(e) {
        let payload = {};
        Object.assign(payload, this.props.user);
        payload.picture = this.refs.cropper.crop({ maxWidth: 170 });
        this.context.executeAction(changeUserData, payload);
        $(this.refs.cropModal).modal('hide');
    }

    useGravatar(e) {
        let payload = {};
        Object.assign(payload, this.props.user);
        payload.picture = 'gravatar'; //hack to work with action changeUserData
        this.context.executeAction(changeUserData, payload);
    }

    removePicture(e) {
        let payload = {};
        Object.assign(payload, this.props.user);
        payload.picture = '';
        this.context.executeAction(changeUserData, payload);
    }

    render() {
        return (
            <div>
                <div className="ui centered  grid">
                    <div className="eight wide column">
                        <UserPicture picture={ this.props.user.picture } username={ this.props.user.uname } link={ false } private={ true } width={ 150 } centered={ true } size={ 'small' }/>
                    </div>
                    <div className="eight wide column">
                        <div className="ui vertical buttons">
                            <input type="file" accept="image/*" style={{display: 'none'}} onChange={ this.openCropPictureModal.bind(this) } ref="fileDialog"/>
                            <button tabIndex="-1" className="ui primary labeled icon button" onClick={ this.openFileDialog.bind(this) }>
                                <i className="icon upload"/>Upload new Image
                            </button>
                            <div className="ui hidden divider"/>
                            <button className="ui teal labeled icon button" onClick={ this.useGravatar.bind(this) }>
                                <i className="icon user"/>Use Gravatar Image
                            </button>
                            <div className="ui hidden divider"/>
                            <button className="ui red labeled icon button" onClick={ this.removePicture.bind(this) }>
                                <i className="icon ban"/>Remove Image
                            </button>
                        </div>
                    </div>
                </div>
                <div className="ui modal" ref="cropModal">
                    <div className="header">
                        <h1>Crop your image</h1>
                    </div>
                    <div className="image content">
                        <div className="ui grid">
                            <div className="sixteen wide column">
                            {(this.open) ? <Cropper src={this.filePath} ref="cropper" fixedRatio={true} rate={1}/> : <div/>}
                            </div>
                        </div>

                    </div>
                    <div className="actions">
                        <div className="ui red right labeled icon deny button">
                            <i className="minus circle icon"></i> Abort
                        </div>
                        <div className="ui green right labeled icon button" onClick={this.uploadCroppedPicture.bind(this)}>
                          <i className="save icon"></i> Save
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ChangePicture.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ChangePicture;
