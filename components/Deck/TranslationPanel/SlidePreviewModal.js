import React from 'react';
import FocusTrap from 'focus-trap-react';

import {connectToStores} from 'fluxible-addons-react';
import ISO6391 from 'iso-639-1';
import {navigateAction} from 'fluxible-router';


//import {  Dropdown, Button, Modal, Icon, Header, Divider} from 'semantic-ui-react';
import {Modal, Header} from 'semantic-ui-react';
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
    // }

    render() {
        let slide = this.props.slide;
        let modal = '';
        let content = '';
        if (slide) {
            content = slide.revisions[0].content;
            modal = <Modal dimmer='blurring' size='small' role='dialog' aria-labelledby='translationModalHeader'
               aria-describedby='translationModalDesc' open={this.props.isOpen}
               onClose={this.props.handleClose}>
            <Header icon='translate' content='Slide Preview' id='slidePreviewHeader'/>
            <Modal.Content>
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </Modal.Content>
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
