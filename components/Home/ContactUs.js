import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Container, Divider,Header,Segment,Form,Label,Dropdown,Input} from 'semantic-ui-react';
import UserProfileStore from '../../stores/UserProfileStore';

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

        };
        console.log(this.props.UserProfileStore.username);
        console.log(this.props.UserProfileStore.userid);



    }

    handleTypeChange(value){
        this.setState({
            type:value
        });
    }
    handleNameChange(value){
        this.setState({
            name:value
        });

    }
    handleLastChange(value){
        this.setState({
            name:value
        });

    }
    render() {
        let typeOptions = [
          {value:'Suggestion' , text:'Suggestion'},
          {value:'Error' , text:'Error'},
          {value:'Other' , text:'Other'},

        ];
        let labelStyle = {
            width:20+'px'
        };
        //Short way. It creates symple labels. If they don't like ribbons, we can change to this     <Form.Input id='NameContact' label='Name:' placeholder='Your name' />
        return (
            <Container text>
                <Divider hidden />

                <Header as="h2">Contact Us</Header>
                <p>Let us know what you think of SlideWiki so we can continue to
                 make it better. If you find a problem or bug please try to upload
                 a screenshot to help us track it down. Providing your name and
                 email address will allow us to contact you if we need further
                 information to resolve your issues. You can also email feedback
                  to <a href="mailto:jira@slidewiki.atlassian.net?Subject=SlideWiki%20Feedback" target="_blank"> jira@slidewiki.atlassian.net</a>.
                  Thank you!</p>

                  <Divider hidden />
                  <Segment attached="bottom" textAlign="left" >
                    <Header as='h3'>Feedback</Header>
                    <Form>

                      <Form.Field>
                      <Label as='label' style={labelStyle} ribbon color='blue' htmlFor="typeContact">Type of report:</Label>
                      <Dropdown selection id='typeContact' name='typeContact' ref={(type) => {this.type = type;}}  placeholder='Select type of report' options={typeOptions} role="listbox"  onChange={(e, {value}) => {this.handleTypeChange(value);}}/>
                      </Form.Field>
                      <Form.Field>
                        <Label as='label' style={labelStyle} ribbon color='blue'  htmlFor="firstNameContact">First Name:</Label>
                        <Input type='text' id='firstNameContact' name="firstNameContact" placeholder='Your first name'  onChange={(e, {value}) => {this.handleFisrtNameChange(value);}}/>
                      </Form.Field>
                      <Form.Field>
                        <Label as='label' style={labelStyle} ribbon color='blue'  htmlFor="lastNameContact">Last Name:</Label>
                        <Input type='text' id='firstNameContact' name="lastNameContact" placeholder='Your last name'  onChange={(e, {value}) => {this.handleLastNameChange(value);}}/>
                      </Form.Field>
                      <Form.Field>
                        <Label as='label' style={labelStyle} ribbon color='blue'  htmlFor="emailContact">Email:</Label>
                        <Input type='email' id='emailContact' name="emailContact" placeholder='user@server.com'  onChange={(e, {value}) => {this.handleEmailChange(value);}}/>
                      </Form.Field>



                   </Form>
                   </Segment>

            </Container>

        );
    }
}
ContactUs = connectToStores(ContactUs,[UserProfileStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default ContactUs;
