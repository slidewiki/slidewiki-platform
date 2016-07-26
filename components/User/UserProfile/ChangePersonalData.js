import React from 'react';
import ReactDOM from 'react-dom';
import md5 from 'md5';
import changeUserData from '../../../actions/user/userprofile/changeUserData';

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
        payload.lang = this.refs.language.value;
        payload.location = this.refs.location.value;
        payload.hometown = this.refs.hometown.value;
        payload.orga = this.refs.orga.value;
        if(this.props.user.email !== payload.email && payload.picture.includes('gravatar'))
            payload.picture = 'https://www.gravatar.com/avatar/' + md5(payload.email.trim().toLowerCase()) + '?d=mm&s=300';
        this.context.executeAction(changeUserData, payload);
        return false;
    }

    render() {
        let lang = '';
        switch (this.props.user.lang) {
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
                  <div className="ui search selection dropdown field" ref="language" required>
                    <input type="hidden" name="language" defaultValue={lang}/>
                    <i className="dropdown icon"/>
                    <div className="default text">Select Language</div>
                    <div className="menu">
                      <div className="item">English</div>
                      <div className="item">German</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="two fields">
                <div className="ui labeled input field">
                  <div className="ui label">Location</div>
                  <input type="text" placeholder="USA" name="country" defaultValue={this.props.user.location} ref="location"/>
                </div>
                <div className="ui labeled input field">
                  <div className="ui label">Hometown</div>
                  <input type="text" placeholder="NYC" name="hometown" defaultValue={this.props.user.hometown} ref="hometown"/>
                </div>
              </div>

              <div className="two fields">
                <div className="ui labeled input field">
                  <div className="ui label">Organization</div>
                  <input type="text" placeholder="Red Socks" name="organization" defaultValue={this.props.user.orga} ref="orga"/>
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
