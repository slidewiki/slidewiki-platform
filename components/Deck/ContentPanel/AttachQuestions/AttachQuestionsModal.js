import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Icon, Modal, Container, Segment, TextArea, Popup} from 'semantic-ui-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachQuestionsModalStore from '../../../../stores/AttachQuestionsModalStore';
import DeckTreeStore from '../../../../stores/DeckTreeStore';
import FocusTrap from 'focus-trap-react';
import loadUserDecks from '../../../../actions/attachSubdeck/loadUserDecks';
import loadRecentDecks from '../../../../actions/attachSubdeck/loadRecentDecks';
import resetModalStore from '../../../../actions/attachQuestions/resetModalStore';
//import loadSlides from '../../../../actions/attachSubdeck/loadSlides';
import initModal from '../../../../actions/attachQuestions/initModal';
import addTreeNodeListAndNavigate from '../../../../actions/decktree/addTreeNodeListAndNavigate';
//import updateSelectedSlides from '../../../../actions/attachSubdeck/updateSelectedSlides';
import updateSelectedDeck from '../../../../actions/attachQuestions/updateSelectedDeck';
import updateSelectedQuestions from '../../../../actions/attachQuestions/updateSelectedQuestions';
import addActivities from '../../../../actions/activityfeed/addActivities';
import AttachMenu from './AttachQuestionsMenu';
import AttachMyDecks from './AttachMyDecks';
import AttachSlideWiki from './AttachSlideWiki';
import AttachSearchForm from '../AttachSubdeck/AttachSearchForm';
import AttachQuestionsList from './AttachQuestionsList'; 
import {FormattedMessage, defineMessages} from 'react-intl';
import AttachCurrentDeck from './AttachCurrentDeck';
import loadQuestions from '../../../../actions/attachQuestions/loadQuestions';
import updateShowQuestions from '../../../../actions/attachQuestions/updateShowQuestions';
import updateShowOptions from '../../../../actions/attachQuestions/updateShowOptions'; 
import AttachQuestionsOptions from './AttachQuestionsOptions';
import embedQuestions from '../../../../actions/attachQuestions/embedQuestions';

class AttachQuestionsModal extends React.Component{
  /*Props expected:
    buttonStyle = {
      classNames : string ->additional clases for the trigger button
      iconSize:  enum {large|small} -> final size for displaying the icon of the button. Medium is not accepted by react-semantic-ui component
   }*/

