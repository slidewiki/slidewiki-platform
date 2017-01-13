import React from 'react';
import ReactDOM from 'react-dom';
import UserPicture from '../../../../common/UserPicture';
let classNames = require('classnames');

const headerStyle = {
    'textAlign': 'center'
};
const modalStyle = {
    top: '15%'
};

class GroupDetailsModal extends React.Component {
    render() {
        let members = [];
        //first the creator
        members.push(
          (
            <div className="item" key={this.props.group.creator.userid}>
              <UserPicture avatar="true" size="tiny" bordered="false" picture={this.props.group.creator.picture} username={this.props.group.creator.username} />
              <div className="content">
                <a className="header" href={'/user/' + this.props.group.creator.username}>{this.props.group.creator.username}</a>
                <div className="description">
                  Group leader
                </div>
              </div>
            </div>
          )
        );
        if (this.props.group.members !== undefined && this.props.group.members.length > 0) {
            this.props.group.members.forEach((user) => {
                members.push(
                  (
                    <div className="item" key={user.userid}>
                      <img className="ui avatar image" src={user.picture} />
                      <div className="content">
                        <a className="header" href={'/user/' + user.username}>{user.username}</a>
                      </div>
                    </div>
                  )
                );
            });
        }

        return (
            <div className="ui groupdetails modal" ref='groupdetailsmodal' style={modalStyle}>
              <div className="header">
                  <h1 style={headerStyle}>Group details</h1>
              </div>
              <div className="content">
                <div className="ui container">
                  <h3 className="header" >{this.props.group.name}</h3>
                  <p>There are {this.props.group.members.length} member{(this.props.group.members.length !== 1) ? 's': ''} in this group.</p>
                  <div className="ui very relaxed  list">
                      {members}
                  </div>
                </div>
              </div>
              <div className="actions">
                <button type="cancel" className="ui cancel button">
                  <i className="remove icon"/>Close
                </button>
              </div>
            </div>
        );
    }
}

export default GroupDetailsModal;
