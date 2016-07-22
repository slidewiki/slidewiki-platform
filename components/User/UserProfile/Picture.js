import React from 'react';
import ReactDom from 'react-dom';

class Picture extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    uploadNewPicture(e) {}

    useGravatar(e) {}

    removeUser(e) {}

    render() {
        return (
          <div>
            <div className="ui centered  grid">
                <div className="eight wide column">
                  <img src="https://avatars2.githubusercontent.com/u/855967?v=3&s=460" className="ui small centered circular image"/>
                </div>
                <div className="eight wide column">
                  <div className="ui vertical buttons">
                    <button className="ui blue labeled icon button" onClick={ this.uploadNewPicture.bind(this) }>
                      <i className="icon upload"/>Upload new Image
                    </button>
                    <div className="ui hidden divider"/>
                    <button className="ui green labeled icon button" onClick={ this.useGravatar.bind(this) }>
                      <i className="icon upload"/>Use Gravater Image
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
