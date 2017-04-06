import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import { Button, Icon, Modal, Container, Segment, Menu,Label,Input,Divider, TextArea, Image,Dimmer, Header,Form} from 'semantic-ui-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore';
import FocusTrap from 'focus-trap-react';
import loadUserDecks  from '../../../../actions/attachSubdeck/loadUserDecks';
import loadRecentDecks  from '../../../../actions/attachSubdeck/loadRecentDecks';
import loadSearchedDecks from '../../../../actions/attachSubdeck/loadSearchedDecks';
import addTreeNodeAndNavigate from '../../../../actions/decktree/addTreeNodeAndNavigate';
import AttachDeckList from './AttachDeckList';
import KeywordsInput from '../../../Search/AutocompleteComponents/KeywordsInput';
import UsersInput from '../../../Search/AutocompleteComponents/UsersInput';




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
            searchDecks:[],
            selectedDeckTitle: 'Select one deck...',
            showSearchResults: false
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleMyDecksClick = this.handleMyDecksClick.bind(this);
        this.handleSlideWikiClick = this.handleSlideWikiClick.bind(this);
        this.handleAttachButton = this.handleAttachButton.bind(this);

    }

    componentWillReceiveProps(nextProps){

        this.setState({
            userDecks: nextProps.AttachSubdeckModalStore.userDecks,
            recentDecks: nextProps.AttachSubdeckModalStore.recentDecks,
            selectedDeckId: nextProps.AttachSubdeckModalStore.selectedDeckId,
            selectedDeckTitle:nextProps.AttachSubdeckModalStore.selectedDeckTitle,
            searchDecks: nextProps.AttachSubdeckModalStore.searchDecks,
            showSearchResults: nextProps.AttachSubdeckModalStore.showSearchResults
        });

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

                                <AttachDeckList user={userInfo} decks={this.state.userDecks} selectedDeckId={this.state.selectedDeckId} maxHeight='400px'/>
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
            let slides_to_show;
            let fromDecksTitle;
            if(!this.state.showSearchResults){
                slides_to_show=this.state.recentDecks;
                fromDecksTitle='Recent decks';
            } else {
                slides_to_show=this.state.searchDecks;
                fromDecksTitle=slides_to_show.length>0 ? 'Found decks' : 'No results found';
            }
            slideWikiContent =  <Segment id="panelMyDecksContent">
                                  <Header as="h3">{this.state.fromDecksTitle}</Header>
                                  <Label htmlFor="selectedDeckTitleId" as="label"  color="blue" pointing="right">Selected Deck</Label>
                                  <Label  id="selectedDeckTitleId" content={this.state.selectedDeckTitle} basic color="blue"/>
                                  <AttachDeckList user={userInfo} decks={slides_to_show} selectedDeckId={this.state.selectedDeckId} maxHeight='320px'/>
                                </Segment>;
        }

        return slideWikiContent;

    }
    onSelect(searchstring){
        this.setState({keywords: searchstring});
        this.handleRedirect();
    }
    // onChange(event) {
    //
    //     let curstate = {};
    //     curstate[event.target.name] = event.target.value;
    //     this.setState(curstate);
    // }
    clearInput(){
        this.setState({searchstring: ''});
        this.refs.keywords.focus();
    }
    getEncodedParams(params){
        let queryparams = {
            keywords: (params && params.keywords)
                        ? params.keywords       // if keywords are set from redirection
                        : (this.refs.keywords.getSelected().trim() || '*:*'),   //else get keywords from input, and if empty set wildcard to fetch all
            field: this.refs.field.value.trim(),
            kind: 'deck',
            language: this.refs.language.value.trim(),
            license: this.refs.license.value.trim(),
            user: this.refs.user.getSelected().split(','),
            // tag: this.refs.tag.value.trim(),
            sort: (params && params.sort) ? params.sort : ''
        };

        // encode params
        let encodedParams = '';
        for(let key in queryparams){
            if(queryparams[key] instanceof Array){
                for(let el in queryparams[key]){
                    encodedParams += this.encodeParam(encodedParams, key, queryparams[key][el]);
                }
            }
            else{
                encodedParams += this.encodeParam(encodedParams, key, queryparams[key]);
            }
        }

        return encodedParams;
    }
    encodeParam(encodedParams, key, value){
        if(value.trim() === '')
            return '';

        return ((encodedParams) ? '&' : '')
                + encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
    handleKeyPress(event){

        if(event.key === 'Enter'){
            this.handleRedirect(event);
        }

    }
    handleRedirect(event, params){
        if(event){
            event.preventDefault();
        }

        this.setState({
            fromDecksTitle:'Search results'
        });

        this.context.executeAction(loadSearchedDecks, {
            params: {
                queryparams: this.getEncodedParams(params)
            }
        });

        return false;

    }
    loadSearchForm(){
        let searchForm = '';
        if (this.state.activeItem === 'SlideWiki'){

            searchForm = <Segment className='advancedSearch'>
                            <Header as="h3">Search for decks</Header>
                            <Form success>
                              <Form.Group>

                                <Form.Field width="11" >
                                  <label htmlFor="SearchTerm"  className="sr-only">Search Term</label>
                                  <KeywordsInput ref='keywords' onSelect={this.onSelect.bind(this)} placeholder='Type your keywords here' onKeyPress={this.handleKeyPress.bind(this)}/>
                                </Form.Field>
                                <Form.Field>
                                 <label htmlFor="field" className="sr-only">Search field</label>
                                 <select name='field' id='field' multiple='' className='ui fluid search dropdown' ref='field'>
                                   <option value=' '>Select Search field</option>
                                   <option value='title'>Title</option>
                                   <option value='description'>Description</option>
                                   <option value='content'>Content</option>
                                   <option value='speakernotes'>Speakernotes</option>
                                 </select>
                                </Form.Field>
                              </Form.Group>
                              <Form.Group widths="equal" >
                                <div className="field">
                                  <label htmlFor="users_input_field"  className="sr-only">User</label>
                                  <UsersInput ref='user' placeholder='Select Users' />
                                </div>

                                <Form.Field>
                                <label htmlFor="language" className="sr-only">Language</label>
                                <select name='language' multiple='' id='language' className='ui fluid search dropdown' ref='language'>
                                  <option value=' '>Select Language</option>
                                  <option value='en_GB'>English</option>
                                  <option value='de_DE'>German</option>
                                  <option value='el_GR'>Greek</option>
                                  <option value='it_IT'>Italian</option>
                                  <option value='pt_PT'>Portuguese</option>
                                  <option value='sr_RS'>Serbian</option>
                                  <option value='es_ES'>Spanish</option>
                                </select>
                                </Form.Field>
                                <Form.Field>
                                  <label htmlFor="license" className="sr-only">License</label>
                                  <select name='license' id='license' multiple='' className='ui fluid search dropdown' ref='license'>
                                  <option value=' '>Select Licence</option>
                                  <option value='CC0'>CC0</option>
                                  <option value='CC BY'>CC BY</option>
                                  <option value='CC BY-SA'>CC BY-SA</option>
                                </select>
                                </Form.Field>
                              </Form.Group>
                              <Button  color="blue" icon tabIndex="0" role="button" type="submit" aria-label="Search for Decks"
                                  data-tooltip="Search for Decks" onClick={this.handleRedirect.bind(this)}>
                                <Icon name="search"/>
                                  Search
                              </Button>
                            </Form>

                         </Segment>;
        }


        return searchForm;
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
        let searchForm = this.loadSearchForm();
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
                      type="button" aria-label="Attach Deck" data-tooltip="Attach Deck" aria-hidden={this.state.modalOpen}
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
                               {searchForm}
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
