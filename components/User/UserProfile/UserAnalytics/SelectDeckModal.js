import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Button, Icon, Modal, Container, Segment, TextArea, Popup } from 'semantic-ui-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore';
import FocusTrap from 'focus-trap-react';
import loadUserDecks  from '../../../../actions/attachSubdeck/loadUserDecks';
import loadRecentDecks  from '../../../../actions/attachSubdeck/loadRecentDecks';
import resetModalStore from '../../../../actions/attachSubdeck/resetModalStore';
import initModal from '../../../../actions/attachSubdeck/initModal';
import updateSelectedDeck from '../../../../actions/attachSubdeck/updateSelectedDeck';
import addPerformancePredictionJob from '../../../../actions/analytics/addPerformancePredictionJob';
import AttachMenu from '../../../Deck/ContentPanel/AttachSubdeck/AttachMenu';
import AttachMyDecks from '../../../Deck/ContentPanel/AttachSubdeck/AttachMyDecks';
import AttachSlideWiki from '../../../Deck/ContentPanel/AttachSubdeck/AttachSlideWiki';
import AttachSearchForm from '../../../Deck/ContentPanel/AttachSubdeck/AttachSearchForm';

class SelectDeckModal extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            activeItem: 'MyDecks',
            activeTrap: false,
          //  selectedDeckTitle: 'Select one deck...',
          //  showSearchResults: false
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleCLickNewPrediction = this.handleCLickNewPrediction.bind(this);
    }

    componentWillMount(){
        this.context.executeAction(resetModalStore,[]);
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

    handleCLickNewPrediction(e) {
        e.preventDefault();

        let deckId =  this.props.AttachSubdeckModalStore.selectedDeckId.split('-')[0];
        let deckTitle = this.props.AttachSubdeckModalStore.selectedDeckTitle;

        let userId = this.props.UserProfileStore.userid;
        let started = new Date();
        let prediction = {
            userId: userId,
            deckId: deckId,
            title: deckTitle,
            started: started,
            useDummyData: false
        };
        this.context.executeAction(addPerformancePredictionJob, {prediction: prediction});

        this.handleClose();
    }

    handleOpen(){

        //CHANGE THE STRING TO DISPLAY
        let payload3 = {
            selectedDeckId: -1,
            selectedDeckTitle: 'Select the deck'
        };
        this.context.executeAction(updateSelectedDeck,payload3,null);

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
          //  selectedDeckTitle: 'Select one deck...',
          //  showSearchResults: false
        });
        this.context.executeAction(initModal,[]);
    }

    unmountTrap(){
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    render() {

        //From my Decks option content
        let myDecksContent = <AttachMyDecks destinationDeckId={0} actionButtonId={'#attachAttachDeckModal'}/>;

        //From SlideWiki content
        let slideWikiContent = <AttachSlideWiki destinationDeckId={0} actionButtonId={'#attachAttachDeckModal'}/>;

        //Default Content
        let segmentPanelContent = myDecksContent;
        let searchForm = '';

        if (this.state.activeItem !== 'MyDecks') {
            searchForm = <AttachSearchForm />;
            segmentPanelContent = slideWikiContent;
        }

        let selectDeckBtn = <Popup trigger={
            <Button as="button" className="ui right floated labeled icon button"
                                                    type="button"
                                                    aria-label="New prediction job"
                                                    aria-hidden={this.state.modalOpen}
                                                    basic icon onClick={this.handleOpen}
                                                    tabIndex="0" >
                <i className="icon chart bar"/>
                New prediction job
            </Button>
        } content='Create a new prediction job' on='hover'/>;

        return (
            <Modal trigger={selectDeckBtn}
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
                        Select Deck
                    </Modal.Header>
                    <Modal.Content>
                        <Container text>
                            <Segment color="blue" textAlign="center" padded>
                                <AttachMenu activeItem={this.state.activeItem}/>
                                <Segment attached="bottom" textAlign="left" role="tabpanel">
                                    <TextArea className="sr-only" id="attachSubdeckModalDescription" value="Select deck to attach from your  My Decks list or search SlideWiki" tabIndex ='-1'/>
                                    {searchForm}
                                    {segmentPanelContent}
                                </Segment>
                                <Modal.Actions>
                                    <Button id="attachAttachDeckModal" color="green" icon tabIndex="0" type="button" aria-label="Create prediction job"
                                        data-tooltip="Create prediction job" disabled={this.state.selectedDeckId===-1} onClick={this.handleCLickNewPrediction}>
                                        <Icon name="chart bar"/>
                                        Create prediction job
                                    </Button>
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

SelectDeckModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

SelectDeckModal = connectToStores(SelectDeckModal,[UserProfileStore,AttachSubdeckModalStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        AttachSubdeckModalStore: context.getStore(AttachSubdeckModalStore).getState()
    };
});

export default SelectDeckModal;
