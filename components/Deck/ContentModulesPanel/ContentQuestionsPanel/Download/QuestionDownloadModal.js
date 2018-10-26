import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Icon, Modal, Container, Segment, TextArea, Popup} from 'semantic-ui-react';
//import UserProfileStore from '../../../../../stores/UserProfileStore';
import ContentQuestionsStore from '../../../../../stores/ContentQuestionsStore';
import FocusTrap from 'focus-trap-react';
import {FormattedMessage, defineMessages} from 'react-intl';
import QuestionDownloadList from './QuestionDownloadList';
import updateDownloadQuestions from '../../../../../actions/questions/updateDownloadQuestions';

class QuestionDownloadModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            activeTrap: false,
            downloadQuestions:[],
            deckQuestions:[],
        };
    
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleDownloadButton = this.handleDownloadButton.bind(this);
    
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            downloadQuestions: nextProps.ContentQuestionsStore.downloadQuestions, //need to add to store
            deckQuestions:nextProps.ContentQuestionsStore.questions, //need to change name?
        });
    }

    componentWillUnmount(){
        this.context.executeAction(updateDownloadQuestions,[]); //set the selected questions to null
    }

    handleOpen(){
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
            downloadQuestions:[],
        });
        this.context.executeAction(updateDownloadQuestions,[]); //set selected questions to null
    }

    unmountTrap(){
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    handleDownloadButton(){
        let downloadQuestions = this.props.ContentQuestionsStore.downloadQuestions;

        let transformQuestions = downloadQuestions.map((node, index) => {
            return (
            {
                title: node.title,
                answers: node.answers,
                explanation: node.explanation,
                difficulty: node.difficulty,
            }
            );
        });
        let downloadContent = JSON.stringify(transformQuestions);

        let element = document.createElement('a');
        let file = new Blob([downloadContent], {type: 'text/string'});
        element.href = URL.createObjectURL(file);
        element.download = 'questions.json';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        this.handleClose();
    }

    handleKeyPress = (event, param) => {
        if(event.key === 'Enter'){
            switch(param) {
                case 'handleDownloadQuestionsClick':
                    this.handleOpen();
                    break;
                default: 
                    break;
            }
        }
    }

    handleSelectAll(){
        const allQuestions = Object.assign([], this.props.ContentQuestionsStore.questions);
        
        this.setState({
            downloadQuestions:allQuestions,
        });
        this.context.executeAction(updateDownloadQuestions,{downloadQuestions: allQuestions},null);
    }

    render() {
        let downloadBtn = <Button id="embedQuestions" color="green" icon tabIndex="0" type="button" aria-label="Download Questions" data-tooltip="Download Questions as JSON format" disabled={this.state.downloadQuestions.length===0} onClick={this.handleDownloadButton}>
            <Icon name="download"/>
                Download
            <Icon name="download"/>
        </Button>; //download button to actually download questions
        
        let modalDescription =  <TextArea className="sr-only" id="downloadQuestionsDescription" value="You can select one or more questions from this deck to download." tabIndex ='-1'/>;

        let segmentPanelContent = <QuestionDownloadList questions={this.props.ContentQuestionsStore.questions} handleSelectAll={() => this.handleSelectAll()}/>;
        let actionButton = downloadBtn;
        let actionButton2='';

        let downloadModalBtn = <a  className="ui right floated compact button primary" id="handleDownloadQuestionsModal" role="button" aria-hidden={this.state.modalOpen} onClick={this.handleOpen} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleDownloadQuestionsClick')} tabIndex='0'>
        <i className="small download icon"/>
        <FormattedMessage id='questionpanel.handleDownloadQuestionsClick' defaultMessage='Download questions' />
        </a>;

        return (
           <Modal trigger={downloadModalBtn}
                open={this.state.modalOpen}
                onClose={this.handleClose}
                role="dialog"
                id="downloadQuestionsModal"
                aria-labelledby="downloadModalHeader"
                aria-describedby="downloadQuestionsDescription"
                aria-hidden = {!this.state.modalOpen}
                tabIndex="0">
                                
                <Modal.Header className="ui center aligned" as="h1" id="downloadModalHeader">
                    Download questions
                </Modal.Header>
                
                <FocusTrap
                        id="focus-trap-downloadQuestionsModal"
                        focusTrapOptions={{
                            onDeactivate: this.unmountTrap,
                            clickOutsideDeactivates: true,
                            initialFocus: '#downloadModalHeader' //change?
                        }}
                        active={this.state.activeTrap}
                        >
                <Modal.Content>
                    <Container text>
                        <Segment color="blue" textAlign="center" padded>
                            <Segment attached="bottom" textAlign="left" role="tabpanel">
                               {modalDescription}
                               {segmentPanelContent}
                            </Segment>
                            <Modal.Actions>
                              {actionButton}
                              {actionButton2}
                              <Button id="cancelDownloadModal" color="red" tabIndex="0" type="button" aria-label="Cancel" data-tooltip="Cancel" onClick={this.handleClose} >
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

QuestionDownloadModal.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

QuestionDownloadModal = connectToStores(QuestionDownloadModal,[ContentQuestionsStore,],(context,props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState(),
    };
});

export default QuestionDownloadModal;
