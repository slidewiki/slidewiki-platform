import React from 'react';
//import ReactDOM from 'react-dom';
//import { connectToStores } from 'fluxible-addons-react';
import { Button, Icon, Modal, Container, Segment, Menu,Label,Input,Divider, TextArea} from 'semantic-ui-react';
//import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore';
import FocusTrap from 'focus-trap-react';




class AttachSubdeckModal extends React.Component{
  /*Props expected:
    buttonStyle = {
      classNames : string ->additional clases for the trigger button
      iconSize:  enum {large|small} -> final size for displaying the icon of the button. Medium is not accepted by react-semantic-ui component

   }*/
    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            activeItem: 'MyDecks',
            activeTrap: false
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleMyDecksClick = this.handleMyDecksClick.bind(this);
        this.handleSlideWikiClick = this.handleSlideWikiClick.bind(this);
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
            activeTrap: false
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


    unmountTrap(){
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    render() {
        //Selected Deck addTreeNodeAndNavigate
        let selectedDeckArea = <Segment textAlign="left" >
                                  <Label htmlFor="selectedDeckTitleId" as="label" basic color="blue" pointing="right">Selected Deck</Label>
                                  <Input type="text" id="selectedDeckTitleId" placeholder="You should select one deck.." tabIndex="0" />
                              </Segment>;
        //From my Decks option content
        let myDecksContent = <Segment id="panelMyDecksContent">
                                  <img src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                             </Segment>;

        //From SlideWiki content
        let slideWikiContent = <Segment id="panelSlideWikiContent">
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
                      type="button" aria-label="Attach Slide" data-tooltip="Attach Slide" aria-hidden={this.state.modalOpen}
                      basic icon onClick={this.handleOpen} >
                        <Icon.Group size={this.props.buttonStyle.iconSize}>
                            <Icon className="yellow" name="folder" />
                            <Icon className="corner" name="attach" />
                        </Icon.Group>
                    </Button>
                   }
                open={this.state.modalOpen}
                onClose={this.handleClose}
                size="large"
                role="dialog"
                id="attachSubDeckModal"
                aria-labelledby="attachSubdeckHeader"
                aria-describedby="attachSubdeckModalDescription"
                aria-hidden = {!this.state.modalOpen}
                tabIndex="0">
                <FocusTrap
                        id='focus-trap-attachSubdeckModal'
                        className = "header"
                        active={this.state.activeTrap}
                        focusTrapOptions={{
                            onDeactivate: this.unmountTrap,
                            clickOutsideDeactivates: true,
                            initialFocus: '#tabMyDecksId',
                        }}>
                <Modal.Header className="ui center aligned" as="h1" id="attachSubdeckModalHeader">
                     Attach Deck
                </Modal.Header>
                <Modal.Content>
                    <Container>
                         <Segment color="blue" textAlign="center" padded>
                            <Menu attached='top' tabular role="tablist">
                                     <Menu.Item as='button' name='From My Decks' id='tabMyDecksId' active={this.state.activeItem === 'MyDecks'} aria-selected={this.state.activeItem === 'MyDecks'} onClick={this.handleMyDecksClick}
                                                  role="tab" tabIndex="0" />
                                     <Menu.Item as='button' name='From SlideWiki' id='tabFromSlideWikiId' active={this.state.activeItem === 'SlideWiki'} aria-selected={this.state.activeItem === 'SlideWiki'}
                                                  onClick={this.handleSlideWikiClick} role="tab" tabIndex="0" />
                            </Menu>
                            <Segment attached='bottom'>
                               <TextArea className="sr-only" id="attachSubdeckModalDescription" value="Select deck to attach from your  My Decks list or search SlideWiki" />
                               {segmentPanelContent}
                               {selectedDeckArea}
                            </Segment>
                            <Modal.Actions>
                              <Button id='attachAttachDeckModal' color="green" icon tabIndex="0" type="button" aria-label="Attach" data-tooltip="Attach">
                                <Icon name="attach"/>
                                  Attach
                                  <Icon name="attach"/>
                              </Button>
                              <Button color='red' tabIndex="0" type="button" aria-label="Cancel" data-tooltip="Cancel" onClick={this.handleClose} >
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
AttachSubdeckModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
/*
AttachSubdeckModal = connectToStores(AttachSubdeckModal,[AttachSubdeckModalStore],(context,props) => {
    return {
        AttachSubdeckModalStore: context.getStore(AttachSubdeckModalStore).getState()
    };
});
*/
export default AttachSubdeckModal;
