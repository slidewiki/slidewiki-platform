import React from 'react';
import { Container, Divider,Header,Segment,Form,Label,Dropdown} from 'semantic-ui-react';

class ContactUs extends React.Component {

    handleTypeChange(value){
        this.setState({
            type:value
        });
    }
    render() {
        let typeOptions = [
          {value:'Suggestion' , text:'Suggestion'},
          {value:'Error' , text:'Error'},
          {value:'Other' , text:'Other'},

        ];
        return (
            <Container text>
                <Divider hidden />

                <Header as='h2'>Contact Us</Header>
                <p>Let us know what you think of SlideWiki so we can continue to
                 make it better. If you find a problem or bug please try to upload
                 a screenshot to help us track it down. Providing your name and
                 email address will allow us to contact you if we need further
                 information to resolve your issues. You can also email feedback
                  to jira@slidewiki.atlassian.net. Thank you!</p>

                  <Divider hidden />
                  <Segment attached="bottom" textAlign="left" >
                    <Header as='h3'>Report</Header>
                    <Form>
                     <Form.Group>
                      <Form.Field>
                      <Label ribbon color='blue' htmlFor="type">Type of report:</Label>
                      <Dropdown selection name='type' id='type' ref={(type) => {this.type = type;}}  placeholder='Select type of report' options={typeOptions} role="listbox"  onChange={(e, {value }) => {this.handleTypeChange(value);}}/>
                      </Form.Field>
                     </Form.Group>
                   </Form>
                   </Segment>

            </Container>

        );
    }
}

export default ContactUs;
