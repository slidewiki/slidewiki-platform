import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Button, Icon, Modal, Container, Segment, TextArea, Popup } from 'semantic-ui-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore';
import DeckTreeStore from '../../../../stores/DeckTreeStore';
import FocusTrap from 'focus-trap-react';
import loadUserDecks  from '../../../../actions/attachSubdeck/loadUserDecks';
import loadRecentDecks  from '../../../../actions/attachSubdeck/loadRecentDecks';
import resetModalStore from '../../../../actions/attachSubdeck/resetModalStore';
import initModal from '../../../../actions/attachSubdeck/initModal';
import addTreeNodeAndNavigate from '../../../../actions/decktree/addTreeNodeAndNavigate';
import addActivity from '../../../../actions/activityfeed/addActivity';
import AttachDeckList from './AttachDeckList';
import AttachMenu from './AttachMenu';
import AttachMyDecks from './AttachMyDecks';
import AttachSlideWiki from './AttachSlideWiki';
import AttachSearchForm from './AttachSearchForm';
import {FormattedMessage, defineMessages} from 'react-intl';



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
          //  selectedDeckTitle: 'Select one deck...',
          //  showSearchResults: false
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleAttachButton = this.handleAttachButton.bind(this);

        this.messages = defineMessages({
            attachText:{
                id: 'attachSubdeckModal.attachText',
                defaultMessage: 'Attach Sub-deck'
            },
            attach:{
                id: 'attachSubdeckModal.attach',
                defaultMessage: 'Attach'
            },
            next:{
                id: 'attachSubdeckModal.next',
                defaultMessage: 'Next'
            },
            previous:{
                id: 'attachSubdeckModal.previous',
                defaultMessage: 'Previous'
            },
            cancel:{
                id: 'attachSubdeckModal.cancel',
                defaultMessage: 'Cancel'    
            }

        });

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


    handleAttachButton() {
        //selector: Object {id: "56", stype: "deck", sid: 67, spath: "67:2"}
        //nodeSec: Object {type: "deck", id: 1245-2}
        this.context.executeAction(addTreeNodeAndNavigate, {selector: this.props.selector, nodeSpec: {type:'deck',id:this.state.selectedDeckId}, attach: true});

        //find target deck id
        let targetDeckId = this.props.selector.sid;
        if (this.props.selector.stype === 'slide') {
            const pathArray = this.props.selector.spath.split(';');
            if (pathArray.length > 1) {
                const parentDeck = pathArray[pathArray.length - 2];
                targetDeckId = parentDeck.split(':')[0];
            } else {
                targetDeckId = this.props.selector.id;
            }
        }

        let activity = {
            activity_type: 'use',
            user_id: String(this.props.UserProfileStore.userid),
            content_id: this.state.selectedDeckId,
            content_kind: 'deck',
            use_info: {
                target_id:  targetDeckId,
                target_name: this.getTitle(this.props.DeckTreeStore.deckTree, 'deck', targetDeckId)
            }
        };

        this.context.executeAction(addActivity, {activity: activity});

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

    render() {




        //From my Decks option content
        let myDecksContent = <AttachMyDecks destinationDeckId={this.props.selector.id} actionButtonId={'#attachAttachDeckModal'}/>;

        //From SlideWiki content
        let slideWikiContent = <AttachSlideWiki destinationDeckId={this.props.selector.id} actionButtonId={'#attachAttachDeckModal'}/>;

        //Default Content
        let segmentPanelContent = myDecksContent;
        let searchForm='';

        if (this.state.activeItem === 'MyDecks'){
            searchForm ='';
            segmentPanelContent = myDecksContent;

        }else{
            searchForm =  <AttachSearchForm />;
            segmentPanelContent = slideWikiContent;


        }

        let attachDeckBtn = <Popup trigger={<Button as="button" className={this.props.buttonStyle.classNames}
                                                    type="button"
                                                    aria-label={this.context.intl.formatMessage(this.messages.attachText)}
                                                    aria-hidden={this.state.modalOpen}
                                                    basic onClick={this.handleOpen}
                                                    tabIndex={this.props.buttonStyle.noTabIndex?-1:0} >
            <Icon.Group size={this.props.buttonStyle.iconSize}>
                <Icon className="yellow" name="folder" />
                <Icon className="corner" name="attach" />
            </Icon.Group>
        </Button>} content={this.context.intl.formatMessage(this.messages.attachText)} on='hover'/>;

        return (
           <Modal trigger={attachDeckBtn}
                open={this.state.modalOpen}
                onClose={this.handleClose}
                role="dialog"
                id="attachSubDeckModal"
                aria-labelledby="attachSubdeckHeader"
                aria-describedby="attachSubdeckModalDescriptionSR"
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
                    {this.context.intl.formatMessage(this.messages.attachText)}
                </Modal.Header>
                <Modal.Content>
                    <Container text>
                         <FormattedMessage id='subDeckModal.attachSubdeckModalDescription' defaultMessage='Select a deck to attach from your My Decks list or search SlideWiki. We recommend that decks have a maximum of 50 slides per (sub)deck for optimum performance when viewing your presentation. If you wish to collate lots of decks then we recommend creating a playlist.'  tabIndex ='-1' />
                         <TextArea className="sr-only" id="attachSubdeckModalDescriptionSR" value="Select a deck to attach from your My Decks list or search SlideWiki. We recommend that decks have a maximum of 50 slides per (sub)deck for optimum performance when viewing your presentation. If you wish to collate lots of decks then we recommend creating a playlist." tabIndex ='-1'/>
                         <Segment color="blue" textAlign="center" padded>
                            <AttachMenu activeItem={this.state.activeItem}/>
                            <Segment attached="bottom" textAlign="left" role="tabpanel">
                               {searchForm}
                               {segmentPanelContent}
                            </Segment>
                            <Modal.Actions>
                              <Button id="attachAttachDeckModal" color="green" icon tabIndex="0" type="button" aria-label={this.context.intl.formatMessage(this.messages.attach)}
                                  data-tooltip={this.context.intl.formatMessage(this.messages.attach)} disabled={this.state.selectedDeckId===-1} onClick={this.handleAttachButton}>
                                <Icon name="attach"/>
                                    {this.context.intl.formatMessage(this.messages.attach)}
                                <Icon name="attach"/>
                              </Button>
                              <Button id="cancelAttachModal" color="red" tabIndex="0" type="button" aria-label={this.context.intl.formatMessage(this.messages.cancel)} data-tooltip={this.context.intl.formatMessage(this.messages.cancel)} onClick={this.handleClose} >
                              {this.context.intl.formatMessage(this.messages.cancel)}
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
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

AttachSubdeckModal = connectToStores(AttachSubdeckModal,[UserProfileStore,AttachSubdeckModalStore,DeckTreeStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        AttachSubdeckModalStore: context.getStore(AttachSubdeckModalStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});

export default AttachSubdeckModal;
