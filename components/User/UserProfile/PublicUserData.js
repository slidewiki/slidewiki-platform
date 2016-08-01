import React from 'react';
import ReactDOM from 'react-dom';
import Identicons from 'identicons-react';

class PublicUserData extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        let picture = '';
        if(this.props.user.picture === '')
            picture = <div className="ui small centered rounded bordered image"><Identicons id={this.props.user.uname} width={150} size={5} /></div>;
        else
            picture = <img src={this.props.user.picture} className="ui medium centered rounded bordered image"/>;
        return (
          <div>
            {picture}
            <h2>{this.props.user.fname} {this.props.user.lname}</h2>
            <h3>{this.props.user.uname}</h3>
            <p>{!this.isEmpty(this.props.user.description) ? <div>{this.props.user.description}</div> : ''}</p>
            <div className = "ui divider" />
            {!this.isEmpty(this.props.user.organization) ? <div><i className="ui users icon"/> {this.props.user.organization}<br/><br/></div> : ''}
            {!this.isEmpty(this.props.user.country) ? <div><i className="ui marker icon"/> {this.props.user.country}<br/><br/></div> : ''}
            {!this.isEmpty(this.props.user.website) ? <div><i className="ui marker icon"/> {this.props.user.website}<br/><br/></div> : ''}
            {!this.isEmpty(this.props.user.joined) ? <div><i className="ui marker icon"/> {this.props.user.joined}<br/><br/></div> : ''}
            <div className = "ui divider" />

          </div>
        );
    }

    isEmpty(toTest) {
        return (toTest === undefined ||
        toTest === null ||
        toTest === '' ||
        (toTest instanceof Object && Object.keys(toTest).length === 0) ||
        (toTest instanceof Array && toTest.length === 0));
    }
}

PublicUserData.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default PublicUserData;
