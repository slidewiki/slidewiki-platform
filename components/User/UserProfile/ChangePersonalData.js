import React from 'react';

class ChangePersonalData extends React.Component {
    componentDidMount() {
        $('.ui.dropdown').dropdown();
    }

    componentDidUpdate() {}

    handleChangeUserdata(e) {
        e.preventDefault();
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
                  <input type="text" placeholder="John" name="fname" value={this.props.user.fname} required/>
                </div>
                <div className="ui labeled input field">
                  <div className="ui label">Lastname</div>
                  <input type="text" placeholder="Doe" name="lname" value={this.props.user.lname} required/>
                </div>
              </div>

              <div className="two fields">
                <div className="ui labeled input field">
                  <div className="ui label">E-Mail</div>
                  <input type="email" placeholder="j.doe@ex.org" name="email" value={this.props.user.email} required/>
                </div>
                <div className="ui field">
                  <div className="ui search selection dropdown field" ref="language" required>
                    <input type="hidden" name="language" value={lang}/>
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
                  <input type="text" placeholder="USA" name="country" value={this.props.user.location}/>
                </div>
                <div className="ui labeled input field">
                  <div className="ui label">Hometown</div>
                  <input type="text" placeholder="NYC" name="hometown" value={this.props.user.hometown}/>
                </div>
              </div>

              <div className="two fields">
                <div className="ui labeled input field">
                  <div className="ui label">Organization</div>
                  <input type="text" placeholder="Red Socks" name="organization" value={this.props.user.orga}/>
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
