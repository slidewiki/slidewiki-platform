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
                  <div className="ui secondary segment"><h3>Personal settings</h3></div>
                  <div className={'ui segment link'+ (this.props.highlight === 'profile' ? ' blue inverted' : '')} onClick={this.changeTo.bind(this, '/user/' + this.props.username + '/settings/profile')}>
                      <p><i className="icon user"/> Profile</p>
                  </div>
                  <div className={'ui segment link'+ (this.props.highlight === 'account' ? ' blue inverted' : '')} onClick={this.changeTo.bind(this, '/user/' + this.props.username + '/settings/account')}>
                      <p><i className="icon user"/> Account</p>
                  </div>
                  <div className={'ui segment link'+ (this.props.highlight === 'integrations' ? ' blue inverted' : '')} onClick={this.changeTo.bind(this, '/user/' + this.props.username + '/settings/integrations')}>
                      <p><i className="icon user"/>Authorized Accounts</p>
                  </div>
              </div>
              <div className="ui segments">
                  <div className="ui secondary segment"><h3>Groups</h3></div>
                  <div className={'ui segment link'+ (this.props.highlight === 'overview' ? ' blue inverted' : '')} onClick={this.changeTo.bind(this, '/user/' + this.props.username + '/groups/overview')}>
                      <p><i className="icon user"/>My Groups</p>
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
