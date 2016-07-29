import React from 'react';
import ReactDOM from 'react-dom';
import changeUserData from '../../../actions/user/userprofile/changeUserData';

class ChangePersonalData extends React.Component {
    componentDidMount() {
        $('.ui.dropdown').dropdown();
    }

    componentDidUpdate() {
        console.log(this.props.user);
    }

    handleChangeUserdata(e) {
        e.preventDefault();
        let payload = {};
        Object.assign(payload, this.props.user);
        payload.fname = this.refs.fname.value;
        payload.lname = this.refs.lname.value;
        payload.email = this.refs.email.value;
        payload.language = this.refs.language.value;
        payload.country = this.refs.country.value;
        payload.organization = this.refs.organization.value;
        console.log(this.refs.language.value);
        this.context.executeAction(changeUserData, payload);
        return false;
    }

    render() {
        let lang = '';
        switch (this.props.user.language) {
            case 'de_DE':
                lang = 'German';
                break;
            default:
                lang = 'English';
        }
        return (
          <div>
            <form className="ui form userdata" onSubmit={ this.handleChangeUserdata.bind(this) }>
              <h2>About me</h2>
              <div className="ui hidden divider"/>
              <div className="two fields">
                <div className="ui labeled input field">
                  <div className="ui label">Firstname</div>
                  <input type="text" placeholder="John" name="fname" defaultValue={this.props.user.fname} ref="fname" required/>
                </div>
                <div className="ui labeled input field">
                  <div className="ui label">Lastname</div>
                  <input type="text" placeholder="Doe" name="lname" defaultValue={this.props.user.lname} ref="lname" required/>
                </div>
              </div>

              <div className="two fields">
                <div className="ui labeled input field">
                  <div className="ui label">E-Mail</div>
                  <input type="email" placeholder="j.doe@ex.org" name="email" defaultValue={this.props.user.email} ref="email" required/>
                </div>
                <div className="ui field">
                  <div className="ui labeled input field">
                    <div className="ui label">Language</div>
                    <div className="ui fluid search selection dropdown required" >
                      <input type="hidden" name="language" ref="language" defaultValue={lang} required/>
                      <i className="dropdown icon"/>
                      <div className="default text">Select Language</div>
                      <div className="menu">
                        <div className="item" data-value="en_EN">English</div>
                        <div className="item" data-value="de_DE">German</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="two fields">
                <div className="ui labeled input field">
                  <div className="ui label">Country</div>
                  <input type="text" placeholder="USA" name="country" defaultValue={this.props.user.country} ref="country"/>
                </div>
                <div className="ui labeled input field">
                  <div className="ui label">Organization</div>
                  <input type="text" placeholder="Red Socks" name="organization" defaultValue={this.props.user.organization} ref="organization"/>
                </div>
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
