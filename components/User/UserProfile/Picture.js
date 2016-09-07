import React from 'react';
import UserPicture from '../../common/UserPicture';
import changeUserData from '../../../actions/user/userprofile/changeUserData';

class Picture extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    uploadNewPicture(e) {}

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
                            <div data-tooltip="This is currently not supported" data-position="right center" data-inverted="">
                                <button className="ui blue labeled icon button disabled" onClick={ this.uploadNewPicture.bind(this) }>
                                    <i className="icon upload"/>Upload new Image
                                </button>
                            </div>
                            <div className="ui hidden divider"/>
                            <button className="ui green labeled icon button" onClick={ this.useGravatar.bind(this) }>
                                <i className="icon user"/>Use Gravater Image
                            </button>
                            <div className="ui hidden divider"/>
                            <button className="ui red labeled icon button" onClick={ this.removePicture.bind(this) }>
                                <i className="icon ban"/>Remove Image
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Picture.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default Picture;
