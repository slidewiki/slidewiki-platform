import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { connectToStores } from 'fluxible-addons-react';
import CountryDropdown from '../../common/CountryDropdown.js';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import changeUserData from '../../../actions/user/userprofile/changeUserData';
import {getLanguageDisplayName, getLanguageName, getLanguageNativeName, translationLanguages} from '../../../common';
import { writeCookie } from '../../../common';
import IntlStore from '../../../stores/IntlStore';
import { locales, flagForLocale }from '../../../configs/locales';
import { LTI_ID } from '../../../configs/general';
import {Flag} from 'semantic-ui-react';
import SWDSDropdown from '../../common/SWDSDropdown';


class ChangePersonalData extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            locale: (this.props.IntlStore.currentLocale.length <= 2) ? this.props.IntlStore.currentLocale : 'en',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleChangeUserdata(e) {
        e.preventDefault();
        let payload = {};
        Object.assign(payload, this.props.user);
        payload.fname = this.refs.fname.value;
        payload.lname = this.refs.lname.value;
        payload.email = this.refs.email.value;
        payload.language = this.state.locale;
        payload.country = this.refs.country.getSelected();
        payload.organization = this.refs.organization.value;
        payload.description = this.refs.description.value;
        payload.displayName = this.refs.displayName.value;

        console.log(payload.country);

        this.context.executeAction(changeUserData, payload);
        writeCookie('locale', payload.language, 365);
        //See UserProfile.js for page reload
        return false;
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    getLocaleOptions() {
        return locales.map((locale) => {
            let options = {
                key: locale,
                name: getLanguageName(locale),
                icon: <Flag name={flagForLocale(locale)} />,
                value: locale,
            };
            return options;
        });
    }

    render() {
        const messages = defineMessages({
            emailNotAllowed: {
                id: 'ChangePersonalData.emailNotAllowed',
                defaultMessage: 'This E-Mail has already been used by someone else. Please choose another one.',
            },
            tooltipp: {
                id: 'ChangePersonalData.tooltipp',
                defaultMessage: 'A few words about yourself - max 120 characters'
            }
        });
        let emailClasses = classNames({
            'ui': true,
            'field': true,
            'error': this.props.failures.emailNotAllowed
        });
        let emailToolTipp = this.props.failures.emailNotAllowed ? this.context.intl.formatMessage(messages.emailNotAllowed) : undefined;
        let languageOptions = this.getLocaleOptions();
        let currentLocale = this.state.locale;

        if (!this.props.user.uname.endsWith(LTI_ID))
        {
            return (
            <div>
                <form className="ui form userdata" onSubmit={ this.handleChangeUserdata.bind(this) }>
                    <div className="two fields">
                        <div className="ui field">
                            <label htmlFor="fname">
                              <FormattedMessage
                                id='ChangePersonalData.fistname'
                                defaultMessage='Firstname'
                              />
                            </label>
                            <input type="text" placeholder="John" name="fname" id="fname" defaultValue={this.props.user.fname} ref="fname" required/>
                        </div>
                        <div className="ui field">
                            <label htmlFor="lname">
                              <FormattedMessage
                                id='ChangePersonalData.lastname'
                                defaultMessage='Lastname'
                              />
                            </label>
                            <input type="text" placeholder="Doe" name="lname" id="lname" defaultValue={this.props.user.lname} ref="lname" required/>
                        </div>
                    </div>

                    <div className="ui field">
                        <label htmlFor="displayName">
                          <FormattedMessage
                            id='ChangePersonalData.displayName'
                            defaultMessage='Display name'
                          />
                        </label>
                        <input type="text" placeholder={this.props.user.uname} id="displayName" name="displayName" defaultValue={this.props.user.displayName} ref="displayName"/>
                    </div>

                    <div className="two fields">
                        <div className={emailClasses} data-tooltip={emailToolTipp} data-position="top center" data-inverted="">
                            <label htmlFor="email">
                              <FormattedMessage
                                id='ChangePersonalData.email'
                                defaultMessage='E-Mail'
                              />
                            </label>
                            <input type="email" placeholder="j.doe@ex.org" name="email" id="email" defaultValue={this.props.user.email} ref="email" required/>
                        </div>
                        <SWDSDropdown fluid selection
                            options={languageOptions}
                            defaultValue={currentLocale}
                            required={true}
                            label={<FormattedMessage
                                id='ChangePersonalData.uilanguage'
                                defaultMessage='User Interface Language'

                            />}
                            name='locale'
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="two fields">
                        <CountryDropdown ref="country" id="country" required={false} value={this.props.user.country}/>
                        <div className="ui field">
                            <label htmlFor="organization">
                              <FormattedMessage
                                id='ChangePersonalData.organization'
                                defaultMessage='Organization'
                              />
                            </label>
                            <input type="text" placeholder="Google" name="organization" id="organization" defaultValue={this.props.user.organization} ref="organization"/>
                        </div>
                    </div>

                    <div className="ui field">
                        <label htmlFor="bio">
                          <FormattedMessage
                            id='ChangePersonalData.bio'
                            defaultMessage='Biography'
                          />
                        </label>
                        <textarea rows="2" maxLength="120" placeholder={this.context.intl.formatMessage(messages.tooltipp)} id="bio" name="description" defaultValue={this.props.user.description} ref="description"/>
                    </div>

                    {this.props.saveProfileIsLoading ? <div className="ui active dimmer"><div className="ui text loader"><FormattedMessage id='ChangePersonalData.loading' defaultMessage='Loading' /></div></div> : ''}

                    <button type="submit" className="ui blue labeled submit icon button">
                        <i className="icon checkmark"/>
                        <FormattedMessage
                          id='ChangePersonalData.submit'
                          defaultMessage='Submit Changes'
                        />
                    </button>
                </form>
            </div>
            );
        }//end if
        else{

            return (
              <div>   </div>
            );
        }//end else

    }
}

ChangePersonalData.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

ChangePersonalData = connectToStores(ChangePersonalData, [IntlStore], (context, props) => {
    return {
        IntlStore: context.getStore(IntlStore).getState()
    };
});

export default ChangePersonalData;
