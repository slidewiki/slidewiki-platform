import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { Button, Modal, Card, Image, Input, Step, Accordion, Icon, Item  } from 'semantic-ui-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import DeckTreeStore from '../../../../stores/DeckTreeStore';
import FocusTrap from 'focus-trap-react';
import insertOerContent from '../../../../actions/slide/insertOerContent';
import axios from 'axios';
import {Microservices} from '../../../../configs/microservices.js'


class AttachOerModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            activeTrap: false,
            results: [],
            items: [],
            temp: true,
            activeIndex: 0,
            value: ''
        };
        
    }


    // Opening the modal
    handleOpen = () => {

        // App is hidden for screen readers when the modal is open
        $('#app').attr('aria-hidden', 'true');

        // Open the actual modal
        this.setState({
            modalOpen: true,
            activeTrap: true
        });
    }

    // Close the modal
    handleClose = () => {
        $('#app').attr('aria-hidden', 'false');

        this.setState({
            modalOpen: false,
            activeTrap: false,
        });
    }

    // Needed for accessibility (keep the focus inside the modal)
    unmountTrap = () => {
        if (this.state.activeTrap) {
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden', 'false');
        }
    }

    // Ensure that button also works with keyboard (for accessibility)
    handleKeyPress = (event, param) => {
        // On enter on button, open the modal
        if(event.key === 'Enter'){
            switch(param) {
                case 'handleAddOer':
                    this.handleOpen();
                    break;
                default: 
                    break;
            }
        }
    }
    
    searchOrtPortal = () => {
    	
	let self = this;

	axios.get(Microservices.oerPortal.uri + '?text=' +this.state.value)
	 .then(function (response) {
	   
//	   self.setState({
//		   items: response
//           });
//	  
		const items = [...response.data.rec_materials];

		self.setState({
			results: items
		});
	 })
	.catch(function (error) {
	   console.log(error);
	});
	
	

	console.log('test');

    }

    // This functions handles the clicked OER resource, the resource
    // id can be passed to find out what resources has been selected
    handleOerClick = (url, title) => {
    	
//    	$("#div1").remove();
    	
        console.log('Selected url', url);
        this.handleClose();
        // Add the OER content in the slide 
        this.context.executeAction(insertOerContent, {
            // Only use JSX as oerContent payload!
            oerContent:
                <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
        });
    };
    
    handleSearch = () => {
    	
    	
    	const items = [...this.state.items.data.rec_materials];

    	this.setState({
    		results: items
    	});
    }
    
    handleInputChange = (e, data) => {
    	
    	this.setState({
    		value: data.value
    	});
    }
    
    
    handleClick = (e, titleProps) => {
        let index  = titleProps
        const activeIndex  = this.state.activeIndex
        const newIndex = activeIndex === 0 ? -1 : 0

        this.setState({ activeIndex: newIndex })
      }

    render() {
    	const  activeIndex  = this.state.activeIndex
    	
        // The button that is being added in the slideEditLeftPanel
        let attachButton = (
            <a
                className='item'
                id='handleAddQuestionsModal'
                role='button'
                aria-hidden={this.state.modalOpen}
                onClick={this.handleOpen}
                onKeyPress={(evt) =>
                    this.handleKeyPress(evt, 'handleAddOer')
                }
                tabIndex={this.props.buttonStyle.noTabIndex ? -1 : 0}
            >
                <i className='content icon' /> Add OER
            </a>
        );

        
       
        return (
        		
		
            <FocusTrap
                id='focus-trap-attach-oer'
                focusTrapOptions={{
                    onDeactivate: this.unmountTrap,
                    clickOutsideDeactivates: true,
                    initialFocus: '#cancelAttachOer'
                }}
                active={this.state.activeTrap}
            >
                <Modal
                    trigger={attachButton}
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    role='dialog'
                    id='attachOerModal'
                    aria-labelledby='attachOerHeader'
                    aria-hidden={!this.state.modalOpen}
                    tabIndex='0'
                    //size="large" // Enable the change the size of the modal
                >
                    <Modal.Header as='h1' id='attachOerHeader'>
                        Select Open Educational Resources
                    </Modal.Header>

                    <Modal.Content>
                    	<Input value={this.state.value} icon='search' placeholder='Search...' onChange={this.handleInputChange} />   <Button basic color='blue' onClick={this.searchOrtPortal}>Search</Button>
                    	
                    	<Item.Group>
                        <Item>
                          
                        
                        <Image src='/assets/images/logo.png' size='small' />
                          <Item.Content>
                            <Item.Header href='https://edu-sharing.com/Demo/'>Ein Portal für Lehrende an niedersächsischen Hochschulen</Item.Header>
                            <Item.Meta>Description</Item.Meta>
                            <Item.Description>
                            Offene Bildungsmaterialien – "Open Educational Resources" (OER) – stehen unter einer offenen Lizenz
                            </Item.Description>
                            <Item.Extra>Additional Details</Item.Extra>
                          </Item.Content>
                        </Item>

                      </Item.Group>
                    	 
                    	<Card.Group>
                        
                    	{this.state.results.map((result) => 
                            <Card>
                                <Image
                                    src='http://oer01.develop.service.tib.eu/edu-sharing/preview?nodeId=918560f5-e51c-4037-ab50-300fdc681b0c&storeProtocol=workspace&storeId=SpacesStore&dontcache=1571937712960'
                                    wrapped
                                    ui={false}
                                />
                                <Card.Content>
                                    <Card.Header>OER file</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>
                                           

                                        </span>
                                    </Card.Meta>
                                    <Card.Description>
                                    <Accordion styled>
                                    <Accordion.Title
                                      active={activeIndex === 0}
                                      index={0}
                                      onClick={this.handleClick}
                                    >
                                      <Icon name='dropdown' />
                                      {result.title}
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === -1}>
                                      <p>
                                      {result.description}
                                      </p>
                                    </Accordion.Content>
                                  </Accordion>
                                        
                                    </Card.Description>
                                        
                                        
                                        
                                </Card.Content>
                                <Card.Content extra>
                                <div className='ui two buttons' onClick={() => this.handleOerClick(result.url, result.title)}>
                                  <Button basic color='green'>
                                    Add Material
                                  </Button>
                                </div>
                              </Card.Content>
                            </Card>
                    	)}
                    </Card.Group>
         
                </Modal.Content>
                   
               			 
               		   
                    <Modal.Actions>
                        <Button
                            id='cancelAttachOer'
                            color='red'
                            tabIndex='0'
                            type='button'
                            aria-label='Cancel'
                            data-tooltip='Cancel'
                            onClick={this.handleClose}
                        >
                            Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </FocusTrap>
        );
    }
    
}

AttachOerModal.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

export default AttachOerModal;
