import React from 'react';
import FocusTrap from 'focus-trap-react';

import {connectToStores} from 'fluxible-addons-react';
import ISO6391 from 'iso-639-1';
import {navigateAction} from 'fluxible-router';

import SlideContentView from '../ContentPanel/SlideModes/SlideViewPanel/SlideContentView';


//import {  Dropdown, Button, Modal, Icon, Header, Divider} from 'semantic-ui-react';
import {Modal, Header, Icon, Button} from 'semantic-ui-react';
// import TranslationStore from '../../../stores/TranslationStore';
// import UserProfileStore from '../../../stores/UserProfileStore';


class SlidePreviewModal extends React.Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {language: null, error:false};
    // }

    // handleLanguageClick(id){
    //
    //     this.context.executeAction(navigateAction, {
    //         url: '/deck/'+ id
    //     });
    //     this.handleClose();
    // }

    handleClose(){
        //this.setState({language: null, error: false});
        this.props.handleClose();
    }


    // handleTranslateToClick(){
    //     //$(document).find('#deckViewPanel').prepend('<div className="ui active dimmer"><div className="ui text loader">Loading</div></div>');
    //     let code = this.state.language;
    //     if (code){
    //         this.context.executeAction(translateDeckRevision, {
    //             // TODO this is wrong, the second part for a lanugage code is the COUNTRY not the language, so for greek the el_EL is invalid
    //             language: code+'_'+code.toUpperCase()
    //         });
    //         this.handleClose();
    //     }else{
    //         this.setState({error: true});
    //     }
    // }
    //
    //
    // handleOptionChange(event, data) {
    //     this.setState({language: data.value, error: false});
    // }
    //
    // renderTranslateTo(supported) {
    //     return (
    //         {value:supported.code , key: supported.code, text: supported.name}
    //     );

    //<div dangerouslySetInnerHTML={{ __html: content }}></div>

    // }

    render() {
        let slide = this.props.slide;
        let modal = '';
        let content = '';
        let languageName = this.props.languageName;
        if (slide) {
            content = slide.revisions[0].content;
            modal = <Modal dimmer='blurring' size='small' role='dialog' aria-labelledby='translationModalHeader'
               aria-describedby='translationModalDesc' open={this.props.isOpen}
               onClose={this.props.handleClose}>
            <Header icon='translate' content={'Slide Preview: ' + languageName}  id='slidePreviewHeader'/>
            <Modal.Content id ='translation_preview'>
                    <SlideContentView content={content} container_id = 'translation_preview'/>
            </Modal.Content>
            <Modal.Actions>
                <Button as='button' onClick={this.handleClose.bind(this)}><Icon name='close'/> Close</Button>
            </Modal.Actions>
            </Modal>;
        };

        return (
            <div>
                {modal}
            </div>
        );
    }
}

SlidePreviewModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
// SlidePreviewModal = connectToStores(TranslationModal, [TranslationStore, UserProfileStore], (context, props) => {
//     return {
//         TranslationStore: context.getStore(TranslationStore).getState(),
//         UserProfileStore: context.getStore(UserProfileStore).getState()
//     };
// });

export default SlidePreviewModal;
