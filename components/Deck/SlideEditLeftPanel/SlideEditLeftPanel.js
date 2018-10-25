import PropTypes from 'prop-types';
import { PhotoshopPicker } from 'react-color';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Icon, Input, Popup, TextArea} from 'semantic-ui-react';
import NavigationPanel from './../NavigationPanel/NavigationPanel';
import addInputBox from '../../../actions/slide/addInputBox';
import uploadMediaClick from '../../../actions/slide/uploadMediaClick';
import uploadVideoClick from '../../../actions/slide/uploadVideoClick';
import tableClick from '../../../actions/slide/tableClick';
import mathsClick from '../../../actions/slide/mathsClick';
import codeClick from '../../../actions/slide/codeClick';
import removeBackgroundClick from '../../../actions/slide/removeBackgroundClick';
import embedClick from '../../../actions/slide/embedClick';
import changeTemplate from '../../../actions/slide/changeTemplate';
import HTMLEditorClick from '../../../actions/slide/HTMLEditorClick';
import AttachQuestions from '../ContentPanel/AttachQuestions/AttachQuestionsModal'; 
import classNames from 'classnames/bind';
import SlideEditStore from '../../../stores/SlideEditStore';
import DeckPageStore from '../../../stores/DeckPageStore';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import changeTitle from '../../../actions/slide/changeTitle';
import changeSlideSize from '../../../actions/slide/changeSlideSize';
import {FormattedMessage, defineMessages} from 'react-intl';
import PaintModal from '../../Paint/PaintModal';

class SlideEditLeftPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            embedURL: '',
            embedCode: '',
            embedWidth: '400',
            embedHeight: '300',
            URLMissingError: false,
            embedCodeMissingError: false,
            showOther: false,
            showTemplate: false,
            showEmbed: false,
            showProperties: false,
            showNameChange: false,
            showSize: false,
            showBackground: false,
            slideTitle: this.props.SlideEditStore.title,
            deckID: this.props.DeckPageStore.selector.id,
            slideSizeText: '',
            LeftPanelTitleChange: false,
            titleMissingError: false,
            paintButton: (<a className="item" id="paintModalTrigger" role="button" >
                                <i tabIndex="0" className="paint brush icon"></i> Paint
                               </a>),
            backgroundColor: null,
            colorPopupIsOpen: false,
            editText: false
        };
    }
    componentDidUpdate(prevProps, prevState){
        if (prevState.showTemplate !== this.state.showTemplate ||
            prevState.showOther !== this.state.showOther ||
            prevState.showEmbed !== this.state.showEmbed ||
            prevState.showProperties !== this.state.showProperties ||
            prevState.showTitleChange !== this.state.showTitleChange ||
            prevState.showSize !== this.state.showSize ||
            prevState.showBackground !== this.state.showBackground)
        {
            //set focus on buttons depending on submenu navigation
            if (this.state.showTitleChange === true)
            {
                $('#slideTitle').focus();
            } else if (this.state.showEmbed === true)
            {
                $('#embedCode').focus();
            } else {
                $('#handleBackLink').focus();
            }
        }

        let backgroundColorInput = document.getElementById('changeBackgroundColorInput');

        if (backgroundColorInput) {
            backgroundColorInput.addEventListener('input', () => {
                $('.pptx2html').css('background-color', backgroundColorInput.value);
            });
        }
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({ slideSizeText: nextProps.SlideEditStore.slideSizeText });
        if(nextProps.SlideEditStore.contentEditorFocus !== this.props.SlideEditStore.contentEditorFocus
            && nextProps.SlideEditStore.contentEditorFocus) {
            this.setState({
                editText: true
            });
        }
    }

    handleAddInputBox(){
        this.context.executeAction(addInputBox, {});
    }
    handleUploadMediaClick(){
        this.context.executeAction(uploadMediaClick, {});
    }
    handleUploadVideoClick(){
        this.context.executeAction(uploadVideoClick, {});
    }
    handleOtherClick(){
        this.setState({showOther: true});
        this.forceUpdate();
        //this.context.executeAction(otherClick, {});
    }
    handleTableClick(){
        this.context.executeAction(tableClick, {});
    }
    handleMathsClick(){
        this.context.executeAction(mathsClick, {});
    }
    handleCodeClick(){
        this.context.executeAction(codeClick, {});
    }
    handleRemoveBackgroundClick(){
        this.context.executeAction(removeBackgroundClick, {});
        // Remove background color in case there is
        $('.pptx2html').css({'background-color' : ''});
    }
    handleEmbedClick(){
        this.setState({showEmbed: true});
        this.setState({showOther: false});
        this.forceUpdate();
        //this.context.executeAction(embedClick, {});
    }
    handleEmbedAddClick(){
        if(this.state.embedURL === '' && this.state.embedCode === ''){
            this.setState({ URLMissingError: true });
            this.setState({ embedCodeMissingError: true });
            //console.log('errormissing');
            this.forceUpdate();
        }
        else {
            if (this.state.embedCode !== ''){
                this.context.executeAction(embedClick, {
                    embedWidth: '',
                    embedHeight: '',
                    iframe: '',
                    embedCode: this.state.embedCode
                });

            }
            else{
                this.context.executeAction(embedClick, {
                    embedWidth: this.state.embedWidth,
                    embedHeight: this.state.embedHeight,
                    embedURL: this.state.embedURL,
                    embedCode: ''
                });
            }
            this.setState({showTemplate: false});
            this.setState({showOther: true});
            this.setState({showEmbed: false});
        }
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    handleTemplateClick(){
        //console.log('clicked');
        this.setState({showTemplate: true});
        this.forceUpdate();
    }
    handleTemplatechange(templateID){
        if(templateID !== ''){
            //this.setState({showTemplate: false});
            this.context.executeAction(changeTemplate, {
                //template: this.refs.template.value
                template: templateID
            });
            //this.forceUpdate();
        }
    }
    handlePropertiesClick(){
        this.setState({showProperties: true});
        this.forceUpdate();
    }
    handleTitleClick(){
        this.setState({showProperties: false});
        this.setState({showTitleChange: true});
        this.forceUpdate();
    }
    handleTitleChangeClick(){
        //console.log('change title');
        if (this.state.slideTitle === ''){
            this.setState({titleMissingError: true});
        } else {
            //console.log(this.state.slideTitle);
            this.context.executeAction(changeTitle, {
                title: this.state.slideTitle,
                LeftPanelTitleChange: true
            });
            this.setState({showProperties: true});
            this.setState({showTitleChange: false});
            //update this.props.SlideEditStore.title via action
            //in content editor -> catch new value for title SlideEditStore.title -> manuall trigger save -> new revision??
            //context.dispatch('UNDO_RENAME_TREE_NODE_SUCCESS', payload.params);
        }

    }
    handleOpenColorPopup(){
        this.setState({
            colorPopupIsOpen: true,
            backgroundColor: $('.pptx2html').css('background-color')
        });
    }
    changeSlideSizeClick(){
        //console.log('change slide size button clicked');
        this.setState({showSize: true});
        this.setState({showProperties: false});
        this.forceUpdate();
    }
    handleSlideSizeChange(width) {
        if (width !== ''){
            //this.setState({showTemplate: false});
            this.context.executeAction(changeSlideSize, {
                //slideSize: this.refs.template.slideSize
                slideSize: width
            });
            //this.forceUpdate();
        }
    }
    changeBackgroundColor(){
        this.setState({
            backgroundColor: $('.pptx2html').css('background-color'),
            colorPopupIsOpen: false
        });
    }
    cancelChangeBackgroundColor(){
        $('.pptx2html').css('background-color', this.state.backgroundColor);
        this.setState({
            colorPopupIsOpen: false
        });
    }
    handleHTMLEditorClick(){
        this.context.executeAction(HTMLEditorClick, {});
    }

    handleHelpClick(){
        swal({
            title: this.context.intl.formatMessage({
                id: 'editpanel.KeyboardShortcutsModal.title',
                defaultMessage: 'Information on slide editor controls and keyboard shortcuts',
            }),
            html: this.context.intl.formatMessage({
                id: 'editpanel.KeyboardShortcutsModal.html',
                defaultMessage: '&#8226; Use Alt+F10 to enter the editor toolbar, then use Tab and Shift+Tab to move between toolbar groups and Arrow keys to move between buttons within a toolbar group. <br/>'+
                '&#8226; Enter text in input box: control + enter <br/>'+
                '&#8226; Move input box around: press control + alt and then the up, down, left, right keys <br/>' +
                '&#8226; Bring input box to front or back: press control+shift and then the plus or minus key <br/>' +
                '&#8226; Duplicate an input box: control + d <br/>'+
                '&#8226; Delete an input box: control + delete <br/>'+
                '&#8226; See <a href="https://sdk.ckeditor.com/samples/accessibility.html" target="_blank">https://sdk.ckeditor.com/samples/accessibility.html</a> for more (CKeditor) keyboard shortcuts <br/> <br/>' +
                '&#8226; <b>Tip:</b> press the "shift" keyboard button while resizing an image to maintain the width-to-heigth ratio/dimensions of the image <br/>'
            }),
            //'&#8226; When using Firefox, the selection of text via mouse cursor does not work well. Use keyboard selection or another browser instead. We are working to solve this problem. <br/>' +
            type: 'question',
            showCloseButton: true,
            showCancelButton: false,
            confirmButtonText: this.context.intl.formatMessage({
                id: 'editpanel.KeyboardShortcutsModal.confirm',
                defaultMessage: 'okay',
            }),
            confirmButtonClass: 'ui olive button',
            buttonsStyling: false
        }).then((accepted) => {
            //this.applyTemplate(template);
        }, (reason) => {
            //done(reason);
        });
    }
    handleBackEmbed(){
        this.setState({showOther: true});
        this.setState({showEmbed: false});
        this.forceUpdate();
    }
    handleTitleBack(){
        this.setState({showProperties: true});
        this.setState({showTitleChange: false});
        this.forceUpdate();
    }
    handleBack(){
        this.setState({showTemplate: false});
        this.setState({showOther: false});
        this.setState({showEmbed: false});
        this.setState({showProperties: false});
        this.setState({showSize: false});
        this.forceUpdate();
    }
    handleChangeBackgroundColorClick(){
        this.setState({
            backgroundColor: $('.pptx2html').css('background-color')
        });
    }
    handleTabClick(editText) {
        this.setState({
            editText: editText
        });
    }
    handleKeyPress = (event, param, template) => {
        //console.log(event.key);
        //if(event.key === 'Enter' || event.key === ' '){
        if(event.key === 'Enter'){
            //console.log('enter key');
            switch (param) {
                case 'handleBack':
                    this.handleBack();
                    break;
                case 'handleAddInputBox':
                    this.handleAddInputBox();
                    break;
                case 'handleUploadMediaClick':
                    this.handleUploadMediaClick();
                    break;
                case 'handleUploadVideoClick':
                    this.handleUploadVideoClick();
                    break;
                case 'handleOtherClick':
                    this.handleOtherClick();
                    break;
                case 'handleTableClick':
                    this.handleTableClick();
                    break;
                case 'handleMathsClick':
                    this.handleMathsClick();
                    break;
                case 'handleCodeClick':
                    this.handleCodeClick();
                    break;
                case 'handleBackEmbed':
                    this.handleBackEmbed();
                    break;
                case 'handleEmbedClick':
                    this.handleEmbedClick();
                    break;
                case 'handleEmbedAddClick':
                    this.handleEmbedAddClick();
                    break;
                case 'handleTemplateClick':
                    this.handleTemplateClick();
                    break;
                case 'handleTemplatechange':
                    this.handleTemplatechange(template);
                    break;
                case 'handlePropertiesClick':
                    this.handlePropertiesClick();
                    break;
                case 'handleTitleBack':
                    this.handleTitleBack();
                    break;
                case 'handleTitleClick':
                    this.handleTitleClick();
                    break;
                case 'handleSlideNameChangeKeyInInput': //this is a special case
                    this.handleTitleChangeClick();
                    break;
                case 'handleTitleChangeClick':
                    this.handleTitleChangeClick();
                    break;
                case 'changeSlideSizeClick':
                    this.changeSlideSizeClick();
                    break;
                case 'handleSlideSizeChange':
                    this.handleSlideSizeChange(slideSize);
                    break;
                case 'handleHTMLEditorClick':
                    this.handleHTMLEditorClick();
                    break;
                case 'handleHelpClick':
                    this.handleHelpClick();
                    break;
                case 'handleChangeBackgroundColorClick':
                    this.handleChangeBackgroundColorClick();
                    break;
                default:
            }
        }
    }
    componentDidMount(){
        this.paintButton = (<PaintModal/>);
    }

    handleColorChange(color) {
        $('.pptx2html').css('background-color', color.hex);
    }

    render() {
        const dropDownItemStyle = {
            //minWidth: '100%',
            minHeight: '100px',
            //borderStyle: 'dashed dashed none dashed',
            //borderColor: '#e7e7e7',
        };
        const whiteText = {
            fontColor: 'white',
        };
        let selectorImm = this.props.DeckTreeStore.selector; 
        let selector = {id: selectorImm.get('id'), stype: selectorImm.get('stype'), sid: selectorImm.get('sid'), spath: selectorImm.get('spath')}; /*is this line still needed */
        //let selectorDeck = this.props.DeckPageStore.selector;
        let selectorDeck = {id: this.props.DeckPageStore.selector.id, stype: 'deck', sid: this.props.DeckPageStore.selector.id};
        let currentDeck = {DeckTreeStore: this.props.DeckTreeStore};

        let buttonStyle = {
            classNames : classNames({
                'help':true,
                'icon':true
            }),
            iconSize : 'large',
        } ;

        let otherList = (
                <div>
                  <a className="item" id="handleBack" role="button" onClick={this.handleBack.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleBack')}>
                      <i id="handleBackLink" tabIndex="0" className="reply icon"></i><FormattedMessage id='editpanel.back' defaultMessage='back' />
                  </a>
                  <a  className="item" id="handleEmbedClick" role="button" onClick={this.handleEmbedClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleEmbedClick')}>
                      <i tabIndex="0"  className="plus square outline icon"></i><FormattedMessage id='editpanel.embed' defaultMessage='Embed' />
                  </a>
                  <a className="item" id="handleTableClick" role="button" onClick={this.handleTableClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTableClick')}>
                      <i tabIndex="0" className="table icon"></i><FormattedMessage id='editpanel.table' defaultMessage='Table' />
                  </a>
                  <a className="item" id="handleMathsClick" role="button" onClick={this.handleMathsClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleMathsClick')}>
                      <i tabIndex="0" className="superscript icon"></i><FormattedMessage id='editpanel.Maths' defaultMessage='Maths' />
                  </a>
                  <a className="item" id="handleCodeClick" role="button" onClick={this.handleCodeClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleCodeClick')}>
                      <i tabIndex="0" className="code icon"></i><FormattedMessage id='editpanel.Code' defaultMessage='Code' />
                  </a>
                  <a className="item" id="handleHTMLEditorClick" role="button" onClick={this.handleHTMLEditorClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleHTMLEditorClick')}>
                      <i tabIndex="0"  className="code icon"></i><FormattedMessage id='editpanel.HTMLeditor' defaultMessage='HTML editor' />
                  </a>
                </div>);

        let embedOptions = (
                <form className="ui form">
                  <a className="item" id="handleBack" role="button" onClick={this.handleBackEmbed.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleBackEmbed')}>
                      <i id="handleBackLink" tabIndex="0" className="reply icon"></i><FormattedMessage id='editpanel.back' defaultMessage='back' />
                  </a>
                  <label htmlFor="embedCode">
                    <FormattedMessage id='editpanel.embedCode' defaultMessage='Code to embed content:' />
                  </label>
                  <div className="field">
                    <i className="error">
                        {this.state.embedCodeMissingError === false ? '' : <FormattedMessage id='editpanel.embedCodeMissingError' defaultMessage='missing embed code' />}
                    </i>
                    <textarea rows="4" onChange={this.handleChange.bind(this)} id="embedCode" ref="embedCode" name="embedCode" aria-label="Code to embed content" autoFocus ></textarea>
                  </div>
                  <div>
                    <i>or</i>
                  </div>
                  <label htmlFor="embedURL">
                    <FormattedMessage id='editpanel.embedURL' defaultMessage='URL/Link to embedded content:' />
                  </label>
                  <div className="field">
                    <i className="error">
                        {this.state.URLMissingError === false ? '' : <FormattedMessage id='editpanel.URLMissingError' defaultMessage='missing URL/link to content' />}
                    </i>
                    <Input onChange={this.handleChange.bind(this)} id="embedURL" ref="embedURL" name="embedURL" aria-label="URL (Link) to embedded content" autoFocus/>
                  </div>
                  <label htmlFor="embedWidth">
                    <FormattedMessage id='editpanel.embedWidth' defaultMessage='Width of embedded content:' />
                  </label>
                  <div className="required field">
                    <Input onChange={this.handleChange.bind(this)} defaultValue="400"  id="embedWidth" ref="embedWidth" name="embedWidth" aria-label="Width of embedded content" aria-required="true" required />
                  </div>
                  <label htmlFor="embedHeight">
                    <FormattedMessage id='editpanel.embedHeight' defaultMessage='Height of embedded content:' />
                  </label>
                  <div className="required field">
                    <Input onChange={this.handleChange.bind(this)} defaultValue="300"  id="embedHeight" ref="embedHeight" name="embedHeight" aria-label="Height of embedded content" aria-required="true" required />
                  </div>
                  <a className="item" id="handleEmbedAddClick" role="button" onClick={this.handleEmbedAddClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleEmbedAddClick')}>
                      <i tabIndex="0" className="add square icon"></i><FormattedMessage id='editpanel.embedAdd' defaultMessage='Add to Slide' />
                  </a>
                  <label htmlFor="handleEmbedAddClick">
                    <FormattedMessage id='editpanel.embedNote' defaultMessage='Not all website owners allow their content to be embedded. Using an embed code (instead of URL) often works best.' />
                  </label>
                </form>);

        const templateListStyle = {
            maxHeight: 600,
            minHeight: 320,
            padding: 5,
            overflowY: 'auto'
        };
        //id="handleTemplatechange" className="ui field search selection dropdown" data-position="top center" data-inverted="" ref="templateList"
        let templateList = (
                <div style={templateListStyle}>
                  <a className="item" id="handleBack" role="button" tabIndex="0" onClick={this.handleBack.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleBack')}>
                      <i id="handleBackLink" tabIndex="0" className="reply icon"></i><FormattedMessage id='editpanel.back' defaultMessage='back' />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, '2')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', '2')}>
                      <i tabIndex="0" aria-label="Empty document"><FormattedMessage id='editpanel.template2' defaultMessage='Empty document - Document-mode (non-canvas)' /></i> <br/><br/>
                      <img aria-hidden="true" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/2.png" alt="template - Empty document" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, '3')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', '3')}>
                      <i tabIndex="0" aria-label="Document with title"><FormattedMessage id='editpanel.template3' defaultMessage='Document with title - Document-mode (non-canvas)' /></i> <br/><br/>
                      <img aria-hidden="true"  style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/3.png" alt="template - Document with title" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, '31')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', '31')}>
                      <i tabIndex="0" aria-label="Document with rich text example"><FormattedMessage id='editpanel.template31' defaultMessage='Document with rich text example - Document-mode (non-canvas)' /></i> <br/><br/>
                      <img aria-hidden="true"  style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/11img.png" alt="template - Document with rich text example" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, '1')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', '1')}>
                      <i tabIndex="0" aria-label="Title and bullets"><FormattedMessage id='editpanel.template1' defaultMessage='Title and bullets' /><br/> <FormattedMessage id='editpanel.template960px' defaultMessage='960 * 720 pixels (4:3)' /> </i> <br/><br/>
                      <img aria-hidden="true" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/1.png" alt="template - Title and bullets" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, '11')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', '11')}>
                      <i tabIndex="0" aria-label="1 row 1 column"><FormattedMessage id='editpanel.template11' defaultMessage='1 row 1 column ' /><br/> <FormattedMessage id='editpanel.template960px' defaultMessage='960 * 720 pixels (4:3)' /></i> <br/><br/>
                      <img aria-hidden="true" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/11.png" alt="template - 1 row 1 column" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, '12')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', '12')}>
                      <i tabIndex="0" aria-label="1 row 2 column"><FormattedMessage id='editpanel.template12' defaultMessage='1 row 2 columns' /><br/> <FormattedMessage id='editpanel.template960px' defaultMessage='960 * 720 pixels (4:3)' /></i> <br/><br/>
                      <img aria-hidden="true" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/12.png" alt="template - 1 row 2 columns" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, '22')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', '22')}>
                      <i tabIndex="0" aria-label="2 rows 2 columns"><FormattedMessage id='editpanel.template22' defaultMessage='2 rows 2 columns' /><br/> <FormattedMessage id='editpanel.template960px' defaultMessage='960 * 720 pixels (4:3)' /></i> <br/><br/>
                      <img aria-hidden="true"  style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/22.png" alt="template - 2 rows 2 columns" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, '21')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', '21')}>
                      <i tabIndex="0" aria-label="2 rows 1 column"><FormattedMessage id='editpanel.template21' defaultMessage='2 rows 1 column' /><br/> <FormattedMessage id='editpanel.template960px' defaultMessage='960 * 720 pixels (4:3)' /></i> <br/><br/>
                      <img aria-hidden="true" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/21.png" alt="template - 2 rows 1 column" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, '11img')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', '11img')}>
                      <i tabIndex="0" aria-label="1 row 1 column image"><FormattedMessage id='editpanel.template11img' defaultMessage='1 row 1 column image' /><br/> <FormattedMessage id='editpanel.template960px' defaultMessage='960 * 720 pixels (4:3)' /></i> <br/><br/>
                      <img aria-hidden="true" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/11img.png" alt="template - 1 row 1 column image" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, 'outitleslide')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', 'outitleslide')}>
                      <i tabIndex="0" aria-label="Open University Theme Title Page"><FormattedMessage id='editpanel.templateoutitleslide' defaultMessage='Open University Theme Title Page' /><br/> <FormattedMessage id='editpanel.template960px' defaultMessage='960 * 720 pixels (4:3)' /></i> <br/><br/>
                      <img aria-hidden="true"  style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/outitleslide.png" alt="template - Open University Theme Title Page" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, 'oegtitleslide')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', 'oegtitleslide')}>
                      <i tabIndex="0" aria-label="OEG Theme Title Page"><FormattedMessage id='editpanel.templateoegtitleslide' defaultMessage='OEG Theme Title Page' /><br/> <FormattedMessage id='editpanel.template960px' defaultMessage='960 * 720 pixels (4:3)' /></i> <br/><br/>
                      <img aria-hidden="true"  style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/oegtitleslide.png" alt="template - OEG Theme Title Page" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, 'slidewikislide')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', 'slidewikislide')}>
                      <i tabIndex="0" aria-label="SlideWiki template"><FormattedMessage id='editpanel.templateslidewikislide' defaultMessage='SlideWiki template' /><br/> <FormattedMessage id='editpanel.template960px' defaultMessage='960 * 720 pixels (4:3)' /></i> <br/><br/>
                      <img aria-hidden="true" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/slidewikislide.png" alt="template - SlideWiki template" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, 'EKDDA')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', 'EKDDA')}>
                      <i tabIndex="0" aria-label="EKDDA template"><FormattedMessage id='editpanel.templateEKDDA' defaultMessage='EKDDA template' /><br/> <FormattedMessage id='editpanel.template1280px' defaultMessage='1280 * 720 pixels (720p 16:9)' /></i> <br/><br/>
                      <img aria-hidden="true" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/EKDDA.png" alt="template - EKDDA template" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, 'EKDDAeng')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', 'EKDDAeng')}>
                      <i tabIndex="0" aria-label="EKDDA template - English"><FormattedMessage id='editpanel.templateEKDDAeng' defaultMessage='EKDDA template - English' /><br/> <FormattedMessage id='editpanel.template1280px' defaultMessage='1280 * 720 pixels (720p 16:9)' /></i> <br/><br/>
                      <img aria-hidden="true" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/EKDDAeng.png" alt="template - EKDDA template - English" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, 'EKDDAengNofooter')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', 'EKDDAengNofooter')}>
                      <i tabIndex="0" aria-label="EKDDA template - English no footer"><FormattedMessage id='editpanel.templateEKDDAengNofooter' defaultMessage='EKDDA template - English no footer' /><br/><FormattedMessage id='editpanel.template1280px' defaultMessage='1280 * 720 pixels (720p 16:9)' /></i> <br/><br/>
                      <img aria-hidden="true" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/EKDDAengNofooter.png" alt="template - EKDDA template - English no footer" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, 'TIBtitle')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', 'TIBtitle')}>
                      <i tabIndex="0" aria-label="TIB template - title page"><FormattedMessage id='editpanel.templateTIBtitle' defaultMessage='TIB template - Title page' /><br/> <FormattedMessage id='editpanel.template960px' defaultMessage='960 * 720 pixels (4:3)' /></i> <br/><br/>
                      <img aria-hidden="true" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/TIBtitle.png" alt="template - TIB template title page - English" />
                  </a>
                  <a className="item" role="button" onClick={this.handleTemplatechange.bind(this, 'VMU')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', 'VMU')}>
                      <i tabIndex="0" aria-label="VMU template - title page"><FormattedMessage id='editpanel.templateVMU' defaultMessage='VMU template - Title page' /><br/> <FormattedMessage id='editpanel.template1280px' defaultMessage='1280 * 720 pixels (720p 16:9)' /></i> <br/><br/>
                      <img aria-hidden="true" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/VMU.png" alt="template - VMU template title page - English" />
                  </a>
                </div>);

        let propertiesContent  = (
                <form className="ui form">
                  <a className="item" id="handleBack" role="button" onClick={this.handleBack.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleBack')}>
                      <i id="handleBackLink" tabIndex="0" className="reply icon"></i><FormattedMessage id='editpanel.back' defaultMessage='back' />
                  </a>
                  <a className="item" id="handleTitleClick" role="button" onClick={this.handleTitleClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTitleClick')}>
                      <i tabIndex="0" className="edit icon"></i><FormattedMessage id='editpanel.slideTitleButton' defaultMessage='Change slide name' />
                  </a>
                  <a className="item" id="changeSlideSizeClick" role="button" onClick={this.changeSlideSizeClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'changeSlideSizeClick')}>
                        <i tabIndex="0" className="crop icon"></i>
                        <FormattedMessage id='editpanel.slideSizeChange' defaultMessage={'Change slide size'}/>
                        <br/>
                        <FormattedMessage id='editpanel.slideSizeCurrent'
                                values={{
                                    size: this.state.slideSizeText,
                                }}
                                defaultMessage={'(current: {size})'}/>
                    </a>
                 <Popup id='colorpopup' trigger={
                      <a className="item" id="handleChangeBackgroundColor" role="button" onClick={this.handleChangeBackgroundColorClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleChangeBackgroundColorClick')}>
                          <i tabIndexn="0"  className="tint icon"></i><FormattedMessage id='editpanel.changeBackgroundColor' defaultMessage='Change Background Colour' />
                      </a>
                    }
                    content={
                        <PhotoshopPicker onChange={ this.handleColorChange.bind(this) } header='Choose Background Color'
                            onAccept={this.changeBackgroundColor.bind(this)}
                            onCancel={this.cancelChangeBackgroundColor.bind(this)}
                            color={this.state.backgroundColor}
                        />
                    }
                    on='click'
                    position='right center'
                    open={this.state.colorPopupIsOpen}
                    onOpen={this.handleOpenColorPopup.bind(this)}
                  />
                  <a className="item" id="handleRemoveBackgroundClick" role="button" onClick={this.handleRemoveBackgroundClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleRemoveBackgroundClick')}>
                      <i tabIndex="0"  className="image slash icon"></i><FormattedMessage id='editpanel.removeBackground' defaultMessage='Remove background' />
                      {/*eraser*/}
                  </a>
                </form>);
                //better (not working) icons for change slide size
                //window restore
                //window restore icon
                //crop
                //map outline
                //working: //external
                //<FormattedMessage id='editpanel.slideTitleChangeUpdateNote1' defaultMessage='The entire slide is save together with the slide name.' />
                //placeholder="Slide name" //needs to be translated


        let titleChangeContent  = (
                <div className="ui form">
                  <a className="item" id="handleTitleBack" role="button" onClick={this.handleTitleBack.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTitleBack')}>
                      <i id="handleBackLink" tabIndex="0" className="reply icon"></i><FormattedMessage id='editpanel.back' defaultMessage='back' />
                  </a>
                  <i className="error">
                      {this.state.titleMissingError === false ? '' : <FormattedMessage id='editpanel.titleMissingError' defaultMessage='Error: Slide name can not be empty' />}
                      <br />
                  </i>
                  <label htmlFor="slideTitle">
                    <FormattedMessage id='editpanel.slideTitle' defaultMessage='Change slide name:' />
                  </label>
                  <div className="ui fluid action input">
                    <TextArea type="text" onChange={this.handleChange.bind(this)} defaultValue={this.props.SlideEditStore.title} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleSlideNameChangeKeyInInput')} id="slideTitle" ref="slideTitle" name="slideTitle" aria-label="Slide name" aria-required="true" required autoFocus tabIndex='0'/>
                    <button className="ui icon button blue" aria-describedby="ariaLabelSlideNameSaveButton" id="handleTitleChangeClick" role="button" onClick={this.handleTitleChangeClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTitleChangeClick')}>
                        <i tabIndex="0" className="check icon white big"></i>
                    </button>
                  </div>
                  <TextArea className="sr-only" id="ariaLabelSlideNameSaveButton" value="submit slide name" tabIndex ='-1'/>
                </div>);

        let sizeContent = (
            <div >
              <a className="item" id="handleBack" role="button" tabIndex="0" onClick={this.handleBack.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleBack')}>
                  <i id="handleBackLink" tabIndex="0" className="reply icon"></i><FormattedMessage id='editpanel.back' defaultMessage='back' />
              </a>
              <a className="item" role="button" onClick={this.handleSlideSizeChange.bind(this, '960')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleSlideSizeChange', '960')}>
                  <i tabIndex="0" aria-label="Standard (4:3) low - 960 * 720 pixels -  (legacy Powerpoint default) "><FormattedMessage id='editpanel.slideSizeStandard' defaultMessage='Standard (4:3) low' /> <br/> 960 * 720 <FormattedMessage id='editpanel.slideSizeStandardPixels' defaultMessage='pixels' />  <br/> <FormattedMessage id='editpanel.slideSizeNameLegacy' defaultMessage='(legacy/old) Powerpoint default' />  </i> <br/><br/>
                  <img aria-hidden="true" className="ui image small bordered fluid" src="/assets/images/slidesizes/960.png" alt="template - Title and bullets" />
              </a>
              <a className="item" role="button" onClick={this.handleSlideSizeChange.bind(this, '1280')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleSlideSizeChange', '1280')}>
                  <i tabIndex="0" aria-label="Standard (4:3) medium - 1280 * 960 pixels - Super XGA "><FormattedMessage id='editpanel.slideSizeStandardmedium' defaultMessage='Standard (4:3) medium' />  <br/> 1280 * 960 <FormattedMessage id='editpanel.slideSizeStandardPixels' defaultMessage='pixels' /> <br/> <FormattedMessage id='editpanel.slideSizeNameSuperXGA' defaultMessage='Super XGA' /> </i> <br/><br/>
                  <img aria-hidden="true" className="ui image small bordered fluid" src="/assets/images/slidesizes/1280.png" alt="template - Title and bullets" />
              </a>
              <a className="item" role="button" onClick={this.handleSlideSizeChange.bind(this, '1600')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleSlideSizeChange', '1600')}>
                  <i tabIndex="0" aria-label="Standard (4:3) high - 1600 * 1200 pixels - Ultra XGA "><FormattedMessage id='editpanel.slideSizeStandardhigh' defaultMessage='Standard (4:3) high' /> <br/> 1600 * 1200 <FormattedMessage id='editpanel.slideSizeStandardPixels' defaultMessage='pixels' /> <br/> <FormattedMessage id='editpanel.slideSizeNameUltraXGA' defaultMessage='Ultra XGA' /> </i> <br/><br/>
                  <img aria-hidden="true" className="ui image small bordered fluid" src="/assets/images/slidesizes/1600.png" alt="template - Title and bullets" />
              </a>
              <a className="item" role="button" onClick={this.handleSlideSizeChange.bind(this, '720p')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleSlideSizeChange', '720p')}>
                  <i tabIndex="0" aria-label="Widescreen (16:9) - 1280 * 720 pixels - 720p HDTV Wide XGA "><FormattedMessage id='editpanel.slideSizeWidescreen720' defaultMessage='Widescreen (16:9)' /> <br/> 1280 * 720 <FormattedMessage id='editpanel.slideSizeStandardPixels' defaultMessage='pixels' /> <br/> <FormattedMessage id='editpanel.slideSizeName720' defaultMessage='720p HDTV Wide XGA' /> </i> <br/><br/>
                  <img aria-hidden="true" className="ui image small bordered fluid" src="/assets/images/slidesizes/720p.png" alt="template - Title and bullets" />
              </a>
              <a className="item" role="button" onClick={this.handleSlideSizeChange.bind(this, '1080p')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleSlideSizeChange', '1080p')}>
                  <i tabIndex="0" aria-label="Widescreen (16:9) High - 1920 * 1080 pixels - 1080p/1080i HDTV Blu-ray "><FormattedMessage id='editpanel.slideSizeWidescreen1080' defaultMessage='Widescreen (16:9) high' /> <br/> 1920 * 1080 <FormattedMessage id='editpanel.slideSizeStandardPixels' defaultMessage='pixels' /> <br/> <FormattedMessage id='editpanel.slideSizeName1080' defaultMessage='1080p/1080i HDTV Blu-ray' /> </i> <br/><br/>
                  <img aria-hidden="true" className="ui image small bordered fluid" src="/assets/images/slidesizes/1080p.png" alt="template - Title and bullets" />
              </a>
            </div>);
        let normalContent = (
          <div>
            <a className="item" id="handleAddInputBox" role="button" onClick={this.handleAddInputBox.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleAddInputBox')}>
                <i tabIndex="0" className="font icon"></i><FormattedMessage id='editpanel.addTextBox' defaultMessage='Add text box' />
            </a>
            <a  className="item" id="handleUploadMediaClick" role="button" onClick={this.handleUploadMediaClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleUploadMediaClick')}>
                <i tabIndex="0" className="photo icon"></i><FormattedMessage id='editpanel.Image' defaultMessage='Add image' />
            </a>
            {this.paintButton}
            <a  className="item" id="handleUploadVideoClick" role="button" onClick={this.handleUploadVideoClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleUploadVideoClick')}>
                <i tabIndex="0"  className="film icon"></i><FormattedMessage id='editpanel.Video' defaultMessage='Add video' />
            </a>
            <a  className="item" id="handleOtherClick" role="button" onClick={this.handleOtherClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleOtherClick')}>
                <i tabIndex="0"  className="ellipsis horizontal icon"></i><FormattedMessage id='editpanel.Other' defaultMessage='Add other' />
            </a>
            <AttachQuestions currentDeck={currentDeck} buttonStyle={buttonStyle} selector={selectorDeck}/>
            <a  className="item" id="handleTemplateClick" role="button" onClick={this.handleTemplateClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplateClick')}>
                <i tabIndex="0"  className="grid layout icon"></i><FormattedMessage id='editpanel.Template' defaultMessage='Template' />
            </a>
            <a className="item" id="handlePropertiesClick" role="button" onClick={this.handlePropertiesClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handlePropertiesClick')}>
                <i tabIndex="0"  className="settings icon"></i><FormattedMessage id='editpanel.Properties' defaultMessage='Properties' />
            </a>
            <a className="item" id="handleHelpClick" role="button" onClick={this.handleHelpClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleHelpClick')}>
                <i tabIndex="0"  className="help icon"></i><FormattedMessage id='editpanel.Help' defaultMessage='Help' />
            </a>
            </div>
          );

        let panelcontent;
        if(this.state.showTemplate){
            panelcontent = templateList;
        }else if (this.state.showOther) {
            panelcontent = otherList;
        } else if (this.state.showEmbed) {
            panelcontent = embedOptions;
        } else if (this.state.showProperties){
            panelcontent = propertiesContent;
        } else if (this.state.showTitleChange){
            panelcontent = titleChangeContent;
        } else if (this.state.showSize){
            panelcontent = sizeContent;
        } else {
            panelcontent = normalContent;
        }
        
        const tabActive = {
            background: '#767676',
            color: '#ffffff'
        };

        return (
          <div className="ui container" ref="treePanel" role="navigation" onFocus={this.handleFocus} onBlur={this.handleBlur}>
              <NavigationPanel mode='edit' />
                <div className="ui buttons attached fluid">
                    <button className="ui button" style={!this.state.editText ? tabActive : {}} onClick={this.handleTabClick.bind(this, false)}>Add</button>
                    <button className="ui button" style={this.state.editText ? tabActive : {}} onClick={this.handleTabClick.bind(this, true)}>Edit</button>
                </div>
              <div className="ui grey inverted segment bottom attached active tab">
                <div id="CKeditorMenu" style={!this.state.editText ? {display: 'none'} : {}}></div>
                <div className="ui center aligned grid" style={this.state.editText ? {display: 'none'} : {}}>
                    <div className="ui vertical labeled icon grey inverted large menu">
                          {panelcontent}
                          </div>
                      </div>
                  </div>
                </div>
        );
    }
}

SlideEditLeftPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};
SlideEditLeftPanel = connectToStores(SlideEditLeftPanel, [SlideEditStore, DeckPageStore, DeckTreeStore], (context, props) => {
    return {
        SlideEditStore: context.getStore(SlideEditStore).getState(),
        DeckPageStore : context.getStore(DeckPageStore).getState(),
        DeckTreeStore : context.getStore(DeckTreeStore).getState()
    };
});
export default SlideEditLeftPanel;
