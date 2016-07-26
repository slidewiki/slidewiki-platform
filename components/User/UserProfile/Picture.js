import React from 'react';
import ReactDOM from 'react-dom';
import Identicons from 'identicons-react';
import md5 from 'md5';
import changeUserData from '../../../actions/user/userprofile/changeUserData';

class Picture extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    uploadNewPicture(e) {}

    useGravatar(e) {
        let payload = {};
        Object.assign(payload, this.props.user);
        payload.picture = 'https://www.gravatar.com/avatar/' + md5(payload.email.trim().toLowerCase()) + '?d=mm&s=300';
        this.context.executeAction(changeUserData, payload);
    }

    removePicture(e) {
        let payload = {};
        Object.assign(payload, this.props.user);
        payload.picture = '';
        this.context.executeAction(changeUserData, payload);
    }

    render() {
        let picture = '';
        if(this.props.user.picture === '')
            picture = <div className="ui small centered rounded bordered image"><Identicons id={this.props.user.uname} width={150} size={5} /></div>;
        else if(this.props.user.picture.includes('gravatar'))
            picture = <div data-tooltip="Not your picture? Please use your gravatar email." data-position="top center" data-inverted=""><img src={this.props.user.picture} className="ui small centered rounded bordered image"/></div>;
        else
            picture = <img src={this.props.user.picture} className="ui small centered rounded bordered image"/>;
        return (
          <div>
            <div className="ui centered  grid">
                <div className="eight wide column">
                  {picture}
                </div>
                <div className="eight wide column">
                  <div className="ui vertical buttons">
                    <button className="ui blue labeled icon button disabled" onClick={ this.uploadNewPicture.bind(this) }>
                      <i className="icon upload"/>Upload new Image
                    </button>
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
