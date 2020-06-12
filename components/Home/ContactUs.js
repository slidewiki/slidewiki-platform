import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Container, Divider,Header,Segment,Form,Dropdown,Input,TextArea} from 'semantic-ui-react';
import UserProfileStore from '../../stores/UserProfileStore';
import ReCAPTCHA from 'react-google-recaptcha';
import {publicRecaptchaKey} from '../../configs/general';
import fetchUser from '../../actions/user/userprofile/fetchUser';
import {defineMessages} from 'react-intl';
import sendContactForm from '../../actions/home/sendContactForm';

class ContactUs extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            type : '',
            firstName:this.props.UserProfileStore.user.fname,
            lastName:this.props.UserProfileStore.user.lname,
            email: this.props.UserProfileStore.user.email,
            summary: '',
            description: '',
            formValidationErrors: {},
        };

        this.handleInputChange = this.handleInputChange.bind(this);

        this.messages = defineMessages({
            swal_title:{
                id: 'contactUs.swal_title',
                defaultMessage:'Contact Us'
            },
            checkType_text:{
                id: 'contactUs.checkType_text',
                defaultMessage:'Please select the type of feedback'
            },
            swal_button:{
                id: 'contactUs.swal_button',
                defaultMessage:'Ok'
            },
            checkEmail_text:{
                id: 'contactUs.checkEmail_text',
                defaultMessage:'Please use a valid email address'
            },
            checkSummary_text:{
                id: 'contactUs.checkSummary_text',
                defaultMessage:'Please provide us a summary of your issue'
            },
            checkCaptcha_text:{
                id: 'contactUs.checkCaptcha_text',
                defaultMessage:'Please confirm you are not a bot',
            },
            typeOption_suggestion:{
                id: 'contactUs.typeOption_suggestion',
                defaultMessage: 'Suggestion'
            },
            typeOption_support:{
                id: 'contactUs.typeOption_support',
                defaultMessage: 'Support Issue'
            },
            typeOption_account:{
                id: 'contactUs.typeOption_account',
                defaultMessage: 'Account Issue'
            },
            typeOption_other:{
                id: 'contactUs.typeOption_other',
                defaultMessage: 'Other'
            },
            form_explanation:{
                id: 'contactUs.form_explanation',
                defaultMessage:'If you wish to contact us, please complete the form below. If you wish to report an issue with a particular deck, please use the Reporting button on the deck.'
            },
            form_subheader:{
                id: 'contactUs.form_subheader',
                defaultMessage:'Feedback'
            },
            form_type_label:{
                id: 'contactUs.form_type_label',
                defaultMessage:'Type of report:'
            },
            form_type_placeholder:{
                id: 'contactUs.form_type_placeholder',
                defaultMessage:'Select type of the report'
            },
            form_field_validation_empty:{
                id: 'contactUs.form_field_validation_empty',
                defaultMessage:'Please do not leave this field empty'
            },
            form_field_validation_email:{
                id: 'contactUs.form_field_validation_email',
                defaultMessage:'Please enter a valid email address'
            },
            form_field_validation_captcha:{
                id: 'contactUs.form_field_validation_captcha',
                defaultMessage:'Please verify that you are not a robot'
            },
            form_firstName_label:{
                id: 'contactUs.form_firstName_label',
                defaultMessage:'First Name:'
            },
            form_firstName_placeholder:{
                id: 'contactUs.form_firstName_placeholder',
                defaultMessage:'First name'
            },
            form_lastName_label:{
                id: 'contactUs.form_lastName_label',
                defaultMessage:'Last Name:'
            },
            form_lastName_placeholder:{
                id: 'contactUs.form_lastName_placeholder',
                defaultMessage:'Last name'
            },
            form_email_label:{
                id: 'contactUs.form_email_label',
                defaultMessage:'Email:'
            },
            form_email_placeholder:{
                id: 'contactUs.form_email_placeholder',
                defaultMessage:'user@server.com'
            },
            form_summary_label:{
                id: 'contactUs.form_summary_label',
                defaultMessage:'Summary:'
            },
            form_summary_placeholder:{
                id: 'contactUs.form_summary_placeholder',
                defaultMessage:'Please write us a one-sentence summary'
            },
            form_description_label:{
                id: 'contactUs.form_description_label',
                defaultMessage:'Description:'
            },
            form_description_placeholder:{
                id: 'contactUs.form_description_placeholder',
                defaultMessage:'Please give us more information about.'
            },
            form_button:{
                id: 'contactUs.form_button',
                defaultMessage:'Send Feedback'
            },
            send_swal_text:{
                id: 'contactUs.send_swal_text',
                defaultMessage:'Feedback sent. Thank you!'
            },
            send_swal_button:{
                id: 'contactUs.send_swal_button',
                defaultMessage:'Close'
            },
            send_swal_error_text: {
                id: 'contactUs.send_swal_error_text',
                defaultMessage:'An error occured while contacting us. Please try again later.'
            },
            send_swal_error_button:{
                id: 'contactUs.send_swal_error_button',
                defaultMessage:'Close'
            }
        });
    }
    componentDidMount(){
      //Load user info, if user is conected.
        if(this.props.UserProfileStore.username.length > 0)
            this.context.executeAction(fetchUser,{ params: {username: this.props.UserProfileStore.username, id:this.props.UserProfileStore.userid}});
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            firstName :nextProps.UserProfileStore.user.fname,
            lastName:nextProps.UserProfileStore.user.lname,
            email: nextProps.UserProfileStore.user.email
        });
    }

    /**
     * Returns a list of options for the Report Type dropdown menu
     *
     * @returns {array}
     */
    getReportTypes() {
        return [
            {
                enum: 1,
                id: 'contactUs.typeOption_suggestion',
                defaultMessage: 'Suggestion'
            },{
                enum: 2,
                id: 'contactUs.typeOption_support',
                defaultMessage: 'Support Issue'
            },{
                enum: 3,
                id: 'contactUs.typeOption_account',
                defaultMessage: 'Account Issue'
            },{
                enum: 4,
                id: 'contactUs.typeOption_other',
                defaultMessage: 'Other'
            },
        ];
    }

    handleInputChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleDropdownChange = (e, dropdown) => {
        this.setState({
            [dropdown.id]: dropdown.value
        });
    }

    onRecaptchaChange(response) {
        this.setState({
            'grecaptcharesponse': response
        });
    }
    /*Using react-semantic-ui Inputs, when we assign them an initial value,
    the only way they can become editable is handling the onChange method.
    If the user is not logged, they don't receive an initial value,
    but the problem is the same, so we need to change by hand the value.
    Now, only not logged users can edit name, surname and email. If we want to
    allow all users to edit, we need to remove the if condition in each change method*/
    onFirstNameChange = (event,data) => {
        if(this.props.UserProfileStore.username.length === 0){
          //Not logged user, he can edit
            this.setState({
                firstName: data.value
            });
        }
    }

    onLastNameChange = (event,data) => {
        if(this.props.UserProfileStore.username.length === 0){
          //Not logged user, he can edit
            this.setState({
                lastName: data.value
            });
        }
    }

    checkEmail(){
        let regExp = /\S+@\S+\.\S+/;
        if (this.state.email === '' || !regExp.test(this.state.email)){
            return false;
        }
        return true;

    }

    checkCaptcha(){
        // Returns true if everything is ok
        let noCaptchaError = true;
        if(this.state.grecaptcharesponse === undefined){
            noCaptchaError = false;

        }
        return noCaptchaError;
    }
    checkForm(){
        // Checks if required fields are ok.
        // Returns true if all are ok
        let errors = {};

        if (!this.state.type) {
            errors.type = this.context.intl.formatMessage(this.messages.form_field_validation_empty);
        }
        if (this.state.firstName === '') {
            errors.firstName = this.context.intl.formatMessage(this.messages.form_field_validation_empty);
        }
        if (this.state.lastName === '') {
            errors.lastName = this.context.intl.formatMessage(this.messages.form_field_validation_empty);
        }
        if (!this.checkEmail()) {
            errors.email = this.context.intl.formatMessage(this.messages.form_field_validation_email);
        }
        if (this.state.summary === '') {
            errors.summary = this.context.intl.formatMessage(this.messages.form_field_validation_empty);
        }
        if (this.state.description === '') {
            errors.description = this.context.intl.formatMessage(this.messages.form_field_validation_empty);
        }
        if (!this.checkCaptcha()) {
            errors.captcha = this.context.intl.formatMessage(this.messages.form_field_validation_captcha);
        }

        this.setState({
            'formValidationErrors': errors
        });

        return Object.keys(errors).length === 0;
    }

    getSwalMessages(){
      //Get the messages which will show in the swal showed  when the form is sent
        return {
            title: this.context.intl.formatMessage(this.messages.swal_title),
            text: this.context.intl.formatMessage(this.messages.send_swal_text),
            confirmButtonText: this.context.intl.formatMessage(this.messages.send_swal_button),
            error_text: this.context.intl.formatMessage(this.messages.send_swal_error_text),
            error_confirmButtonText: this.context.intl.formatMessage(this.messages.send_swal_error_button)
        };
    }

    onSubmitHandler(event){
        //email, first name and last name are stored in the state
        //if we use a input list: type of report in this.typeContact2.inputRef.value
        event.preventDefault();
        if(this.checkForm()){
          //all data is ok. Send info
            let payload = {
                subject : this.state.summary,
                text : `First Name: ${this.state.firstName}\n`+
                    `Last Name: ${this.state.lastName}\n`+
                    `email: ${this.state.email}\n`+
                    `Feedback type: ${this.state.type} - ${this.getReportTypes().find((i) => i.enum === this.state.type).defaultMessage}\n`+
                    `Summary: ${this.state.summary}\n`+
                    `Description: ${this.state.description}`,
                swal_messages : this.getSwalMessages()
            };
            
            this.context.executeAction(sendContactForm,payload);
        }
    }

    render() {
        return (
            <Container text>
                <Divider hidden />

                <Header as="h1" id="main">{this.context.intl.formatMessage(this.messages.swal_title)}</Header>
                <p>{this.context.intl.formatMessage(this.messages.form_explanation)}</p>

                  <Divider hidden />
                  <Segment attached="bottom" textAlign="left" >
                    <Header as='h2'>{this.context.intl.formatMessage(this.messages.form_subheader)}</Header>
                    <Form onSubmit={this.onSubmitHandler.bind(this)} noValidate>
                        <Form.Field
                            id='type'
                            control={Dropdown}
                            label={this.context.intl.formatMessage(this.messages.form_type_label)}
                            required
                            selection
                            value={this.state.type}
                            options={this.getReportTypes().map((type) => ({
                                value: type.enum,
                                text: this.context.intl.formatMessage(type),
                            }))}
                            onChange={this.handleDropdownChange}
                            error={this.state.formValidationErrors.type ? {
                                content: this.state.formValidationErrors.type,
                            } : undefined}
                        />

                        <Form.Field
                            id="form-input-firstName"
                            name="inputFirstName"
                            control={Input}
                            label={this.context.intl.formatMessage(this.messages.form_firstName_label)}
                            required
                            value={this.state.firstName}
                            onChange={this.onFirstNameChange}
                            error={this.state.formValidationErrors.firstName ? {
                                content: this.state.formValidationErrors.firstName,
                            } : undefined}
                        />

                        <Form.Field
                            id="form-input-lastName"
                            name="inputLastName"
                            control={Input}
                            label={this.context.intl.formatMessage(this.messages.form_lastName_label)}
                            required
                            value={this.state.lastName}
                            onChange={this.onLastNameChange}
                            error={this.state.formValidationErrors.lastName ? {
                                content: this.state.formValidationErrors.lastName,
                            } : undefined}
                        />

                        <Form.Field
                            type='email'
                            id='email'
                            control={Input}
                            label={this.context.intl.formatMessage(this.messages.form_email_label)}
                            required
                            value={this.state.email}
                            onChange={this.handleInputChange}
                            error={this.state.formValidationErrors.email ? {
                                content: this.state.formValidationErrors.email,
                            } : undefined}
                        />

                        <Form.Field
                            id='summary'
                            control={Input}
                            label={this.context.intl.formatMessage(this.messages.form_summary_placeholder)}
                            required
                            value={this.state.summary}
                            onChange={this.handleInputChange}
                            error={this.state.formValidationErrors.summary ? {
                                content: this.state.formValidationErrors.summary,
                            } : undefined}
                        />

                        <Form.Field
                            id='description'
                            control={TextArea}
                            label={this.context.intl.formatMessage(this.messages.form_description_label)}
                            required
                            value={this.state.description}
                            onChange={this.handleInputChange}
                            error={this.state.formValidationErrors.description ? {
                                content: this.state.formValidationErrors.description,
                            } : undefined}
                        />

                      <Form.Field>
                            <input type="hidden" id="recaptchaContact" name="recaptchaContact"></input>
                            <ReCAPTCHA 
                                id="recaptchaGoogleContact" 
                                ref= {(recap) => {this.recaptcha = recap;}}
                                sitekey={publicRecaptchaKey}
                                onChange={this.onRecaptchaChange.bind(this)}
                                aria-required="true" 
                                tabIndex="0"
                            />
                            {this.state.formValidationErrors.captcha && 
                                <div className="ui pointing above prompt label" role="alert" aria-atomic="true">
                                    {this.state.formValidationErrors.captcha}
                                </div>}
                      </Form.Field>

                      <Form.Button color='blue' >
                        {this.context.intl.formatMessage(this.messages.form_button)}
                      </Form.Button>
                   </Form>
                   </Segment>

            </Container>

        );
    }
}

ContactUs.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

ContactUs = connectToStores(ContactUs,[UserProfileStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default ContactUs;
