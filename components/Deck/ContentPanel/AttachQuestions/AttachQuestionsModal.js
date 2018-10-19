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
import initModal from '../../../../actions/attachQuestions/initModal';
//import addTreeNodeListAndNavigate from '../../../../actions/decktree/addTreeNodeListAndNavigate';
import updateSelectedDeck from '../../../../actions/attachQuestions/updateSelectedDeck';
import updateSelectedQuestions from '../../../../actions/attachQuestions/updateSelectedQuestions';
import addActivities from '../../../../actions/activityfeed/addActivities';
import AttachMenu from './AttachQuestionsMenu';
import AttachMyDecks from './AttachMyDecks';
import AttachSlideWiki from './AttachSlideWiki';
import AttachSearchForm from '../AttachSubdeck/AttachSearchForm';
import AttachQuestionsList from './AttachQuestionsList'; 
import AttachSelectedDeck from './AttachSelectedDeck';
import {FormattedMessage, defineMessages} from 'react-intl';
import AttachCurrentDeck from './AttachCurrentDeck';
import loadQuestions from '../../../../actions/attachQuestions/loadQuestions';
import updateShowQuestions from '../../../../actions/attachQuestions/updateShowQuestions';
import updateShowOptions from '../../../../actions/attachQuestions/updateShowOptions'; 
import updateShowWarning from '../../../../actions/attachQuestions/updateShowWarning';
import AttachQuestionsOptions from './AttachQuestionsOptions';
import AttachQuestionsWarning from './AttachQuestionsWarning';
import embedQuestions from '../../../../actions/attachQuestions/embedQuestions';

class AttachQuestionsModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            activeItem: 'CurrentDeck', 
            activeTrap: false,
            selectedDeckId: -1,
            selectedQuestions:[],
            deckQuestions:[],
            showQuestions: false, 
            showOptions: false, 
            showWarning: false,

        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleAttachButton = this.handleAttachButton.bind(this);
        this.handleNextButton = this.handleNextButton.bind(this);
        this.handlePreviousDecksButton = this.handlePreviousDecksButton.bind(this);
        this.handleOptionsButton = this.handleOptionsButton.bind(this);
        this.handlePreviousQuestionsButton = this.handlePreviousQuestionsButton.bind(this);
        this.handleNextWarningButton = this.handleNextWarningButton.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            selectedDeckId: nextProps.AttachQuestionsModalStore.selectedDeckId,
            activeItem: nextProps.AttachQuestionsModalStore.activeItem,
            selectedQuestions: nextProps.AttachQuestionsModalStore.selectedQuestions,
            deckQuestions:nextProps.AttachQuestionsModalStore.deckQuestions,
            showQuestions: nextProps.AttachQuestionsModalStore.showQuestions,
            showOptions: nextProps.AttachQuestionsModalStore.showOptions,
            showWarning: nextProps.AttachQuestionsModalStore.showWarning,
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
            username:this.props.UserProfileStore.username,
            showQuestionCounts: true,
        }};
        this.context.executeAction(loadUserDecks, payload); //should this go into the mydecksclick?
        let payload2 = {params: {
            limit: 20,
            offset: 0,
            showQuestionCounts: true,
        }};
        this.context.executeAction(loadRecentDecks, payload2); //should this go into the slidewikiclick?
        let payload3  = {
            selectedDeckId: this.props.selector.id,
            selectedDeckTitle: this.getTitle(this.props.DeckTreeStore.deckTree, 'deck', this.props.selector.id)
        };
        this.context.executeAction(updateSelectedDeck,payload3);
        let selector = this.props.selector;
        this.context.executeAction(loadQuestions, {params:selector});
        $('#app').attr('aria-hidden','true');
        this.setState({
            modalOpen:true,
            activeTrap:true
        });
    }

    handleClose(){
        //console.log('handleClose');
        $('#app').attr('aria-hidden','false');
        this.setState({
            modalOpen:false,
            activeTrap: false,
            activeItem: 'CurrentDeck',
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
        this.setState({
            selectedQuestions:[]
        });
        this.context.executeAction(updateSelectedQuestions,{selectedQuestions:[]});
        let deckSelector = {id:this.state.selectedDeckId, stype:'deck', sid:this.state.selectedDeckId}; //not being set correctly by the mydecks/search?
        this.context.executeAction(loadQuestions,{params:deckSelector});
        this.setState({
            showQuestions:true
        });
        this.context.executeAction(updateShowQuestions,true);
        //console.log(this.state.showQuestions);
        /*nikki should this also update the selected question label somehow...? */

    }

    handleOptionsButton(){
        this.setState({
            showOptions:true
        });
        this.context.executeAction(updateShowOptions, true);
    }

    handlePreviousDecksButton(){
        this.setState({
            showQuestions:false
        });
        this.context.executeAction(updateSelectedQuestions,{selectedQuestions:[]},null);
        this.context.executeAction(updateShowQuestions, false);
    }

    handlePreviousQuestionsButton(){
        //console.log('previous questions button clicked');
        this.setState({
            showQuestions:true,
            showOptions:false
        });
        this.context.executeAction(updateShowQuestions, true);
        this.context.executeAction(updateShowOptions, false);
        //console.log(this.state.activeItem);
        //console.log(this.state.selectedQuestions);
    }


    handleNextWarningButton(){
        //console.log('nextwarning');
        this.setState({
            showOptions:false,
            showWarning:true,
        });
        this.context.executeAction(updateShowOptions, false);
        this.context.executeAction(updateShowWarning, true);
    }


    handleAttachButton(){
        let embedContent = {
            questions: this.props.AttachQuestionsModalStore.selectedQuestions,
            options: this.props.AttachQuestionsModalStore.embedOptions,
        }; 
        //console.log(embedContent);
        this.context.executeAction(embedQuestions, embedContent);
        this.handleClose();
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
            switch(param) {
                case 'handleAddQuestionsClick':
                    this.handleOpen();
                    break;
                case 'handleNextWarningClick':
                    this.handleNextWarningButton();
                    break;
                default: 
                    break;
            }
        }
    }
    

    render() {
        /* define the action buttons up here, then just call them. nextQuestions, nextOptions, attach, previousQuestions, previousDecks ?? provided the display conditions are the same.*/
        //action buttons
        let nextQuestionsBtn = <Button id="nextQuestions" color="green" icon tabIndex="0" type="button" aria-label="Next Select questions" data-tooltip="Next" disabled={this.state.selectedDeckId===-1} onClick={this.handleNextButton}>
            <Icon name="arrow right"/>
                Next
            <Icon name="arrow right"/>
        </Button>; //next button to take you to the question listing
        let nextOptionsBtn = <Button id="nextOptions" color="green" icon tabIndex="0" type="button" aria-label="Next Select options" data-tooltip="Next" disabled={this.state.selectedQuestions.length===0} onClick={this.handleOptionsButton}>
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
                Previous
            <Icon name="arrow left"/>
        </Button>; // previous button to take you back to the question listing
        let nextWarningBtn = <Button id="nextWarning" color="green" icon tabIndex="0" type="button" aria-label="Next Embed Warning" data-tooltip="Next" onClick={this.handleNextWarningButton} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleNextWarningClick')}>
            <Icon name="arrow right"/>
                Next
            <Icon name="arrow right"/>
        </Button>;
        let attachBtn = <Button id="embedQuestions" color="green" icon tabIndex="0" type="button" aria-label="Confirm Embed" data-tooltip="Embed questions in slide" disabled={this.state.selectedQuestions.length===0} onClick={this.handleAttachButton}>
            <Icon name="attach"/>
                Confirm Embed
            <Icon name="attach"/>
        </Button>;
        

        //From current deck content
        let currentDeckContent = <AttachCurrentDeck questionsCount={this.props.AttachQuestionsModalStore.deckQuestionsCount} currentDeckID={this.props.selector.id} actionButtonId={'#nextOptions'}/>; {/*nikki does this action button need changing? need to pass questions?*/}
        //From my Decks option content
        let myDecksContent = <AttachMyDecks destinationDeckId={this.props.selector.id} actionButtonId={'#nextQuestions'}/>;
        //From SlideWiki content
        let slideWikiContent = <AttachSlideWiki destinationDeckId={this.props.selector.id} actionButtonId={'#nextQuestions'}/>;
     
        let segmentPanelContent;
        let searchForm;
        let actionButton;
        let actionButton2;
        let attachMenu;
        let modalDescription;

        if(this.state.showOptions){
            attachMenu ='';
            searchForm ='';
            modalDescription= <TextArea className="sr-only" id="attachQuestionsDescription" value="Select the options for embedding the questions in the slide" tabIndex ='-1'/>;
            segmentPanelContent = <AttachQuestionsOptions selectedQuestions={this.state.selectedQuestions}/>;
            actionButton = previousQuestionsBtn;
            actionButton2 = nextWarningBtn;
            
        } else if (this.state.showWarning){
            attachMenu = '';
            searchForm = '';
            modalDescription= <TextArea className="sr-only" id="attachQuestionsDescription" value="Confirm you wish to overwrite the slide content." tabIndex ='-1'/>;
            segmentPanelContent = <AttachQuestionsWarning />;
            actionButton = attachBtn;
            actionButton2 = '';

        } else if(this.state.activeItem === 'CurrentDeck') {
            //Display current deck questions when current deck tab is selected
            attachMenu = <AttachMenu activeItem={this.state.activeItem} selector={this.props.selector}/>;
            modalDescription =  <TextArea className="sr-only" id="attachQuestionsDescription" value="You can add one or more questions from this deck to your slide." tabIndex ='-1'/>;

            searchForm = '';
            segmentPanelContent = currentDeckContent;
            actionButton = nextOptionsBtn;
            actionButton2='';

        } else if ((this.state.activeItem !== 'CurrentDeck') && (!this.state.showQuestions)){
            //Display my deck list or the search form to find a deck
            attachMenu = <AttachMenu activeItem={this.state.activeItem}  selector={this.props.selector}/>;
            modalDescription =  <TextArea className="sr-only" id="attachQuestionsDescription" value="You can add one or more questions from this deck or another deck to your slide. First select your deck containing the questions or search SlideWiki for a deck." tabIndex ='-1'/>;
            
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
                  <AttachSelectedDeck maxHeight='350px'/>
                 ); //params user={userInfo} deckQuestions={this.props.deckQuestions} selectedDeckId={this.props.currentDeckID} actionButtonId={this.props.actionButtonId} maxHeight='400px'
            }
            //segmentPanelContent = <AttachQuestionsList maxHeight='350px'/>; //how was this getting the questions? pulling them from the state?
            actionButton = previousDecksBtn;
            actionButton2 = nextOptionsBtn;

        } else {
            console.log('Error');
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
