import React from 'react';
import { Button, Icon, Modal, Container, Segment, TextArea, Form,Divider,Dropdown,Label,Header} from 'semantic-ui-react';
import FocusTrap from 'focus-trap-react';

class ContacUsForm extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            activeTrap: false,

        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
    }
    componentWillUnmount(){
        if(this.state.modalOpen) //handleClose no executed
            this.handleClose();

    }
    handleOpen(){
        $('#app').attr('aria-hidden','true');
        this.setState({
            modalOpen:true,
            activeTrap:true
        });
    }
    handleClose(){

        $('#app').attr('aria-hidden','false');
        this.setState({
            modalOpen:false,
            activeTrap: false,

        });

    }
    unmountTrap(){
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }
    //initialFocus: '#tabMyDecksId' añadir a focustrap el elemento a apuntar
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
         <Modal trigger={
                  <Button as="button"
                    type="button"
                    aria-label="Contact Us"
                    data-tooltip="Contact Us"
                    aria-hidden={this.state.modalOpen}
                    inverted onClick={this.handleOpen}
                    tabIndex="0" >
                    Contact Us
                  </Button>
                 }
              open={this.state.modalOpen}
              onClose={this.handleClose}
              role="dialog"
              id="contactUsModal"
              aria-labelledby="contactUsModalHeader"
              aria-describedby="contactUsModalDescription"
              aria-hidden = {!this.state.modalOpen}
              tabIndex="0">
              <FocusTrap
                      id="focus-trap-contactUsModal"
                      focusTrapOptions={{
                          onDeactivate: this.unmountTrap,
                          clickOutsideDeactivates: true,

                      }}
                      active={this.state.activeTrap}
                      className = "header">

              <Modal.Header className="ui center aligned" as="h1" id="contactUsModalHeader">
              Contact Us
              </Modal.Header>

              <Modal.Content>
                  <Container text>
                       <Segment color="blue" textAlign="center" padded>

                          <Segment attached="bottom" textAlign="left" >
                              <Divider hidden />
                              <p id="contactUsModalDescription">Let us know what you think of SlideWiki so we can continue to
                               make it better. If you find a problem or bug please try to upload
                               a screenshot to help us track it down. Providing your name and
                               email address will allow us to contact you if we need further
                               information to resolve your issues. You can also email feedback
                                to jira@slidewiki.atlassian.net. Thank you!</p>

                                <Divider hidden />
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
                          <Modal.Actions>
                            <Button id="sendContactUsModal" color="green"  tabIndex="0" type="button" aria-label="Send Form"
                                data-tooltip="Send Form"  onClick={this.handleAttachButton}>
                              Send
                            </Button>
                            <Button id="cancelContactUsModal" color="red" tabIndex="0" type="button" aria-label="Cancel" data-tooltip="Cancel" onClick={this.handleClose} >
                              Cancel
                            </Button>
                          </Modal.Actions>
                       </Segment>
                 </Container>
              </Modal.Content>

              </FocusTrap>
          </Modal>

        );
    }


}

export default ContacUsForm;
