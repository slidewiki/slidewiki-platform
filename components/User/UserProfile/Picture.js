import React from 'react';
import ReactDOM  from 'react-dom';
import Identicons from 'identicons-react';
import editPicture from '../../../actions/user/userprofile/editPicture';

class Picture extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    uploadNewPicture(e) {}

    useGravatar(e) {}

    removePicture(e) {
        this.context.executeAction(editPicture, {remove: true});
    }

    render() {
        return (
          <div>
            <div className="ui centered  grid">
                <div className="eight wide column">
                  {this.props.imgURL === '' ?<div className="ui small centered rounded image"><Identicons id={this.props.uname} width={150} size={5} /></div> : <img src={this.props.imgURL} className="ui small centered rounded image"/> }
                </div>
                <div className="eight wide column">
                  <div className="ui vertical buttons">
                    <button className="ui blue labeled icon button" onClick={ this.uploadNewPicture.bind(this) }>
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
