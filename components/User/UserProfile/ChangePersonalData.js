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
        let emailField = <div><label>E-Mail</label><input type="email" placeholder="j.doe@ex.org" name="email" defaultValue={this.props.user.email} ref="email" required/></div>;
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
                {!this.props.failures.emailNotAllowed ? <div className="ui field"> {emailField} </div>: <div className="ui error field" data-tooltip="This email has already been used by someone else. Please, choose another one." data-position="top center" data-inverted=""> {emailField} </div>}
                <div className="ui field">
                  <div className="ui field">
                    <label>Language</label>
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
                <div className="ui field">
                  <label>Country</label>
                  <input type="text" placeholder="USA" name="country" defaultValue={this.props.user.country} ref="country"/>
                </div>
                <div className="ui field">
                  <label>Organization</label>
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
