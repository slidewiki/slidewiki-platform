import React from 'react';
import ReactDOM from 'react-dom';
import {connectToStores} from 'fluxible-addons-react';
import { Container, Divider,Header,Segment,Form,Label,Dropdown,Input,TextArea} from 'semantic-ui-react';
import UserProfileStore from '../../stores/UserProfileStore';
import ReCAPTCHA from 'react-google-recaptcha';
import {publicRecaptchaKey} from '../../configs/general';
import fetchUser from '../../actions/user/userprofile/fetchUser';
import {FormattedMessage, defineMessages} from 'react-intl';

class ContactUs extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            type : '',
            firstName:this.props.UserProfileStore.user.fname,
            lastName:this.props.UserProfileStore.user.lname,
            email: this.props.UserProfileStore.user.email

        };
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
    /*
    onChange={(e, {value}) => {this.handleTypeChange(value);}
    handleTypeChange(value){
        this.setState({
            type:value
        });
    }*/

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
    onFirstNameChange(event,data){
        if(this.props.UserProfileStore.username.length === 0){
          //Not logged user, he can edit
            this.setState({
                firstName: data.value
            });
        }
    }
    onLastNameChange(event,data){
        if(this.props.UserProfileStore.username.length === 0){
          //Not logged user, he can edit
            this.setState({
                lastName: data.value
            });
        }
    }
    onEmailChange(event,data){
        if(this.props.UserProfileStore.username.length === 0){
          //Not logged user, he can edit
            this.setState({
                email: data.value
            });
        }
    }
    checkEmail(){
        let noEmailError = true;
        let regExp = /\S+@\S+\.\S+/;
        if (this.state.email === '' || !regExp.test(this.state.email)){
            noEmailError = false;
            swal({
                title:'Contact Us',
                text: 'Please, use a valid email address',
                type: 'error',
                confirmButtonText: 'Ok',
                confirmButtonClass: 'ui olive button',
                buttonsStyling: false
            }).then((accepted) => {
              //recaptcha-checkbox-checkmark
                this.emailContact.focus();
            });
        }
        return noEmailError;

    }
    checkSummary(){
        let noSummaryError = true;

        if (this.summaryContact.inputRef.value === ''){
            noSummaryError = false;
            swal({
                title:'Contact Us',
                text: 'Please, provide us a summary of your issue',
                type: 'error',
                confirmButtonText: 'Ok',
                confirmButtonClass: 'ui olive button',
                buttonsStyling: false
            }).then((accepted) => {
            //recaptcha-checkbox-checkmark
                this.summaryContact.focus();
            });
        }
        return noSummaryError;
    }
    checkCaptcha(){
    // REturns true if everything is ok
        let noCaptchaError = true;
        if(this.state.grecaptcharesponse === undefined){
            noCaptchaError = false;
            swal({
                title:'Contact Us',
                text: 'Please, confirm you are not a bot',
                type: 'error',
                confirmButtonText: 'Ok',
                confirmButtonClass: 'ui olive button',
                buttonsStyling: false
            }).then((accepted) => {                
                //recaptcha-checkbox-checkmark
                ReactDOM.findDOMNode(this.recaptcha).focus();
                //$('#recaptchaGoogleContact').focus();
            });
        }
        return noCaptchaError;
    }
    checkForm(){
    //Checks if requiered fields are ok.
    // Returns true if all are ok
        if(this.checkEmail())
            if(this.checkSummary())
                if(this.checkCaptcha())
                    return true;
        return false;
    }

    onSubmitHandler(event){
        //email, first name and last name are stored in the state
        event.preventDefault();
        this.checkForm();

        console.log(this.state.firstName);
        console.log(this.state.lastName);
        console.log(this.state.email);
        console.log(this.typeContact.state.value);
        console.log(this.summaryContact.inputRef.value);
        console.log(this.descriptionContact.ref.value);
        console.log(this.state.grecaptcharesponse);



    }

    render() {
        const typeOptions = [
          {value:'Suggestion' , text:'Suggestion'},
          {value:'Support' , text:'Support Issue'},
          {value:'Account' , text:'Account Issue'},
          {value:'Other' , text:'Other'},

        ];
        const labelStyle = {
            width:20+'px'
        };

        const recaptchaStyle = {display: 'inline-block'};

        //Short way. It creates symple labels. If they don't like ribbons, we can change to this:
        //     <Form.Input id='NameContact' label='Name:' placeholder='Your name' />
        return (
            <Container text>
                <Divider hidden />

                <Header as="h2">Contact Us</Header>
                <p>If you wish to contact us, please complete the form below. If you wish to report an issue with a particular deck, please use the Reporting button on the deck.</p>

                  <Divider hidden />
                  <Segment attached="bottom" textAlign="left" >
                    <Header as='h3'>Feedback</Header>
                    <Form onSubmit={this.onSubmitHandler.bind(this)}>
                      <Form.Field>
                      <Label as='label' style={labelStyle} ribbon color='blue' htmlFor="typeContact">Type of report*:</Label>
                      <Dropdown selection id='typeContact' name='typeContact' ref={(type) => {this.typeContact = type;}}  placeholder='Select type of report' options={typeOptions} aria-required="true" />
                      </Form.Field>
                      <Form.Field>
                        <Label as='label' style={labelStyle} ribbon color='blue'  htmlFor="firstNameContact">First Name:</Label>
                        <Input type='text' id='firstNameContact'   name="firstNameContact" ref={(input) => {this.firstNameContact = input;}}
                         placeholder='Your first name' value={this.state.firstName} onChange ={this.onFirstNameChange.bind(this)}/>
                      </Form.Field>
                      <Form.Field>
                        <Label as='label' style={labelStyle} ribbon color='blue'  htmlFor="lastNameContact">Last Name:</Label>
                        <Input type='text' id='lastNameContact' name="lastNameContact" ref={(input) => {this.lastNameContact = input;}}
                         placeholder='Your last name' value={this.state.lastName} onChange ={this.onLastNameChange.bind(this)}/>
                      </Form.Field>
                      <Form.Field>
                        <Label as='label' style={labelStyle} ribbon color='blue'  htmlFor="emailContact">Email*:</Label>
                        <Input type='email' id='emailContact' name="emailContact" ref={(input) => {this.emailContact = input;}}
                        placeholder='user@server.com' aria-required="true" value={this.state.email} onChange ={this.onEmailChange.bind(this)}/>
                      </Form.Field>
                      <Form.Field>
                        <Label as='label' style={labelStyle} ribbon color='blue'  htmlFor="summaryContact">Summary*:</Label>
                        <Input type='text' id='summaryContact' name="summaryContact" ref={(input) => {this.summaryContact = input;}}  placeholder='Please, write us a one-sentence summary' aria-required="true"  />
                      </Form.Field>
                      <Form.Field>
                        <Label as='label' style={labelStyle} ribbon color='blue'  htmlFor="descriptionContact">Context:</Label>
                         <TextArea id='descriptionContact' name="descriptionContact" ref={(input) => {this.descriptionContact = input;}}  autoHeight placeholder='Please, give us more information about' />
                      </Form.Field>
                      <Form.Field>
                        <input type="hidden" id="recaptchaContact" name="recaptchaContact"></input>
                        <ReCAPTCHA id="recaptchaGoogleContact" ref= {(recap) => {this.recaptcha = recap;}}
                         style={recaptchaStyle} sitekey={publicRecaptchaKey}   onChange={this.onRecaptchaChange.bind(this)}
                         aria-required="true" tabIndex="0"/>
                      </Form.Field>
                      <Form.Button color='blue'>Send Feedback</Form.Button>
                   </Form>
                   </Segment>

            </Container>

        );
    }
}

ContactUs.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};

ContactUs = connectToStores(ContactUs,[UserProfileStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default ContactUs;
