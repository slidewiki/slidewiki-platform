import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Button, Icon, Modal, Container, Segment, TextArea} from 'semantic-ui-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore';
import FocusTrap from 'focus-trap-react';
import loadUserDecks  from '../../../../actions/attachSubdeck/loadUserDecks';
import loadRecentDecks  from '../../../../actions/attachSubdeck/loadRecentDecks';
import resetModalStore from '../../../../actions/attachSubdeck/resetModalStore';
import loadSlides from '../../../../actions/attachSubdeck/loadSlides';
import initModal from '../../../../actions/attachSubdeck/initModal';
import addTreeNodeListAndNavigate from '../../../../actions/decktree/addTreeNodeListAndNavigate';
import updateSelectedSlides  from '../../../../actions/attachSubdeck/updateSelectedSlides';
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
            deckSlides:[],


          //  selectedDeckTitle: 'Select one deck...',
          //  showSearchResults: false
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleAttachButton = this.handleAttachButton.bind(this);
        this.handleNextButton = this.handleNextButton.bind(this);
        this.handlePreviousButton = this.handlePreviousButton.bind(this);


    }

    componentWillReceiveProps(nextProps){

        this.setState({
            selectedDeckId: nextProps.AttachSubdeckModalStore.selectedDeckId,
            activeItem: nextProps.AttachSubdeckModalStore.activeItem,
            selectedSlides: nextProps.AttachSubdeckModalStore.selectedSlides,
            deckSlides:nextProps.AttachSubdeckModalStore.deckSlides
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
        this.context.executeAction(loadUserDecks, payload);
        this.context.executeAction(loadRecentDecks, payload2);

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
        this.context.executeAction(loadSlides,{id:this.state.selectedDeckId});
        this.setState({
            showSlides:true
        });



    }
    handleAttachButton(){
        //selector: Object {id: "56", stype: "deck", sid: 67, spath: "67:2"}
        //nodeSec: Object { {type: "slide", id: 1245-2}, {type: "slide", id: 1585-2}}
        let nodeSpec = this.state.selectedSlides.map((slideId) => {
            return {
                type:'slide',
                id:slideId
            };
        });
        this.context.executeAction(addTreeNodeListAndNavigate, {selector: this.props.selector, nodeSpec:nodeSpec});
        this.handleClose();

    }
    handlePreviousButton(){
        this.setState({
            showSlides:false
        });
        this.context.executeAction(updateSelectedSlides,{selectedSlides:[]},null);


    }


    render() {

        //From my Decks option content
        let myDecksContent = <AttachMyDecks destinationDeckId={this.props.selector.id} actionButtonId={'#nextAttachModal'}/>;

        //From SlideWiki content
        let slideWikiContent = <AttachSlideWiki destinationDeckId={this.props.selector.id} actionButtonId={'#nextAttachModal'}/>;

        let segmentPanelContent;
        let searchForm;
        let actionButton;
        let actionButton2;
        let attachMenu;
        let modalDescription;

        if(!this.state.showSlides){//no deck selected, displaying next button
            attachMenu = <AttachMenu activeItem={this.state.activeItem}/>;
            modalDescription =  <TextArea className="sr-only" id="attachSlidesDescription" value="You can attach one or more slides from another deck. First select your deck containing the slides or search SlideWiki for a deck" tabIndex ='-1'/>;
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
            actionButton2='';
        } else{ //deck selected, diplay its slides, previous and attach button
            attachMenu ='';
            searchForm ='';
            modalDescription =  <TextArea className="sr-only" id="attachSlidesDescription" value="Select slides to attach" tabIndex ='-1'/>;
            segmentPanelContent = <AttachSlides numColumns="3" />;
            actionButton = <Button id="attachAttachModal" color="green" icon tabIndex="0" type="button" aria-label="Attach"
                            data-tooltip="Attach" disabled={this.state.selectedSlides.length===0} onClick={this.handleAttachButton}>
                             <Icon name="attach"/>
                              Attach
                             <Icon name="attach"/>
                          </Button>;
            actionButton2 =<Button id="previousAttachModal" color="green" icon tabIndex="0" type="button" aria-label="Previos"
                            data-tooltip="Previous" onClick={this.handlePreviousButton}>
                             <Icon name="arrow left"/>
                              Previous
                             <Icon name="arrow left"/>
                          </Button>;

        }


        return (
           <Modal trigger={
                    <Button as="button" className={this.props.buttonStyle.classNames}
                      type="button"
                      aria-label="Attach Slides"
                      data-tooltip="Attach Slides"
                      aria-hidden={this.state.modalOpen}
                      basic icon onClick={this.handleOpen}
                      tabIndex={this.props.buttonStyle.noTabIndex?-1:0} >
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
                aria-labelledby="attachModalHeader"
                aria-describedby="attachSlidesDescription"
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

                <Modal.Header className="ui center aligned" as="h1" id="attachModalHeader">
                     Attach Slides
                </Modal.Header>
                <Modal.Content>
                    <Container text>
                         <Segment color="blue" textAlign="center" padded>
                            {attachMenu}
                            <Segment attached="bottom" textAlign="left" role="tabpanel">
                               {modalDescription}
                               {searchForm}
                               {segmentPanelContent}
                            </Segment>
                            <Modal.Actions>
                              {actionButton}
                              {actionButton2}
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
