import React from 'react';
import ReactDom from 'react-dom';
import { Microservices } from '../../../configs/microservices';
import CategoryBox from './CategoryBox';
import UserSettings from './UserSettings';

class UserProfile extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return (
          <div className="ui grid page">

              <div className="four wide column">
                  <CategoryBox />
                  <div className="ui hidden divider"></div>
                  <CategoryBox />
              </div>

              <div className="twelve wide column">
                <UserSettings />
              </div>
          </div>
        );
    }
}

UserProfile.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserProfile;
