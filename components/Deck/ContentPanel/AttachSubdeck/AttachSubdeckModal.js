import React from 'react';
import { Button, Icon, Modal, Container, Segment, Menu} from 'semantic-ui-react';

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
      iconSize:  enum {large | medium |small} -> final size for displaying the icon of the button

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
    }

    handleOpen(){
        this.setState({
            modalOpen:true,
        });

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
        console.log('ModalMyDecksClik');
    }
    handleSlideWikiClick(){
        this.setState({
            activeItem:'SlideWiki'
        });
        console.log('ModalSlideWikiClik');
    }
    render() {
        //From my Decks option content
        let myDecksContent = <img src="http://semantic-ui.com/images/wireframe/paragraph.png" />;

        //From SlideWiki content
        let slideWikiContent = <img src="http://semantic-ui.com/images/wireframe/media-paragraph.png"/>;

        //Default Content
        let segmentPanelContent = {myDecksContent};

        if (this.state.activeItem === 'MyDecks'){
            segmentPanelContent = myDecksContent;

        }else{
            segmentPanelContent = slideWikiContent;
        }

        return (
          <Modal trigger={
                    <Button as="button" className={this.props.buttonStyle.classNames}
                      type="button" aria-label="Attach Slide" data-tooltip="Attach Slide"
                      basic icon open={this.state.modalOpen} onClick={this.handleOpen}>
                        <Icon.Group size={this.props.buttonStyle.iconSize}>
                            <Icon className="yellow" name="folder" />
                            <Icon className="corner" name="attach" />
                        </Icon.Group>
                    </Button>
                   }
                open={this.state.modalOpen}
                onClose={this.handleClose}
                size="large">
                <Modal.Header className="ui center aligned" as="h1">
                     Attach Deck
                </Modal.Header>
                <Modal.Content>
                  <Container>
                    <Segment color="blue" textAlign="center" padded>
                      <Menu attached='top' tabular>
                        <Menu.Item name='From My Decks' active={this.state.activeItem === 'MyDecks'} onClick={this.handleMyDecksClick} />
                        <Menu.Item name='From SlideWiki' active={this.state.activeItem === 'SlideWiki'} onClick={this.handleSlideWikiClick} />
                      </Menu>
                      <Segment attached='bottom'>
                        {segmentPanelContent}
                      </Segment>
                    </Segment>
                  </Container>
                </Modal.Content>
                <Modal.Actions>
                     <Button color="green" icon>
                      <Icon name="attach"/>
                       Attach
                       <Icon name="attach"/>
                     </Button>

                    <Button color='red' tabIndex="0" onClick={this.handleClose} >
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
