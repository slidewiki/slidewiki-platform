import React from 'react';
import FocusTrap from 'focus-trap-react';
import { Button, Container, Form, Modal, TextArea, Icon, Segment } from 'semantic-ui-react';
const headerStyle = {
    'textAlign': 'center'
};

class DownloadModal extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            activeTrap: false,

        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    handleOpen(){
        $('#app').attr('aria-hidden', 'true');
        this.setState({
            modalOpen:true,
            activeTrap:true
        });

    }


    handleClose(){
        $('#app').attr('aria-hidden', 'false');
        this.setState({
            modalOpen: false,
            activeTrap: false
        });

    }
    unmountTrap() {
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }
    handleDownload(){

    }
    render() {
        return(

              <Modal
                  trigger={
                        <Button icon aria-hidden="false" className="ui button" type="button" aria-label="Download" data-tooltip="Download" onClick={this.handleOpen} >
                              <Icon name='download' size='large'/>
                        </Button>

                      }
                  open={this.state.modalOpen}
                  onOpen={this.handleOpen}
                  onClose={this.handleClose}
                  id="downloadModal"
                  aria-labelledby="downloadModalHeader"
                  aria-describedby="downloadModalDescription"
                  tabIndex="0"
              >
                  <FocusTrap
                      id="focus-trap-downloadModal"
                      className = "header"
                      active={this.state.activeTrap}
                      onDeactivate={this.unmountTrap}
                      clickOutsideDeactivates={true}
                      initialFocus=""
                  >
                      <Modal.Header className="ui center aligned" id="downloadModalHeader">
                          <h1 style={headerStyle}>Download this deck</h1>
                      </Modal.Header>
                      <Modal.Content>
                          <Container>
                              <Segment color="blue" textAlign="center" padded>
                                 <Segment>
                                     <div className="sr-only" id="downloadModalDescription">Select one target format to download this deck</div>
                                  <Form id="downloadForm">

                                      <Button
                                          color="blue"
                                          type="submit"
                                          content="Download"
                                          icon='download'
                                          onClick={this.handleDownload}
                                      />
                                      <Button
                                          icon="remove"
                                          color="red"
                                          type="button"
                                          onClick={this.handleClose}
                                          content="Cancel"
                                      />

                                  </Form>
                                  </Segment>
                              </Segment>
                          </Container>

                      </Modal.Content>

                  </FocusTrap>
              </Modal>

        );

    }


}
DownloadModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DownloadModal;
