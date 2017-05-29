import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Button, Icon, Modal, Container, Segment, TextArea} from 'semantic-ui-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore';
import FocusTrap from 'focus-trap-react';
import loadUserDecks  from '../../../../actions/attachSubdeck/loadUserDecks';
import loadRecentDecks  from '../../../../actions/attachSubdeck/loadRecentDecks';
import resetModalStore from '../../../../actions/attachSubdeck/resetModalStore';
import initModal from '../../../../actions/attachSubdeck/initModal';
import addTreeNodeAndNavigate from '../../../../actions/decktree/addTreeNodeAndNavigate';
import AttachDeckList from './AttachDeckList';
import AttachMenu from './AttachMenu';
import AttachMyDecks from './AttachMyDecks';
import AttachSlideWiki from './AttachSlideWiki';
import AttachSearchForm from './AttachSearchForm';
import AttachSlides from './AttachSlides';




class AttachSubdeckModal extends React.Component{
  /*Props expected:
    buttonStyle = {
      classNames : string ->additional clases for the trigger button
      iconSize:  enum {large|small} -> final size for displaying the icon of the button. Medium is not accepted by react-semantic-ui component

   }*/

    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            activeItem: 'MyDecks',
            activeTrap: false,
            selectedDeckId: -1,
            selectedSlides:[],
            showSlides:false,

          //  selectedDeckTitle: 'Select one deck...',
          //  showSearchResults: false
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleAttachButton = this.handleAttachButton.bind(this);
        this.handleNextButton = this.handleNextButton.bind(this);

    }

    componentWillReceiveProps(nextProps){

        this.setState({
            selectedDeckId: nextProps.AttachSubdeckModalStore.selectedDeckId,
            activeItem: nextProps.AttachSubdeckModalStore.activeItem
        });

    }
    componentWillUnmount(){
        this.context.executeAction(resetModalStore,[]);

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
            limit: 20,
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
            activeTrap: false,
            activeItem: 'MyDecks',
            selectedSlides:[],
            showSlides:false

        });
        this.context.executeAction(initModal,[]);
    }

    unmountTrap(){
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }

    }

    handleNextButton(){
        this.setState({
            showSlides:true
        });

    }
    handleAttachButton(){
        //selector: Object {id: "56", stype: "deck", sid: 67, spath: "67:2"}
        //nodeSec: Object {type: "deck", id: 1245-2}
        this.context.executeAction(addTreeNodeAndNavigate, {selector: this.props.selector, nodeSpec: {type:'deck',id:this.state.selectedDeckId}});
        this.handleClose();

    }


    render() {




        //From my Decks option content
        let myDecksContent = <AttachMyDecks />;

        //From SlideWiki content
        let slideWikiContent = <AttachSlideWiki />;

        let segmentPanelContent;
        let searchForm;
        let actionButton;
        if(!this.state.showSlides){//no deck selected, displaying next button
            if (this.state.activeItem === 'MyDecks'){
                searchForm ='';
                segmentPanelContent = myDecksContent;

            }else{
                searchForm =  <AttachSearchForm />;
                segmentPanelContent = slideWikiContent;
            }

            actionButton = <Button id="nextAttachModal" color="green" icon tabIndex="0" type="button" aria-label="Next Select slides"
                              data-tooltip="Attach" disabled={this.state.selectedDeckId===-1} onClick={this.handleNextButton}>
                               <Icon name="arrow right"/>
                                Next
                               <Icon name="arrow right"/>
                            </Button>;
        } else{
        
            searchForm ='';
            segmentPanelContent = <AttachSlides />;
            actionButton = <Button id="attachAttachModal" color="green" icon tabIndex="0" type="button" aria-label="Attach"
                            data-tooltip="Attach" disabled={this.state.selectedSlides===[]} onClick={this.handleAttachButton}>
                             <Icon name="attach"/>
                              Attach
                             <Icon name="attach"/>
                          </Button>;

        }


        return (
           <Modal trigger={
                    <Button as="button" className={this.props.buttonStyle.classNames}
                      type="button" aria-label="Attach Slides" data-tooltip="Attach Slides" aria-hidden={this.state.modalOpen}
                      basic icon onClick={this.handleOpen} >
                        <Icon.Group size={this.props.buttonStyle.iconSize}>
                            <Icon className="grey" name="file text outline" />
                            <Icon className="corner black" name="attach" />
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
                     Attach Slides
                </Modal.Header>
                <Modal.Content>
                    <Container text>
                         <Segment color="blue" textAlign="center" padded>
                            <AttachMenu activeItem={this.state.activeItem}/>
                            <Segment attached="bottom" textAlign="left" role="tabpanel">
                               <TextArea className="sr-only" id="attachSubdeckModalDescription" value="Select deck to attach from your  My Decks list or search SlideWiki" />

                               {searchForm}
                               {segmentPanelContent}
                            </Segment>
                            <Modal.Actions>
                              {actionButton}
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
