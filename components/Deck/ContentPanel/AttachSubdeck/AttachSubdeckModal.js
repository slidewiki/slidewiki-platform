import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Icon, Modal, Container, Segment, Menu,Label,Input,Divider} from 'semantic-ui-react';

const headerStyle = {
    'textAlign': 'center'
};
const modalStyle = {
    top: '15%'
};

class AttachSubdeckModal extends React.Component{
  /*Props expected:
    buttonStyle = {
      classNames : string ->additional clases for the trigger button
      iconSize:  enum {large|small} -> final size for displaying the icon of the button. Medium is not accepted by react-semantic-ui component

   }*/
    constructor(props) {
        super(props);
        this.state = {
            modalOpen:false,
            activeItem:'MyDecks'
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleMyDecksClick = this.handleMyDecksClick.bind(this);
        this.handleSlideWikiClick = this.handleSlideWikiClick.bind(this);
        this.catchModalFocus = this.catchModalFocus.bind(this);
        this.avoidLostFocus = this.avoidLostFocus.bind(this);
    }


    handleOpen(){
        this.setState({
            modalOpen:true,
        });
        $('#app').attr('aria-hidden','true');
    }

    handleClose(){
        this.setState({
            modalOpen:false,
        });

    }
    handleMyDecksClick(){
        this.setState({
            activeItem:'MyDecks'
        });

    }
    handleSlideWikiClick(){
        this.setState({
            activeItem:'SlideWiki'
        });

    }
    catchModalFocus(){

        $('#selectedDeckTitleId').focus();


    }
    avoidLostFocus(){
        $('#tabMyDecksId').focus();

    }
    render() {
        //Selected Deck addTreeNodeAndNavigate
        let selectedDeckArea = <Segment textAlign="left" >
                                  <Label htmlFor="selectedDeckTitleId" as="label" basic color="blue" pointing="right">Selected Deck</Label>
                                  <Input type="text" id="selectedDeckTitleId" placeholder="You should select one deck.." tabIndex="0" />
                              </Segment>;
        //From my Decks option content
        let myDecksContent = <Segment>
                                  <img src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                             </Segment>;

        //From SlideWiki content
        let slideWikiContent = <Segment>
                                <img src="http://semantic-ui.com/images/wireframe/media-paragraph.png"/>
                              </Segment>;

        //Default Content
        let segmentPanelContent = myDecksContent;

        if (this.state.activeItem === 'MyDecks'){
            segmentPanelContent = myDecksContent;

        }else{
            segmentPanelContent = slideWikiContent;
        }

        return (
          <Modal trigger={
                    <Button as="button" className={this.props.buttonStyle.classNames}
                      type="button" aria-label="Attach Slide" data-tooltip="Attach Slide"
                      basic icon open={this.state.modalOpen} onClick={this.handleOpen} >
                        <Icon.Group size={this.props.buttonStyle.iconSize}>
                            <Icon className="yellow" name="folder" />
                            <Icon className="corner" name="attach" />
                        </Icon.Group>
                    </Button>
                   }
                open={this.state.modalOpen}
                onClose={this.handleClose}
                onOpen={this.catchModalFocus}
                size="large"
                role="dialog"
                aria-labelledby="attachSubdeckModal"
                aria-hidden = "false"
                tabIndex="0">
                <Modal.Header className="ui center aligned" as="h1" id="attachSubdeckModal">
                     Attach Deck
                </Modal.Header>
                <Modal.Content>
                  <Container>
                    <Segment color="blue" textAlign="center" padded>
                      <Menu attached='top' tabular>
                        <Menu.Item as='button' name='From My Decks' id='tabMyDecksId' active={this.state.activeItem === 'MyDecks'} onClick={this.handleMyDecksClick}
                           role="tab" tabIndex="0" />
                        <Menu.Item as='button' name='From SlideWiki' id='tabFromSlideWikiId' active={this.state.activeItem === 'SlideWiki'}
                           onClick={this.handleSlideWikiClick} role="tab" tabIndex="0" />
                      </Menu>
                      <Segment attached='bottom'>
                        {segmentPanelContent}
                        {selectedDeckArea}
                      </Segment>
                    </Segment>
                  </Container>
                </Modal.Content>
                <Modal.Actions>
                     <Button id='attachAttachDeckModal' color="green" icon tabIndex="0" type="button" aria-label="Attach" data-tooltip="Attach">
                      <Icon name="attach"/>
                       Attach
                       <Icon name="attach"/>
                     </Button>

                    <Button color='red' tabIndex="0" type="button" aria-label="Cancel" data-tooltip="Canccel"
                        onClick={this.handleClose} onBlur={this.avoidLostFocus} >
                      Cancel
                    </Button>
                </Modal.Actions>
           </Modal>

        );
    }

}
AttachSubdeckModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};


export default AttachSubdeckModal;
