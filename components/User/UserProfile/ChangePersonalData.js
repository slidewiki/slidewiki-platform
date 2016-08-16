import React from 'react';
import ReactDOM from 'react-dom';
import changeUserData from '../../../actions/user/userprofile/changeUserData';
import classNames from 'classnames';
import CountryDropdown from './CountryDropdown.js';

class ChangePersonalData extends React.Component {
    componentDidMount() {
        $('.ui.dropdown').dropdown();
    }

    componentDidUpdate() {}

    handleChangeUserdata(e) {
        e.preventDefault();
        let payload = {};
        Object.assign(payload, this.props.user);
        payload.fname = this.refs.fname.value;
        payload.lname = this.refs.lname.value;
        payload.email = this.refs.email.value;
        payload.language = this.refs.language.value;
        payload.country = this.refs.country.getCountry();
        payload.organization = this.refs.organization.value;
        payload.description = this.refs.description.value;
        this.context.executeAction(changeUserData, payload);
        return false;
    }

    render() {
        let emailClasses = classNames({
            'ui': true,
            'field': true,
            'error': this.props.failures.emailNotAllowed
        });
        let emailToolTipp = this.props.failures.emailNotAllowed ? 'This E-Mail has already been used by someone else. Please choose another one.': undefined;
        return (
          <div>
            <form className="ui form userdata" onSubmit={ this.handleChangeUserdata.bind(this) }>
              <h2>About me</h2>
              <div className="ui hidden divider"/>
              <div className="two fields">
                <div className="ui field">
                  <label>Firstname</label>
                  <input type="text" placeholder="John" name="fname" defaultValue={this.props.user.fname} ref="fname" required/>
                </div>
                <div className="ui field">
                  <label>Lastname</label>
                  <input type="text" placeholder="Doe" name="lname" defaultValue={this.props.user.lname} ref="lname" required/>
                </div>
              </div>

              <div className="two fields">
                <div className={emailClasses} data-tooltip={emailToolTipp} data-position="top center" data-inverted="">
                    <label>E-Mail</label>
                    <input type="email" placeholder="j.doe@ex.org" name="email" defaultValue={this.props.user.email} ref="email" required/>
                </div>
                <div className="ui field">
                  <div className="ui field">
                    <label>Language</label>
                    <div className="ui fluid search selection dropdown required" data-tooltip="There will be more in the future" data-position="top center" data-inverted="">
                      <input type="hidden" name="language" ref="language" defaultValue={this.props.user.language} required/>
                      <i className="dropdown icon"/>
                      <div className="default text">Select your language</div>
                      <div className="menu">
                        <div className="item" data-value="en_EN">English</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="two fields">
                <div className="ui field">
                    <div className="ui field">
                      <label>Country</label>
                      <CountryDropdown country={this.props.user.country} ref="country"/>
                    </div>
                </div>
                <div className="ui field">
                  <label>Organization</label>
                  <input type="text" placeholder="Google" name="organization" defaultValue={this.props.user.organization} ref="organization"/>
                </div>
              </div>

              <div className="ui field">
                <label>Bio</label>
                <textarea rows="2" maxLength="120" placeholder="A few words about yourself" name="description" defaultValue={this.props.user.description} ref="description"/>
              </div>

              <button type="submit" className="ui blue labeled submit icon button">
                <i className="icon checkmark"/>Submit Changes
              </button>
            </form>
          </div>
        );
    }
}

ChangePersonalData.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ChangePersonalData;