    constructor(props) {
        super(props);
        /*nikki should this hold the state components for all of the question modal? then pass them down (along with handlers)  */
        this.state = {
            modalOpen: false,
            activeItem: 'CurrentDeck', /*nikki changed to currentdeck */
            activeTrap: false,
            selectedDeckId: -1,
            selectedQuestions:[],
            deckQuestions:[],
            showQuestions: false, /*nikki changed away from true */
            showOptions: false, /*nikki added, is this strictly necesary? */

        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleAttachButton = this.handleAttachButton.bind(this);
        this.handleNextButton = this.handleNextButton.bind(this);
        this.handlePreviousDecksButton = this.handlePreviousDecksButton.bind(this);
        this.handleOptionsButton = this.handleOptionsButton.bind(this);
        this.handlePreviousQuestionsButton = this.handlePreviousQuestionsButton.bind(this);
    }

    componentWillReceiveProps(nextProps){/*nikki shouldn't be used as it it legacy should this whole bit be removed??*/
    //possibly should use the componentDidUpdate or Mount? feature instead?
    /*nikki where are these even coming from? */
        this.setState({
            selectedDeckId: nextProps.AttachQuestionsModalStore.selectedDeckId,
            activeItem: nextProps.AttachQuestionsModalStore.activeItem,
            selectedQuestions: nextProps.AttachQuestionsModalStore.selectedQuestions,
            deckQuestions:nextProps.AttachQuestionsModalStore.deckQuestions,
            showQuestions: nextProps.AttachQuestionsModalStore.showQuestions,
            showOptions: nextProps.AttachQuestionsModalStore.showOptions,
        });
    }

    componentWillUnmount(){
        this.context.executeAction(resetModalStore,[]);
    }

    handleOpen(){
      //FETCH USER DECKS
        let payload = {params:{
            id2:this.props.UserProfileStore.userid,
            id:this.props.UserProfileStore.userid,
            jwt:this.props.UserProfileStore.jwt,
            loggedInUser:this.props.UserProfileStore.username,
            username:this.props.UserProfileStore.username
        }};
        this.context.executeAction(loadUserDecks, payload); //should this go into the mydecksclick?
        let payload2 = {params: {
            limit: 20,
            offset: 0
        }};
        this.context.executeAction(loadRecentDecks, payload2); //should this go into the slidewikiclick?
        let payload3  = {
            selectedDeckId: this.props.selector.id, /*nikki should this be set to the current deck?  was this.state.selectedDeckId*/
            selectedDeckTitle: this.getTitle(this.props.DeckTreeStore.deckTree, 'deck', this.props.selector.id)//'First select the deck which contains the questions you wish to attach...'
            }; //*nikki what is this doing? */
        //console.log(`id ${this.props.selector.id}`);
        //console.log(`Deck title: ${this.getTitle(this.props.currentDeck.DeckTreeStore.deckTree, 'deck', this.props.selector.id)}`);
        this.context.executeAction(updateSelectedDeck,payload3);
        let selector = this.props.selector;
        //console.log(selector);
        this.context.executeAction(loadQuestions, {params:selector});
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
            activeItem: 'CurrentDeck', /*nikki changed to CurrentDeck */
            selectedQuestions:[],
            //showQuestions:true, /*nikki should this be false instead? */
            selectedDeckId: -1
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
        //nikki should reset the selected questions to empty
        this.setState({
            selectedQuestions:[]
        })
        this.context.executeAction(updateSelectedQuestions,{selectedQuestions:[]});
        let deckSelector = {id:this.state.selectedDeckId, stype:'deck', sid:this.state.selectedDeckId}; //not being set correctly by the mydecks/search?
        this.context.executeAction(loadQuestions,{params:deckSelector});
        //console.log(this.state.selectedDeckId);
        this.setState({
            showQuestions:true
        });
        this.context.executeAction(updateShowQuestions,true);
        /*nikki new action that sets the showQuestions flag in the store? */
        //console.log(this.state.showQuestions);
        /*nikki need to change this bit? */
    }

    handleOptionsButton(){
        console.log('button - options!!');
        //console.log(this.state.selectedQuestions);
        console.log(this.props.AttachQuestionsModalStore.selectedQuestions);
        this.setState({
            showOptions:true /*nikki is this necessary? */
        });
        this.context.executeAction(updateShowOptions, true);
        //console.log(this.props.AttachQuestionsModalStore.selectedQuestions);
    }

    handlePreviousDecksButton(){
        console.log('previous decks button clicked');
        this.setState({
            showQuestions:false /*nikki needs checking */
        });
        this.context.executeAction(updateSelectedQuestions,{selectedQuestions:[]},null);
        this.context.executeAction(updateShowQuestions, false);
    /*nikki change this, updated questions instead */

    }

    handlePreviousQuestionsButton(){
        console.log('previous questions button clicked');
        this.setState({
            showQuestions:true,
            showOptions:false /*nikki is this necessary? */
        });
        //this.context.executeAction(updateSelectedQuestions,{selectedQuestions:[]},null);
        this.context.executeAction(updateShowQuestions, true);
        this.context.executeAction(updateShowOptions, false);
        //console.log(this.state.activeItem);
        console.log(this.state.selectedQuestions);
        //console.log(this.props.AttachQuestionsModalStore.deckQuestions);
        //console.log(this.state.deckQuestions);
        /*nikki is this all that's needed? */
    }

    handleAttachButton(){
        /*nikki need to change this bit */
        //call action that produces the slide content and then calls the changeTemplate action? or just dispatches to the store? 
        /*nikki can it have an extra parameter? */

        //selector: Object {id: "56", stype: "deck", sid: 67, spath: "67:2"}
        //nodeSec: Object { {type: "slide", id: 1245-2}, {type: "slide", id: 1585-2}}
        //each element of the payload.selectedSlides array is like 11225-2-6 (slideId-revisionId-orderInDeck)
        //we need to remove the order in Deck
        /*let nodeSpec = this.state.selectedSlides.map((slideIdWithOrder) => {
            let pos = slideIdWithOrder.lastIndexOf('-');
            let slideId = slideIdWithOrder.substring(0,pos);
            return {
                type:'slide',
                id:slideId
            };
        });
        this.context.executeAction(addTreeNodeListAndNavigate, {selector: this.props.selector, nodeSpec:nodeSpec, attach: true});

        //find target deck id
        let targetDeckId = this.props.selector.sid; */ /*nikki not correct as it is coming from a slide */
        /*if (this.props.selector.stype === 'slide') {
            const pathArray = this.props.selector.spath.split(';');
            if (pathArray.length > 1) {
                const parentDeck = pathArray[pathArray.length - 2];
                targetDeckId = parentDeck.split(':')[0];
            } else {
                targetDeckId = this.props.selector.id;
            }
        }*/

        /*nikki do we need this bit? what does it do? */
        /*let activities = nodeSpec.map((node) => {
            return {
                activity_type: 'use',
                user_id: String(this.props.UserProfileStore.userid),
                content_id: node.id,
                content_kind: 'slide',
                use_info: {
                    target_id:  targetDeckId,
                    target_name: this.getTitle(this.props.DeckTreeStore.deckTree, 'deck', targetDeckId)
                }
            };
        });*/
        //this.context.executeAction(addActivities, {activities: activities});

        /*nikki change comments below */
        //set some content
        let embedContent = {
            title: 'title',
            questions: this.props.AttachQuestionsModalStore.selectedQuestions,
            //insert additional options here
        };
        /*nikki need error handling before doing the close action? */
        //TODO: internationalise these messages?
        swal({
            title: 'Confirm Embed Questions',
            text: 'Adding questions will overwrite the existing content in this slide. You can always revert to an earlier version of the slide or decide to not save after embedding the questions.',
            type: 'question',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Embed Questions',
            confirmButtonClass: 'ui green button',
            cancelButtonText: 'Cancel',
            cancelButtonClass: 'ui red button',
            buttonsStyling: false,
            focusConfirm: true,
            allowEnterKey: true,
            showCloseButton: true,
            allowEscapeKey: true,
        }).then((result) => {
            this.handleClose();
            console.log(embedContent);
            this.context.executeAction(embedQuestions, embedContent);
            //this.applyTemplate(template, true); //keep existing content
        }, (reason) => {
            if (reason === 'cancel') {
                
                console.log('cancel pressed - do nothing/close dialog?');
                //this.applyTemplate(template, false);
            } else {
                console.log('reason:' + reason + ' - do nothing/close dialog');
            }
        });
        setTimeout(() => {
            $('.swal2-confirm').focus();
        }, 500);

        

    }


    //find node title
    getTitle(deckTree, type, id) {
        let title = '';
        if (deckTree.get('type') === type && deckTree.get('id') === id) {
            title = deckTree.get('title');
        } else if (deckTree.get('type') === 'deck') {
            deckTree.get('children').forEach((item, index) => {
                if (title === '') {
                    title = this.getTitle(item, type, id);
                }
            });
        }
        return title;
    }

    /*nikki Makes the add questions button keyboard accessible */
    handleKeyPress = (event, param) => {
        if(event.key === 'Enter'){
           // console.log('enter key');
            if(param === 'handleAddQuestionsClick') {
                this.handleOpen();
            }
        }
    }

    render() {

        /*nikki define the action buttons up here, then just call them. nextQuestions, nextOptions, attach, previousQuestions, previousDecks ?? provided the display conditions are the same.*/
        //action buttons
        /*nikki change refs to state? */
        let nextQuestionsBtn = <Button id="nextQuestions" color="green" icon tabIndex="0" type="button" aria-label="Next Select questions" data-tooltip="Attach" disabled={this.state.selectedDeckId===-1} onClick={this.handleNextButton}>
            <Icon name="arrow right"/>
                Next
            <Icon name="arrow right"/>
        </Button>; //next button to take you to the question listing
        let nextOptionsBtn = <Button id="nextOptions" color="green" icon tabIndex="0" type="button" aria-label="Next Select options" data-tooltip="Attach" disabled={this.state.selectedQuestions.length===0} onClick={this.handleOptionsButton}>
            <Icon name="arrow right"/>
                Next
            <Icon name="arrow right"/>
        </Button>; //next button to take you to the options page. 
        let previousDecksBtn = <Button id="previousDecks" color="green" icon tabIndex="0" type="button" aria-label="Previous Decks" data-tooltip="Return to decks list" onClick={this.handlePreviousDecksButton}>
            <Icon name="arrow left"/>
                Previous
            <Icon name="arrow left"/>
        </Button>; // previous button to take you back to the deck listing
        let previousQuestionsBtn = <Button id="previousQuestions" color="green" icon tabIndex="0" type="button" aria-label="Previous Questions" data-tooltip="Return to questions list" onClick={this.handlePreviousQuestionsButton}>
        <Icon name="arrow left"/>
            Previous xxx
        <Icon name="arrow left"/>
    </Button>;; // previous button to take you back to the question listing
    //onClick={this.handlePreviousButton}
        let attachBtn = <Button id="attachAttachModal" color="green" icon tabIndex="0" type="button" aria-label="Attach" data-tooltip="Attach" disabled={this.state.selectedQuestions.length===0} onClick={this.handleAttachButton}>
            <Icon name="attach"/>
                Attach
            <Icon name="attach"/>
        </Button>; // attach button to put the questions into the deck onClick={this.handleAttachButton}
        /*nikki maybe change the disabled criteria?? */

        //From current deck content
        let currentDeckContent = <AttachCurrentDeck deckQuestions={this.props.AttachQuestionsModalStore.deckQuestions} questionsCount={this.props.AttachQuestionsModalStore.deckQuestionsCount} currentDeckID={this.props.selector.id} actionButtonId={'#nextAttachModal'}/>; {/*nikki does this action button need changing? need to pass questions?*/}
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

    
        //Check if showOptions is true first?
        if(this.state.showOptions){
            attachMenu ='';
            searchForm ='';
            segmentPanelContent = <AttachQuestionsOptions selectedQuestions={this.state.selectedQuestions}/>; //nikki attachQuestionsOptions with props passed to it
            actionButton = previousQuestionsBtn;
            actionButton2 = attachBtn; /*nikki doesn't work yet. */
            
        } else if(this.state.activeItem === 'CurrentDeck') {
            //Display current deck questions when current deck tab is selected
            attachMenu = <AttachMenu activeItem={this.state.activeItem} selector={this.props.selector}/>;
            /*nikki does this description want to be here? */
            modalDescription =  <TextArea className="sr-only" id="attachQuestionsDescription" value="You can attach one or more questions from this deck." tabIndex ='-1'/>;

            searchForm = '';
            segmentPanelContent = currentDeckContent;
            //need to change this button? should lead to the options page...maybe handleOptionsButton?
            /*nikki changed the disabled conditions for the button */
            actionButton = nextOptionsBtn;
            actionButton2='';

        } else if ((this.state.activeItem !== 'CurrentDeck') && (!this.state.showQuestions)){
            //Display my deck list or the search form to find a deck
            attachMenu = <AttachMenu activeItem={this.state.activeItem}  selector={this.props.selector}/>;
            modalDescription =  <TextArea className="sr-only" id="attachQuestionsDescription" value="You can attach one or more questions from this deck or another deck. First select your deck containing the questions or search SlideWiki for a deck." tabIndex ='-1'/>;
            
            if(this.state.activeItem === 'MyDecks'){
                searchForm ='';
                segmentPanelContent = myDecksContent;
            }else{
                searchForm =  <AttachSearchForm />;
                segmentPanelContent = slideWikiContent;
            }

            actionButton = nextQuestionsBtn;
            actionButton2='';
        } else if(this.state.showQuestions){
           //Displays list of questions for the selected deck - when the tab isn't current deck tab and it is showQuestions
            attachMenu ='';
            searchForm ='';
            modalDescription= <TextArea className="sr-only" id="attachQuestionsDescription" value="Select questions to embed in the slide" tabIndex ='-1'/>;

            if(this.props.questionsCount === 0){
                segmentPanelContent = <div>There are no questions in this deck. Either select another deck to insert questions from or create some questions within this deck.</div>; 
            }else {
                segmentPanelContent = (
                  <AttachQuestionsList maxHeight='350px'/>
                 ); //params user={userInfo} deckQuestions={this.props.deckQuestions} selectedDeckId={this.props.currentDeckID} actionButtonId={this.props.actionButtonId} maxHeight='400px'
            }
            //segmentPanelContent = <AttachQuestionsList maxHeight='350px'/>; //how was this getting the questions? pulling them from the state?
            actionButton = previousDecksBtn;
            actionButton2 = nextOptionsBtn;

        } else {
            console.log('urm...not right');
            //does something need to go here?
        }

        let attachQuestionsBtn = <a  className="item" id="handleAddQuestionsModal" role="button" aria-hidden={this.state.modalOpen} onClick={this.handleOpen} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleAddQuestionsClick')} tabIndex={this.props.buttonStyle.noTabIndex ? -1 : 0}>
        <i className="help icon"/>
        <FormattedMessage id='editpanel.handleAddQuestionsClick' defaultMessage='Add questions' />
        </a>;

        return (
           <Modal trigger={attachQuestionsBtn}
                open={this.state.modalOpen}
                onClose={this.handleClose}
                role="dialog"
                id="attachQuestionsModal"
                aria-labelledby="attachModalHeader"
                aria-describedby="attachQuestionsDescription" 
                aria-hidden = {!this.state.modalOpen}
                tabIndex="0">
                                
                <Modal.Header className="ui center aligned" as="h1" id="attachModalHeader">
                    Embed questions
                </Modal.Header>
                
                <FocusTrap
                        id="focus-trap-attachQuestionsModal"
                        focusTrapOptions={{
                            onDeactivate: this.unmountTrap,
                            clickOutsideDeactivates: true,
                            initialFocus: '#tabCurrentDeckId'
                        }}
                        active={this.state.activeTrap}
                        >
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
                              <Button id="cancelAttachModal" color="red" tabIndex="0" type="button" aria-label="Cancel" data-tooltip="Cancel" onClick={this.handleClose} >
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


AttachQuestionsModal.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

AttachQuestionsModal = connectToStores(AttachQuestionsModal,[UserProfileStore,AttachQuestionsModalStore,DeckTreeStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        AttachQuestionsModalStore: context.getStore(AttachQuestionsModalStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});

export default AttachQuestionsModal;
