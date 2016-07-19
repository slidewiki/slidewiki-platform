import React from 'react';
import ReactDom from 'react-dom';

class ChangePersonalData extends React.Component {
    componentDidMount() {
        $('.ui.form.userdata').submit((e) => {
            e.preventDefault();
            return false;
        });
    }

    componentDidUpdate() {}

    render() {
        return (
          <div>
            <form className="ui form userdata">
              <h2>About me</h2>
              <div className="ui hidden divider"/>
              <div className="two fields">
                <div className="ui labeled input field">
                  <div className="ui label">Firstname</div>
                  <input type="text" placeholder="Roy" name="fname" required/>
                </div>
                <div className="ui labeled input field">
                  <div className="ui label">Lastname</div>
                  <input type="text" placeholder="Meissner" name="lname" required/>
                </div>
              </div>

              <div className="two fields">
                <div className="ui labeled input field">
                  <div className="ui label">E-Mail</div>
                  <input type="email" placeholder="roy-meissner@gmx.net" name="email" required/>
                </div>
                <div className="ui field">
                  <div className="ui search selection dropdown field" ref="language" required>
                    <input type="hidden" name="language"/>
                    <i className="dropdown icon"/>
                    <div className="default text">Select Language</div>
                    <div className="menu">
                      <div className="item">Arabic</div>
                      <div className="item">Chinese</div>
                      <div className="item">Danish</div>
                      <div className="item">Dutch</div>
                      <div className="item">English</div>
                      <div className="item">French</div>
                      <div className="item">German</div>
                      <div className="item">Greek</div>
                      <div className="item">Hungarian</div>
                      <div className="item">Italian</div>
                      <div className="item">Japanese</div>
                      <div className="item">Korean</div>
                      <div className="item">Lithuanian</div>
                      <div className="item">Persian</div>
                      <div className="item">Polish</div>
                      <div className="item">Portuguese</div>
                      <div className="item">Russian</div>
                      <div className="item">Spanish</div>
                      <div className="item">Swedish</div>
                      <div className="item">Turkish</div>
                      <div className="item">Vietnamese</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="two fields">
                <div className="ui labeled input field">
                  <div className="ui label">Location</div>
                  <input type="text" placeholder="Germany" name="country"/>
                </div>
                <div className="ui labeled input field">
                  <div className="ui label">Hometown</div>
                  <input type="text" placeholder="Leipzig" name="hometown"/>
                </div>
              </div>

              <div className="two fields">
                <div className="ui labeled input field">
                  <div className="ui label">Birthday</div>
                  <input type="date" min="1900-01-01" value="1990-09-11" name="bday"/>
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
