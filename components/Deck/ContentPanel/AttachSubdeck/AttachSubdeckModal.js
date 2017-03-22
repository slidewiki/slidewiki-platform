import React from 'react';
import ReactDOM from 'react-dom';
import { connectToStores } from 'fluxible-addons-react';
import { Button, Icon, Modal, Container, Segment, Menu,Label,Input,Divider} from 'semantic-ui-react';
import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore';
import FocusTrap from 'focus-trap-react';
import closeAttachModal from '../../../../actions/attachSubDeck/closeAttachModal';


const headerStyle = {
    'textAlign': 'center'
};
const modalStyle = {
    top: '15%'
};

class AttachSubdeckModal extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.AttachSubdeckModalStore.activeItem,
            activeTrap: this.props.AttachSubdeckModalStore.activeTrap
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleMyDecksClick = this.handleMyDecksClick.bind(this);
        this.handleSlideWikiClick = this.handleSlideWikiClick.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);


    }


    componentWillReceiveProps(nextProps){

        if (nextProps.AttachSubdeckModalStore.activeTrap !== this.props.AttachSubdeckModalStore.activeTrap){
            this.setState({
                activeTrap: nextProps.AttachSubdeckModalStore.activeTrap
            });
        }

    }

    handleClose(){
        this.context.executeAction(closeAttachModal);

        $('#app').attr('aria-hidden','false');
        $('#attachSubDeckModal').attr('aria-hidden','true');
        $('#attachSubDeckModal').modal('hide');

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
        }
    }




    render() {
        //Selected Deck addTreeNodeAndNavigate
        let selectedDeckArea = <div className="ui segment left aligned" >
                                  <Label htmlFor="selectedDeckTitleId" as="label" basic color="blue" pointing="right">Selected Deck</Label>
                                  <Input type="text" id="selectedDeckTitleId" placeholder="You should select one deck.." tabIndex="0" />
                              </div>;
        //From my Decks option content
        let myDecksContent = <div className="ui segment attached">
                                  <img src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                             </div>;

        //From SlideWiki content
        let slideWikiContent =<div className="ui segment attached">
                                <img src="http://semantic-ui.com/images/wireframe/media-paragraph.png"/>
                              </div>;

        //Default Content
        let segmentPanelContent = myDecksContent;

        if (this.state.activeItem === 'MyDecks'){
            segmentPanelContent = myDecksContent;

        }else{
            segmentPanelContent = slideWikiContent;
        }

        return (


                <div className="ui modal" id='attachSubDeckModal' style={modalStyle}
                    role="dialog"
                    aria-labelledby="attachSubdeckHeader"
                    aria-hidden = "false">
                    <FocusTrap
                          id='focus-trap-attachSubdeckModal'
                          className = "header"
                          active={this.state.activeTrap}
                          focusTrapOptions={{
                              onDeactivate: this.unmountTrap,
                              clickOutsideDeactivates: true,
                              initialFocus: '#tabMyDecksId',
                          }}>
                  <div className="header">
                        <h1 style={headerStyle} id="attachSubdeckHeader">Attach Deck</h1>
                    </div>
                    <div className="content">
                      <div className="ui container">
                        <div className="ui blue padded center aligned segment">
                            <div className="ui segment top atttached">
                                <div className="ui top attached tabular menu" role="tablist">
                                    <button id='tabMyDecksId' className={(this.state.activeItem === 'MyDecks')?'active item':'item'}
                                        aria-selected={this.state.activeItem === 'MyDecks'}
                                        onClick={this.handleMyDecksClick} role="tab" tabIndex="0">
                                    From My Decks
                                    </button>
                                    <button id='tabFromSlideWikiId' className={(this.state.activeItem === 'SlideWiki')?'active item':'item'}
                                        aria-selected={this.state.activeItem === 'SlideWiki'}
                                        onClick={this.handleSlideWikiClick} role="tab" tabIndex="0">
                                        From SlideWiki
                                    </button>
                                </div>

                            {segmentPanelContent}
                            {selectedDeckArea}
                            <div className='actions'>
                                <button id='attachAttachDeckModal' className="ui green button" icon tabIndex="0" type="button" aria-label="Attach" data-tooltip="Attach">
                                    <i className="attach icon"/>
                                    Attach
                                    <i className="attach icon"/>
                                </button>
                                <button className='ui red button'  tabIndex="0" type="button" aria-label="Cancel" data-tooltip="Cancel" onClick={this.handleClose} >
                                Cancel
                                </button>
                            </div>
                            </div>
                        </div>
                     </div>
                    </div>

                      </FocusTrap>
                </div>

        );
    }

}

AttachSubdeckModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

AttachSubdeckModal = connectToStores(AttachSubdeckModal,[AttachSubdeckModalStore],(context,props) => {
    return {
        AttachSubdeckModalStore: context.getStore(AttachSubdeckModalStore).getState()
    };
});


export default AttachSubdeckModal;
