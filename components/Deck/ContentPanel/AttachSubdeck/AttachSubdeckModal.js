import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Button, Icon, Modal, Container, Segment, Menu,Label,Input,Divider, TextArea, Image,Dimmer} from 'semantic-ui-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore';
import FocusTrap from 'focus-trap-react';
import loadUserDecks  from '../../../../actions/attachSubdeck/loadUserDecks';
import loadRecentDecks  from '../../../../actions/attachSubdeck/loadRecentDecks';
import addTreeNodeAndNavigate from '../../../../actions/decktree/addTreeNodeAndNavigate';
import AttachDeckList from './AttachDeckList';

//import fetchUserDecks  from '../../../../actions/user/userprofile/fetchUser.js';


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
            activeTrap: false,
            userDecks: [],
            recentDecks:[],
            selectedDeckTitle: 'Select one deck...'
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleMyDecksClick = this.handleMyDecksClick.bind(this);
        this.handleSlideWikiClick = this.handleSlideWikiClick.bind(this);
        this.handleAttachButton = this.handleAttachButton.bind(this);
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.AttachSubdeckModalStore.userDecks !== this.state.userDecks){
            this.setState({
                userDecks: nextProps.AttachSubdeckModalStore.userDecks
            });
        }
        if(nextProps.AttachSubdeckModalStore.recentDecks !== this.state.recentDecks){
            this.setState({
                recentDecks: nextProps.AttachSubdeckModalStore.recentDecks
            });
        }


        if(nextProps.AttachSubdeckModalStore.selectedDeckId !== this.state.selectedDeckId){
            this.setState({
                selectedDeckId: nextProps.AttachSubdeckModalStore.selectedDeckId,
                selectedDeckTitle:nextProps.AttachSubdeckModalStore.selectedDeckTitle
            });
        }
    }

    handleOpen(){

      //fETCH USER DECKS
        let payload = {params:{
            id2:this.props.UserProfileStore.userid,
            id:this.props.UserProfileStore.userid,
            jwt:this.props.UserProfileStore.jwt,
            loggedInUser:this.props.UserProfileStore.username,
            username:this.props.UserProfileStore.username
        }};
        let payload2 ={params: {
            limit: 5,
            offset: 0
        }};
        this.context.executeAction(loadUserDecks, payload,null);
        this.context.executeAction(loadRecentDecks, payload2,null);

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
    loadMyDecksContent(){
        let userInfo ={
            userId: this.props.UserProfileStore.userid,
            username: this.props.UserProfileStore.username

        };
        let myDecksContent;
        if(this.state.userDecks ===[]){
            myDecksContent = <Segment id="panelMyDecksContent">
                                <Dimmer active inverted>
                                    <Loader inverted>Loading</Loader>
                                </Dimmer>
                                <Image src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                            </Segment>;
        } else{
            myDecksContent = <Segment id="panelMyDecksContent">
                                <Label htmlFor="selectedDeckTitleId" as="label"  color="blue" pointing="right">Selected Deck</Label>
                                <Label  id="selectedDeckTitleId" content={this.state.selectedDeckTitle} basic color="blue"/>
                                <AttachDeckList user={userInfo} decks={this.state.userDecks} selectedDeckId={this.state.selectedDeckId} />
                            </Segment>;
        }

        return myDecksContent;
    }
    loadSlideWikiContent(){
        let slideWikiContent;
        let userInfo ={
            userId: this.props.UserProfileStore.userid,
            username: this.props.UserProfileStore.username

        };
        if(this.state.recentDecks ===[]){
            slideWikiContent = <Segment id="panelMyDecksContent">
                                <Dimmer active inverted>
                                    <Loader inverted>Loading</Loader>
                                </Dimmer>
                                <Image src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                            </Segment>;
        } else{
            slideWikiContent = <Segment id="panelMyDecksContent">
                                <Label htmlFor="selectedDeckTitleId" as="label"  color="blue" pointing="right">Selected Deck</Label>
                                <Label  id="selectedDeckTitleId" content={this.state.selectedDeckTitle} basic color="blue"/>
                                <AttachDeckList user={userInfo} decks={this.state.recentDecks} selectedDeckId={this.state.selectedDeckId} />
                                </Segment>;
        }

        return slideWikiContent;

    }
    handleAttachButton() {
        //selector: Object {id: "56", stype: "deck", sid: 67, spath: "67:2"}
        //nodeSec: Object {type: "deck", id: 1245-2}
        this.context.executeAction(addTreeNodeAndNavigate, {selector: this.props.selector, nodeSpec: {type:'deck',id:this.state.selectedDeckId}});
        this.handleClose();

    }

    render() {


        /*
        let selectedDeckArea = <Segment textAlign="left" >
                                  <Label htmlFor="selectedDeckTitleId" as="label"  color="blue" pointing="right">Selected Deck</Label>
                                  <Label  id="selectedDeckTitleId" content={this.state.selectedDeckTitle} basic color="blue"/>
                              </Segment>;
                        */
        //From my Decks option content
        let myDecksContent = this.loadMyDecksContent();

        //From SlideWiki content
        let slideWikiContent = this.loadSlideWikiContent();

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
                role="dialog"
                id="attachSubDeckModal"
                aria-labelledby="attachSubdeckHeader"
                aria-describedby="attachSubdeckModalDescription"
                aria-hidden = {!this.state.modalOpen}
                tabIndex="0">
                <FocusTrap
                        id="focus-trap-attachSubdeckModal"
                        focusTrapOptions={{
                            onDeactivate: this.unmountTrap,
                            clickOutsideDeactivates: true,
                            initialFocus: '#tabMyDecksId'
                        }}
                        active={this.state.activeTrap}
                        className = "header">

                <Modal.Header className="ui center aligned" as="h1" id="attachSubdeckModalHeader">
                     Attach Deck
                </Modal.Header>
                <Modal.Content>
                    <Container text>
                         <Segment color="blue" textAlign="center" padded>
                            <Menu attached='top' tabular role="tablist">
                                     <Menu.Item as="button" name="From My Decks" id="tabMyDecksId" active={this.state.activeItem === 'MyDecks'} aria-selected={this.state.activeItem === 'MyDecks'} onClick={this.handleMyDecksClick}
                                                  role="tab" tabIndex="0" />
                                     <Menu.Item as="button" name="From SlideWiki" id="tabFromSlideWikiId" active={this.state.activeItem === 'SlideWiki'} aria-selected={this.state.activeItem === 'SlideWiki'}
                                                  onClick={this.handleSlideWikiClick} role="tab" tabIndex="0" />
                            </Menu>
                            <Segment attached="bottom" textAlign="left" role="tabpanel">
                               <TextArea className="sr-only" id="attachSubdeckModalDescription" value="Select deck to attach from your  My Decks list or search SlideWiki" />
                               {/*selectedDeckArea*/}
                               {segmentPanelContent}

                            </Segment>
                            <Modal.Actions>
                              <Button id="attachAttachDeckModal" color="green" icon tabIndex="0" type="button" aria-label="Attach"
                                  data-tooltip="Attach" disabled={this.state.selectedDeckId===-1} onClick={this.handleAttachButton}>
                                <Icon name="attach"/>
                                  Attach
                                  <Icon name="attach"/>
                              </Button>
                              <Button color="red" tabIndex="0" type="button" aria-label="Cancel" data-tooltip="Cancel" onClick={this.handleClose} >
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

AttachSubdeckModal = connectToStores(AttachSubdeckModal,[UserProfileStore,AttachSubdeckModalStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        AttachSubdeckModalStore: context.getStore(AttachSubdeckModalStore).getState()
    };
});

export default AttachSubdeckModal;
