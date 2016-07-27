import React from 'react';
import ReactDom from 'react-dom';
import { Microservices } from '../../../configs/microservices';
import ActivityFeedPanel from '../../Deck/ActivityFeedPanel/ActivityFeedPanel';

class UserDecks extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

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
                      <div className="ui tiny image">
                        <img src="http://semantic-ui.com/images/wireframe/image.png"/>
                      </div>
                      <div className="content">
                        <a className="header">Semantic-Org/Semantic-UI</a>
                        <div className="description">Updated 10 mins ago</div>
                      </div>
                    </div>
                    <div className="item">
                      <div className="ui tiny image">
                        <img src="http://semantic-ui.com/images/wireframe/image.png"/>
                      </div>
                      <div className="content">
                        <a className="header">Semantic-Org/Semantic-UI-Docs</a>
                        <div className="description">Updated 22 mins ago</div>
                      </div>
                    </div>
                    <div className="item">
                      <div className="ui tiny image">
                        <img src="http://semantic-ui.com/images/wireframe/image.png"/>
                      </div>
                      <div className="content">
                        <a className="header">Semantic-Org/Semantic-UI-Meteor</a>
                        <div className="description">Updated 34 mins ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ui hidden divider" />
              <div className="ui segments">
                <div className="ui secondary segment">
                  <strong>Recently edited slides</strong>
                </div>
                <div className="ui segment">
                  <div className="ui relaxed divided list">
                    <div className="item">
                      <div className="ui tiny image">
                        <img src="http://semantic-ui.com/images/wireframe/image.png"/>
                      </div>
                      <div className="content">
                        <a className="header">Semantic-Org/Semantic-UI/Slide 4</a>
                        <div className="description">Updated 10 mins ago</div>
                      </div>
                    </div>
                    <div className="item">
                      <div className="ui tiny image">
                        <img src="http://semantic-ui.com/images/wireframe/image.png"/>
                      </div>
                      <div className="content">
                        <a className="header">Semantic-Org/Semantic-UI-Docs/Slide 20</a>
                        <div className="description">Updated 22 mins ago</div>
                      </div>
                    </div>
                    <div className="item">
                      <div className="ui tiny image">
                        <img src="http://semantic-ui.com/images/wireframe/image.png"/>
                      </div>
                      <div className="content">
                        <a className="header">Semantic-Org/Semantic-UI-Meteor/Slide 1</a>
                        <div className="description">Updated 34 mins ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="ui raised segment">

              </div>
              <div className="ui hidden divider" />
              <ActivityFeedPanel mode="user"/>
            </div>
          </div>
        );
    }
}

UserDecks.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserDecks;
