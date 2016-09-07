import React from 'react';
import classNames from 'classnames';
import CountryDropdown from '../../common/CountryDropdown.js';
import LanguageDropdown from '../../common/LanguageDropdown.js';
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
        payload.language = this.refs.language.getSelected();
        payload.country = this.refs.country.getSelected();
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
        let emailToolTipp = this.props.failures.emailNotAllowed ? 'This E-Mail has already been used by someone else. Please choose another one.' : undefined;
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
                                <LanguageDropdown ref="language" required={true} language={this.props.user.language}/>
                            </div>
                        </div>
                    </div>

                    <div className="two fields">
                        <div className="ui field">
                            <div className="ui field">
                                <label>Country</label>
                                <CountryDropdown ref="country" required={false} country={this.props.user.country}/>
                            </div>
                        </div>
                        <div className="ui field">
                            <label>Organization</label>
                            <input type="text" placeholder="Google" name="organization" defaultValue={this.props.user.organization} ref="organization"/>
                        </div>
                    </div>

                    <div className="ui field">
                        <label>Bio</label>
                        <textarea rows="2" maxLength="120" placeholder="A few words about yourself - max 120 characters" name="description" defaultValue={this.props.user.description} ref="description"/>
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
