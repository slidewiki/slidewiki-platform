import React from 'react';
import Picture from './Picture';

import ChangePersonalData from './ChangePersonalData';

class ProfileSettings extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {

    }

    render() {
        return (
          <div>
              <div className="ui segments">

                  <div className="ui secondary segment">
                      <h3>Exchange picture</h3>
                  </div>
                  <div className="ui segment">
                      <Picture user={ this.props.user }/>
                  </div>

              </div>
              <div className="ui segments">

                  <div className="ui secondary segment">
                      <h3>Alter my personal data</h3>
                  </div>
                  <div className="ui segment">
                      <ChangePersonalData user={ this.props.user} failures={ this.props.failures }/>
                  </div>

              </div>
          </div>
        );
    }
}

ProfileSettings.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ProfileSettings;
