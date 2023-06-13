import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import CountryDropdown from '../../common/CountryDropdown.js';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import changeUserData from '../../../actions/user/userprofile/changeUserData';
import {getLanguageDisplayName, getLanguageName, getLanguageNativeName, translationLanguages} from '../../../common';
import { writeCookie } from '../../../common';
import IntlStore from '../../../stores/IntlStore';
import { locales, flagForLocale }from '../../../configs/locales';
import { LTI_ID } from '../../../configs/general';
import {Flag, Form, Icon, Message,Dropdown} from 'semantic-ui-react';

class ChangePersonalData extends React.Component {

    constructor(props){
        super(props);

        // Load user object
        this.state = this.props.user;

        // Set the language as the current language selected by the user
        this.state.language = (this.props.IntlStore.currentLocale.length <= 2) ? this.props.IntlStore.currentLocale : 'en';

        // Initialise validation errors
        this.state.formValidationErrors = {};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeUserdata = this.handleChangeUserdata.bind(this);
    }

    handleChangeUserdata(e) {
        // Start by assuming no validation errors
        let formValidationErrors = {};

        // Validate required fields
        if(!this.state.fname) formValidationErrors.fname = <FormattedMessage
            id='ChangePersonalData.error.validation.fname'
            defaultMessage='Enter your first name.'
        />;
        if(!this.state.lname) formValidationErrors.lname = <FormattedMessage
            id='ChangePersonalData.error.validation.lname'
            defaultMessage='Enter your last name.'
        />;
        if(!this.state.email) formValidationErrors.email = <FormattedMessage
            id='ChangePersonalData.error.validation.email'
            defaultMessage='Enter a valid email address.'
        />;
        if(!this.state.language) formValidationErrors.language = <FormattedMessage
            id='ChangePersonalData.error.validation.language'
            defaultMessage='Specify a language for SlideWiki.'
        />;

        // Update state with the validation errors, to show them on the form.
        this.setState({formValidationErrors: formValidationErrors});

        // If there were any validation errors, stop here.
        if(Object.keys(formValidationErrors).length > 0) return;

        // Time to save the new attributes. Copy the current state.
        let payload = Object.assign({}, this.state);

        // Remove the formValidationErrors - we don't want to save these with the user object.
        delete payload.formValidationErrors;

        // Make the change and set the language
        this.context.executeAction(changeUserData, payload);
        writeCookie('locale', payload.language, 365);

        return false;
    }

    handleInputChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleDropdownChange = (e, dropdown) => {
        this.setState({
            [dropdown.id]: dropdown.value,
        });
    };

    getLocaleOptions() {
        return locales.map((locale) => {
            let options = {
                key: locale,
                text: getLanguageName(locale),
                icon: <Flag name={flagForLocale(locale)} />,
                value: locale,
            };
            return options;
        });
    }

    render() {
        // If the username ends with the LTI_ID, don't render anything (no idea why).
        if(this.props.user.uname.endsWith(LTI_ID)) return(<div/>);

        // Load in validation errors
        let formValidationErrors = this.state.formValidationErrors;

        // If the UserProfileStore rejected the email address (i.e. it's a duplicate), show an error message.
        if(this.props.failures.emailNotAllowed) {
            formValidationErrors.email = <FormattedMessage
                id='ChangePersonalData.emailNotAllowed'
                defaultMessage='This E-Mail has already been used by someone else. Please choose another one.'
                tagName='li'
            />;
        }

        let languageOptions = this.getLocaleOptions();

        return (
        <Form>
            <Form.Group widths='equal'>
                <Form.Field
                    id='fname'
                    control={Form.Input}
                    fluid
                    label={this.context.intl.formatMessage({
                        id:'ChangePersonalData.fistname',
                        defaultMessage:'First name'})}
                    required
                    value={this.state.fname}
                    onChange={this.handleInputChange}
                    error={
                        this.state.formValidationErrors.fname
                            ? {
                                  content: this.state.formValidationErrors.fname,
                              }
                            : undefined
                    }
                />
                <Form.Field
                    id='lname'
                    fluid
                    control={Form.Input}
                    label={this.context.intl.formatMessage({
                        id:'ChangePersonalData.lastname',
                        defaultMessage:'Last name'})}
                    required
                    value={this.state.lname}
                    onChange={this.handleInputChange}
                    error={
                        this.state.formValidationErrors.lname
                            ? {
                                  content: this.state.formValidationErrors.lname,
                              }
                            : undefined
                    }
                />

            </Form.Group>
            <Form.Group>
                {/* A bug in semantic UI also sets the label to disabled, so provide a control manually to set 'disabled' only to the input */}
                <Form.Field
                    id='uname'
                    control={(input) => <input type="text" value={input.value} disabled id={input.id} />}
                    label={this.context.intl.formatMessage({
                        id:'ChangePersonalData.displayName',
                        defaultMessage:'Display name'})}
                    value={this.state.uname}
                    width={8}
                />
            </Form.Group>
            <Form.Group>
                <Form.Field
                    id='email'
                    control={Form.Input}
                    label={this.context.intl.formatMessage({
                        id:'ChangePersonalData.email',
                        defaultMessage:'E-Mail'})}
                    required
                    fluid
                    value={this.state.email}
                    width={8}
                    onChange={this.handleInputChange}
                    type='email'
                    error={
                        this.state.formValidationErrors.email
                            ? {
                                  content: this.state.formValidationErrors.email,
                              }
                            : undefined
                    }
                />
                <Form.Field
                    id='language'
                    control={Dropdown}
                    label={this.context.intl.formatMessage({
                        id:'ChangePersonalData.uilanguage',
                        defaultMessage:'User Interface Language'})
                    }
                    fluid
                    selection
                    required
                    width={8}
                    value={this.state.language}
                    onChange={this.handleDropdownChange}
                    options={languageOptions}
                    error={
                        this.state.formValidationErrors.language
                            ? {
                                  content: this.state.formValidationErrors.language,
                              }
                            : undefined
                    }
                />
            </Form.Group>
            <Form.Group>
                <CountryDropdown
                    id="country"
                    required={false}
                    value={this.state.country}
                    onChange={this.handleDropdownChange}
                    width={8}
                />
                <Form.Field
                    id='organization'
                    control={Form.Input}
                    label={this.context.intl.formatMessage({
                        id:'ChangePersonalData.organization',
                        defaultMessage:'Organization'})}
                    value={this.state.organization}
                    width={8}
                    onChange={this.handleInputChange}
                />
            </Form.Group>
            <Form.Group>
                <Form.Field
                    id='description'
                    control={Form.TextArea}
                    label={this.context.intl.formatMessage({
                        id:'ChangePersonalData.description',
                        defaultMessage:'Bio'})}
                    value={this.state.description}
                    width={8}
                    onChange={this.handleInputChange}
                    rows={2}
                    maxLength={120}
                    placeholder={this.context.intl.formatMessage({
                        id: 'ChangePersonalData.tooltipp',
                        defaultMessage: 'A few words about yourself - max 120 characters'
                    })}
                />
            </Form.Group>
            <Form.Button type='submit' primary icon labelPosition='left' onClick={this.handleChangeUserdata}>
                <Icon name='checkmark'/>
                <FormattedMessage
                    id='ChangePersonalData.submit'
                    defaultMessage='Submit Changes'
                />
            </Form.Button>
        </Form>
        );
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
