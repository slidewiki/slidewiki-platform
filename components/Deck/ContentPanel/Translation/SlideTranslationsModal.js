import React from 'react';
import PropTypes from 'prop-types';
import {connectToStores} from 'fluxible-addons-react';
import FocusTrap from 'focus-trap-react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Button, Modal, Divider, TextArea, Dropdown, Segment} from 'semantic-ui-react';
import TranslationStore from '../../../../stores/TranslationStore';
import {getLanguageDisplayName, compareLanguageCodes} from '../../../../common';
import {navigateAction} from 'fluxible-router';
import addNodeTranslation from '../../../../actions/translation/addNodeTranslation';

class SlideTranslationsModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            activeTrap: false,
            action: '',
            languageCode: ''
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
    }

    handleOpen(){
        $('#app').attr('aria-hidden','true');
        this.setState({
            modalOpen:true,
            activeTrap:true,
            action: '',
            languageCode: ''
        });
    }

    handleClose(){
        $('#app').attr('aria-hidden','false');
        this.setState({
            modalOpen:false,
            activeTrap: false
        });
    }

    unmountTrap(){
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    handleLanguageSelection(e, data) {
        this.setState({ action: 'translate', languageCode: data.value });
    }

    handleActionClick(e) {
        if (this.state.action === 'translate') {
            this.handleClose();

            this.context.executeAction(addNodeTranslation, {
                language: this.state.languageCode
            });
        }
    }

    render() {
        const messages = defineMessages({
            header: {
                id: 'SlideTranslationsModal.header',
                defaultMessage: 'Translate Slide',
            },
            chooseLanguage: {
                id: 'SlideTranslationsModal.chooseLanguage',
                defaultMessage: 'Choose the target language...',
            },
            startTranslation: {
                id: 'SlideTranslationsModal.startTranslation',
                defaultMessage: 'Start slide translation:',
            },
            startTranslationSearchOptions: {
                id: 'SlideTranslationsModal.startTranslationSearchOptions',
                defaultMessage: ' (start typing to find your language in its native name)',
            },
            cancel: {
                id: 'SlideTranslationsModal.cancel',
                defaultMessage: 'Cancel',
            },
            translate: {
                id: 'SlideTranslationsModal.translate',
                defaultMessage: 'Start translation',
            },
            originLanguage: {
                id: 'SlideTranslationsModal.originLanguage',
                defaultMessage: 'Original Language:',
            },
            switchSR: {
                id: 'SlideTranslationsModal.switchSR',
                defaultMessage: 'Start a new slide translation',
            }
        });

        let languagesOptions = [];
        if (this.props.TranslationStore.supportedLangs && this.props.TranslationStore.supportedLangs.length > 0) {
            languagesOptions = this.props.TranslationStore.supportedLangs.reduce((arr, current)  => {
                if (!this.props.TranslationStore.treeTranslations.find((t) => compareLanguageCodes(t, current)) //exclude transations and deck language
                  && !compareLanguageCodes(current, this.props.TranslationStore.treeLanguage))
                    arr.push({key: current, value: current, text: getLanguageDisplayName(current)});
                return arr;
            }, []).sort((a, b) => (a.text > b.text) ? 1 : -1);
        }

        let btnMessage = this.context.intl.formatMessage(messages.translate);

        return (
          <Modal trigger={
                  <Button tabIndex='-1' id="SlideTranslationsModalOpenButton" aria-hidden={this.state.modalOpen} basic onClick={this.handleOpen} style={{'display': 'none'}}/>
                 }
              open={this.state.modalOpen}
              onClose={this.handleClose}
              size="small"
              role="dialog"
              id="SlideTranslationsModal"
              aria-labelledby="SlideTranslationsModalHeader"
              aria-describedby="SlideTranslationsModalDescription"
              tabIndex="0">
              <FocusTrap
                  id='focus-trap-SlideTranslationsModal'
                  className = "header"
                  active={this.state.activeTrap}
                  focusTrapOptions={{
                      onDeactivate: this.unmountTrap,
                      clickOutsideDeactivates: false
                  }}>
                  <Modal.Header className="ui left aligned" as="h1" id="SlideTranslationsModalHeader">
                    {this.context.intl.formatMessage(messages.header)}
                  </Modal.Header>
                  <Modal.Content id="SlideTranslationsModalDescription">
                      <div className="sr-only" id="SlideTranslationsModalDescription2">{this.context.intl.formatMessage(messages.switchSR)}</div>
                      <Divider />

                      <div>
                      {this.context.intl.formatMessage(messages.startTranslation)}
                      <br/>
                      <Dropdown
                          className="ui"
                          placeholder={this.context.intl.formatMessage(messages.chooseLanguage)}
                          search
                          options={languagesOptions}
                          onChange={this.handleLanguageSelection.bind(this)}
                          name='languageSelection'
                        /> {this.context.intl.formatMessage(messages.startTranslationSearchOptions)}
                        </div>
                      <Divider />
                      <Modal.Actions className="ui center aligned" as="div" style={{'textAlign': 'right'}}>
                        <Button id="SlideTranslationsModalActionButton" color="green" tabIndex="0" type="button" aria-label={btnMessage} onClick={this.handleActionClick.bind(this)} content={btnMessage} disabled={this.state.action !== 'translate'} />
                        <Button color='red' tabIndex="0" type="button" aria-label={this.context.intl.formatMessage(messages.cancel)} onClick={this.handleClose} icon="minus circle" labelPosition='left' content={this.context.intl.formatMessage(messages.cancel)} />
                      </Modal.Actions>
                  </Modal.Content>
              </FocusTrap>
          </Modal>
        );
    }
}

SlideTranslationsModal.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};
SlideTranslationsModal = connectToStores(SlideTranslationsModal, [TranslationStore], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState()
    };
});

export default SlideTranslationsModal;
