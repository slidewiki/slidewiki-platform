import PropTypes from 'prop-types';
import React from 'react';
import {Button, Icon, Modal, Header, Form, Dropdown, Segment, TextArea} from 'semantic-ui-react';
import { navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ImportStore from '../../stores/ImportStore';
import FocusTrap from 'focus-trap-react';
import importFinished from '../../actions/import/importFinished';
import {FormattedMessage, defineMessages} from 'react-intl';
import { Microservices } from '../../configs/microservices';
import publishDeck from '../../actions/addDeck/publishDeck';
import waitForThumbnails from '../../actions/addDeck/waitForThumbnails';

class ImportPreviewModal extends React.Component {
    handleReject(){
        this.props.handleClose();
    }
    
    handleSuccess(){
        let checkboxPublish = $('#checkbox_publish')[0].checked;
        if (checkboxPublish) {
            //Publish the deck (set hidden to false)
            let deckId = this.props.ImportStore.deckId;
            let selector = {
                id: deckId
            };
    
            this.context.executeAction(publishDeck, {
                deckId: deckId,
                title: this.props.ImportStore.title,
                language: this.props.ImportStore.language,
                description: this.props.ImportStore.description,
                theme: this.props.ImportStore.theme,
                license: this.props.ImportStore.license,
                selector: selector,
                hidden: false,
            });
        }
        this.handleImportRedirect();
    }
    handleImportRedirect(){
        this.context.executeAction(importFinished, {});  // destroy import components state
        this.context.executeAction(navigateAction, {
            url: '/deck/' + this.props.ImportStore.deckId
        });
    }
    

    render() {
        if (this.props.ImportStore.uploadProgress !== 100 || this.props.ImportStore.deckId === null) {
            return null;
        } else {
            const success_messages = defineMessages({
                success_title_text:{
                    id: 'AddDeck.swal.success_title_text',
                    defaultMessage: 'Deck created!',
                },
                success_text:{
                    id: 'AddDeck.swal.success_text',
                    defaultMessage: 'The selected file has been imported and a new deck has been created.',
                },
                preview_text:{
                    id: 'AddDeck.swal.preview_text',
                    defaultMessage: 'Here is a preview of your slides. It may take a few seconds for the images to be created. You can use the tab key to move through the images.',
                },
                success_text_extra:{
                    id: 'AddDeck.swal.success_text_extra',
                    defaultMessage: 'This new deck will not be visible to others in your decks page or in search results until published.',
                },
                success_confirm_text:{
                    id: 'AddDeck.swal.success_confirm_text',
                    defaultMessage: 'Complete import',
                },
                success_reject_text:{
                    id: 'AddDeck.swal.success_reject_text',
                    defaultMessage: 'Try again',
                },
                success_imported_slides_text:{
                    id: 'AddDeck.swal.success_imported_slides_text',
                    defaultMessage: 'Imported slides:',
                },
                success_publish_deck_text:{
                    id: 'AddDeck.swal.success_publish_deck_text',
                    defaultMessage: 'Publish your deck for it to show in search results immediately (publishing occurs after a few seconds)',
                }
            });







            let slides = this.props.ImportStore.slides;
            slides.forEach((slide) => {
                if ((slide.thumbnail === undefined) && (!slide.noOfThumbnailAttempts || slide.noOfThumbnailAttempts < 10)) {
                    console.log('~~~~~~~~~~~~~~~~~~~ ', slide.id, slide.noOfThumbnailAttempts);
                    slide.thumbnail = null;// ongoing request
                    setTimeout( () => {
                        this.context.executeAction(waitForThumbnails, {slide: slide, theme: this.props.ImportStore.theme});
                    }, 100);
                    
                }
            });
            
            let imgStyle = {'border':'1px solid black', 'borderRadius':'5px', 'marginLeft':'auto', 'marginRight':'auto', 'display':'block', 'width':'100%'};
            const thumbnails = slides.map((slide, index) => {
                let thumbnailAlt = 'Slide ' + (index + 1) + ': ';
                if (slide.title !== undefined)
                    thumbnailAlt += slide.title ;
                let thumbnailSrc = (slide.thumbnail) ? 'data:image/png;base64,' + slide.thumbnail : '';
                let imgTitle = 'Title: ' + slide.title;
                return (
                    <td key={index} style={{'padding':' 15px'}}><div style={{'width': '250px'}} tabIndex='0'>
                        Slide {index+1} <img title={imgTitle} style={imgStyle} src={thumbnailSrc} alt={thumbnailAlt} aria-hidden='true' />
                    </div></td>
                );
                
            });
            // for(let i = 0; i < slides.length; i++) {
            //     let slide = slides[i];
            //     let thumbnailAlt = 'Slide ' + (i+1) + ': ';
            //     if (slide.title !== undefined)
            //         thumbnailAlt += slide.title ;
            //     // let thumbnailSrc = Microservices.file.uri + '/thumbnail/slide/' + slide.id + '/' + (this.props.ImportStore.theme ? this.props.ImportStore.theme : 'default');
            //     thumbnails += '<td style="padding: 15px;"><div style="width: 250px;" tabIndex="0">' +
            //         'Slide ' + (i+1) + '<img title="Title: ' + slide.title + '" style=' + imgStyle + ' src="data:image/png;base64,' + slide.thumbnail + '" alt="' + thumbnailAlt + '" aria-hidden="true" />' +
            //         '</div></td>'; //THUMBNAIL
            // }
            // let borderStyle = 'border:1px solid black;border-radius:5px;';
            //let html = this.context.intl.formatMessage(success_messages.success_text) + ' ' + this.context.intl.formatMessage(success_messages.preview_text) + '<br><br>' +
            let content = 
                <div>
                    <div style={{'height': '260px', 'overflow': 'auto', 'textAlign': 'center'}} >
                        <table><tbody><tr>
                            {thumbnails}
                        </tr></tbody></table>
                    </div>
                    <h3><div className="ui checkbox label" ><input type="checkbox" tabIndex="0" id="checkbox_publish" ref="checkbox_publish" /><label htmlFor="checkbox_publish">  {this.context.intl.formatMessage(success_messages.success_publish_deck_text)} </label></div></h3>
                </div>;

            // swal({
            //     title: this.context.intl.formatMessage(success_messages.success_title_text),
            //     text: this.context.intl.formatMessage(success_messages.success_text) +
            //         '\n' + this.context.intl.formatMessage(success_messages.success_text_extra),
            //     html: html,
            //     type: 'success',
            //     showCloseButton: true,
            //     showCancelButton: true,
            //     confirmButtonText: this.context.intl.formatMessage(success_messages.success_confirm_text),
            //     confirmButtonClass: 'positive ui button',
            //     cancelButtonText: this.context.intl.formatMessage(success_messages.success_reject_text),
            //     cancelButtonClass: 'ui red button',
            //     buttonsStyling: false
            // }).then((accepted) => {
            //     let checkboxPublish = $('#checkbox_publish')[0].checked;
            //     if (checkboxPublish) {
            //         //Publish the deck (set hidden to false)
            //         let deckId = this.props.ImportStore.deckId;
            //         let selector = {
            //             id: deckId
            //         };
            // 
            //         this.context.executeAction(publishDeck, {
            //             deckId: deckId,
            //             title: this.props.ImportStore.title,
            //             language: this.props.ImportStore.language,
            //             description: this.props.ImportStore.description,
            //             theme: this.props.ImportStore.theme,
            //             license: this.props.ImportStore.license,
            //             selector: selector,
            //             hidden: false,
            //         });
            //     }
            //     this.handleImportRedirect();
            // 
            //     return true;
            // }, (reason) => {
                                                      //     //Reset form
                                                      //     this.context.executeAction(importCanceled, {});  // destroy import components state
                                                      //     this.context.executeAction(addDeckDestruct, {});
                                                      //     this.initializeProgressBar();
                                                      //     this.refs.checkbox_conditions.checked = false;
                                                      //     this.refs.checkbox_imageslicense.checked = false;
            // }).catch(() => {
            //     return true;
            // });
          
          
              
          
          
          
          
          
          
            return (
                <Modal
                    id="ImportPreviewModal"
                    dimmer='blurring'
                    role='dialog'
                    aria-labelledby='importPreviewModalHeader'
                    aria-describedby='importPreviewDescription'
                    aria-hidden = {!this.props.isOpen}
                    size= 'small'
                    tabIndex="0"
                    open={this.props.isOpen}
                    onClose={this.props.handleClose}>
                    <FocusTrap focusTrapOptions={{clickOutsideDeactivates: false}} active={this.props.isOpen} className="dialog">
                        <Modal.Header className="ui center aligned" as="h1" id="importPreviewModalHeader">
                            <br/>
                            <div>
                                <i className="icon green check circle large outline" />
                                {this.context.intl.formatMessage(success_messages.success_title_text)}
                            </div>
                        </Modal.Header>
                        <Modal.Header className="ui center aligned segment" as="h3" id="importPreviewModalHeader2">
                            <br/>
                            <div>
                              {this.context.intl.formatMessage(success_messages.success_text) +
                                  '\n' + this.context.intl.formatMessage(success_messages.success_text_extra)}
                            </div>
                        </Modal.Header>
                        <Modal.Header className="ui center aligned " as="h4" id="importPreviewModalHeader3">
                            <br/>
                            <div>
                              {this.context.intl.formatMessage(success_messages.preview_text)}
                            </div>
                        </Modal.Header>
                        <Modal.Content>
                            
                            {content}
                            
                        </Modal.Content>
                        <TextArea className="sr-only" id="importPreviewDescription" value={this.context.intl.formatMessage(success_messages.success_title_text)} tabIndex ='-1'/>
                        <Modal.Actions>
                            <Segment basic textAlign="center">
                                <div>
                                    <Button as='button' className="ui blue labeled submit icon button" onClick={this.handleSuccess.bind(this)} tabIndex='1'><Icon name='check'/>{this.context.intl.formatMessage(success_messages.success_confirm_text)}</Button>
                                    <Button as='button' className="ui red labeled icon button" onClick={this.handleReject.bind(this)} tabIndex='1'><Icon name='minus circle'/>{this.context.intl.formatMessage(success_messages.success_reject_text)}</Button>
                                </div>
                            </Segment>
                        </Modal.Actions>
                    </FocusTrap>
                </Modal>
            );
        }
    }
}

ImportPreviewModal.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

ImportPreviewModal = connectToStores(ImportPreviewModal, [ImportStore], (context, props) => {
    return {
        ImportStore: context.getStore(ImportStore).getState()
    };
});

export default ImportPreviewModal;
