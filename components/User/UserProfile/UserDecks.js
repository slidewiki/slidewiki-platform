import React from 'react';
import ReactDom from 'react-dom';
import { Microservices } from '../../../configs/microservices';

class UserDecks extends React.Component {
    componentDidMount() {
        this.enableAccordion();
    }
    componentDidUpdate() {
        this.refreshAccordion();
    }
    enableAccordion(status) {
        $(this.refs.accordion).accordion();
        $(this.refs.language).dropdown();
    }
    refreshAccordion(status) {
        $(this.refs.accordion).accordion('refresh');
        $(this.refs.language).dropdown('refresh');
    }

    render() {
        return (
          <div className="ui stackable horitontally divided two column grid">
            <div className="column">
              <div className="ui segments">
                <div className="ui secondary segment">
                  <strong>My Decks</strong>
                </div>
                <div className="ui segment">
                  <div className="ui relaxed divided list">
                    <div className="item">
                      <i className="large folder middle aligned icon"></i>
                      <div className="content">
                        <a className="header">Semantic-Org/Semantic-UI</a>
                        <div className="description">Updated 10 mins ago</div>
                      </div>
                    </div>
                    <div className="item">
                      <i className="large folder middle aligned icon"></i>
                      <div className="content">
                        <a className="header">Semantic-Org/Semantic-UI-Docs</a>
                        <div className="description">Updated 22 mins ago</div>
                      </div>
                    </div>
                    <div className="item">
                      <i className="large folder middle aligned icon"></i>
                      <div className="content">
                        <a className="header">Semantic-Org/Semantic-UI-Meteor</a>
                        <div className="description">Updated 34 mins ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ui hidden divider" />
              <div className="ui raised segment">

              </div>
            </div>
            <div className="column">
              <div className="ui raised segment">

              </div>
              <div className="ui hidden divider" />
              <div className="ui raised segment">

              </div>
            </div>
          </div>
        );
    }
}

UserDecks.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserDecks;
