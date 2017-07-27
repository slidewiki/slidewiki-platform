import React from 'react';
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
        //if we have userId and not this.props.UserProfileStore.user.fname, we need to reload that info.
        // execute action fetchUser with the payload: {params: {id: <userid>, username: <username>}}
        //we need also implement will receive props
        this.state ={
            type : '',
            firstName:this.props.UserProfileStore.user.fname,
            lastName:this.props.UserProfileStore.user.lname,
            email: this.props.UserProfileStore.user.email

        };
        console.log(this.props.UserProfileStore.username);
        console.log(this.props.UserProfileStore.userid);




    }
    componentDidMount(){
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
        console.log(response);
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
                    <Form>

                      <Form.Field>
                      <Label as='label' style={labelStyle} ribbon color='blue' htmlFor="typeContact">Type of report*:</Label>
                      <Dropdown selection id='typeContact' name='typeContact' ref={(type) => {this.typeContact = type;}}  placeholder='Select type of report' options={typeOptions} aria-required="true" />
                      </Form.Field>
                      <Form.Field>
                        <Label as='label' style={labelStyle} ribbon color='blue'  htmlFor="firstNameContact">First Name:</Label>
                        <Input type='text' id='firstNameContact'  ref={(input) => {this.firstNameContact = input;}} name="firstNameContact" placeholder='Your first name' value={this.state.firstName}/>
                      </Form.Field>
                      <Form.Field>
                        <Label as='label' style={labelStyle} ribbon color='blue'  htmlFor="lastNameContact">Last Name:</Label>
                        <Input type='text' id='firstNameContact' name="lastNameContact" placeholder='Your last name' value={this.state.lastName}/>
                      </Form.Field>
                      <Form.Field>
                        <Label as='label' style={labelStyle} ribbon color='blue'  htmlFor="emailContact">Email*:</Label>
                        <Input type='email' id='emailContact' name="emailContact" placeholder='user@server.com'  aria-required="true"  value={this.state.email}/>
                      </Form.Field>
                      <Form.Field>
                        <Label as='label' style={labelStyle} ribbon color='blue'  htmlFor="summaryContact">Summary*:</Label>
                        <Input type='text' id='summaryContact' name="summaryContact" placeholder='Please, write us a one-sentence summary' aria-required="true" />
                      </Form.Field>
                      <Form.Field>
                        <Label as='label' style={labelStyle} ribbon color='blue'  htmlFor="descriptionContact">Context:</Label>
                         <TextArea id='descriptionContact' name="descriptionContact" autoHeight placeholder='Please, give us more information about' />
                      </Form.Field>
                      <Form.Field>
                        <input type="hidden" id="recaptchaContact" name="recaptchaContact"></input>
                        <ReCAPTCHA style={recaptchaStyle} sitekey={publicRecaptchaKey}  onChange={this.onRecaptchaChange.bind(this)}  aria-required="true"/>
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
