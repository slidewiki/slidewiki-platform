import React from 'react';
import { navigateAction } from 'fluxible-router';

class CategoryBox extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    changeTo(link) {
        this.context.executeAction(navigateAction, {url: link});
        return false;
    }

    render() {
        return (
          <div>
              <div className="ui segments">
                  <div className="ui secondary segment"><div className="ui header">Personal Settings</div></div>
                  <div className={'ui segment link'+ (this.props.highlight === 'profile' ? ' blue inverted' : '')} onClick={this.changeTo.bind(this, '/user/' + this.props.username + '/settings/profile')}>
                      <p><i className="icon user"/> My Profile</p>
                  </div>
                  <div className={'ui segment link'+ (this.props.highlight === 'groups' ? ' blue inverted' : '')} onClick={this.changeTo.bind(this, '/user/' + this.props.username + '/settings/groups')}>
                      <p><i className="icon users"/> My Groups</p>
                  </div>
              </div>
          </div>
        );
    }
}

CategoryBox.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default CategoryBox;
