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
import {Flag, Form, Icon, Message} from 'semantic-ui-react';
import SWDSDropdown from '../../common/SWDSDropdown';


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
            tagName='li'
        />;
        if(!this.state.lname) formValidationErrors.lname = <FormattedMessage
            id='ChangePersonalData.error.validation.lname'
            defaultMessage='Enter your last name.'
            tagName='li'
        />;
        if(!this.state.email) formValidationErrors.email = <FormattedMessage
            id='ChangePersonalData.error.validation.email'
            defaultMessage='Enter a valid email address.'
            tagName='li'
        />;
        if(!this.state.language) formValidationErrors.language = <FormattedMessage
            id='ChangePersonalData.error.validation.language'
            defaultMessage='Specify a language for SlideWiki.'
            tagName='li'
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
                    label={this.context.intl.formatMessage({
                        id:'ChangePersonalData.fistname',
                        defaultMessage:'First name'})}
                    required
                    value={this.state.fname}
                    onChange={this.handleInputChange}
                    error={Boolean(this.state.formValidationErrors.fname)}
                />
                <Form.Field
                    id='lname'
                    control={Form.Input}
                    label={this.context.intl.formatMessage({
                        id:'ChangePersonalData.lastname',
                        defaultMessage:'Last name'})}
                    required
                    value={this.state.lname}
                    onChange={this.handleInputChange}
                    error={Boolean(this.state.formValidationErrors.lname)}
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
                    value={this.state.email}
                    width={8}
                    onChange={this.handleInputChange}
                    type='email'
                    error={Boolean(this.state.formValidationErrors.email)}
                />
                <SWDSDropdown
                    fluid
                    selection
                    options={languageOptions}
                    defaultValue={this.state.language}
                    required={true}
                    label={<FormattedMessage
                        id='ChangePersonalData.uilanguage'
                        defaultMessage='User Interface Language'
                    />}
                    width='eight'
                    id='language'
                    onChange={this.handleInputChange}
                    error={Boolean(this.state.formValidationErrors.language)}
                />
            </Form.Group>
            <Form.Group>
                <CountryDropdown
                    ref="country"
                    id="country"
                    required={false}
                    value={this.state.country}
                    width='eight'
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
            <Message
                error
                header={this.context.intl.formatMessage({
                    id: 'ChangePersonalData.error.validation',
                    defaultMessage: 'We found some problems'
                })}
                list={Object.values(formValidationErrors)}
                role="region"
                aria-live="polite"
                visible={Object.keys(formValidationErrors).length > 0}
            />
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
