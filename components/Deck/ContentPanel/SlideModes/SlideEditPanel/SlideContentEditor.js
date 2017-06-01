import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import DataSourceStore from '../../../../../stores/DataSourceStore';
import SlideViewStore from '../../../../../stores/SlideViewStore';
import addSlide from '../../../../../actions/slide/addSlide';
import saveSlide from '../../../../../actions/slide/saveSlide';
import loadSlideAll from '../../../../../actions/slide/loadSlideAll';
import ResizeAware from 'react-resize-aware';
import { findDOMNode } from 'react-dom';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import {Microservices} from '../../../../../configs/microservices';
import PresentationStore from '../../../../../stores/PresentationStore';
import TemplateDropdown from '../../../../common/TemplateDropdown';
import {HotKeys} from 'react-hotkeys';

let ReactDOM = require('react-dom');

class SlideContentEditor extends React.Component {
    constructor(props) {
        super(props);
        this.currentcontent;
        this.refresh = 'false';
        this.CKEDitor_loaded = false;
        this.scaleratio = 1;
        this.inputBoxButtonTitle;
        //if(this.props.content.indexOf('pptx2html') !== -1)
        if (this.props.content.includes('pptx2html'))
        { // if pptx2html element with absolute content is in slide content (underlying HTML)
            this.inputBoxButtonTitle = 'Add input box';
        } else { //if slide does not have pptx2html/canvas/absolute positioning
            this.inputBoxButtonTitle = 'Switch to canvas with input boxes';
        }
        this.refs.template;
        this.showTemplates = false;
        this.menuFocus;
        this.previousCaretRange;
        this.CKeditorMode = 'advanced toolbar';
    }

    handleTemplatechange(){
        if (this.showTemplates === false){
            this.refs.template.showOptions();
            this.showTemplates = true;
        }
        else{
            let template = this.refs.template.getSelected();
            if (this.refs.template.getSelected() !== '')
            {
                //overwrite content with templates from
                //http://stable.slidewiki.org/deck/9319-3/
                swal({
                    title: 'Apply template',
                    text: 'This action will overwrite existing slide content with the template. Recent changes (after pressing the save button) are lost. You can always revert to an earlier version of the slide or decide to not save after applying the template. Do you want to continue?',
                    type: 'question',
                    showCloseButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Yes, apply template',
                    confirmButtonClass: 'ui olive button',
                    cancelButtonText: 'No',
                    cancelButtonClass: 'ui red button',
                    buttonsStyling: false
                }).then((accepted) => {
                    this.applyTemplate(template);
                }, (reason) => {
                    //done(reason);
                });
            }
        }
    }

    applyTemplate(template){
        switch (template) {
            case '1':
                //TODO replace with this.refs.inlineContent.innerHTML + cases below
                //CKEDITOR.instances.inlineContent.setData(
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="position: relative; width: 960px; height: 720px;">'+
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="position: absolute; top: 38.3334px; left: 66px; width: 828px; height: 139.167px; z-index: 23488;">'+
                    '<h3 class="h-mid"><span class="text-block" style="font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">Title</span></h3></div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="position: absolute; top: 191.667px; left: 66px; width: 828px; height: 456.833px; z-index: 23520;">'+
                    '<ul>'+
                    '	<li class="h-left" style="text-align: left;"><span class="text-block" style="font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">Text bullet 1</span></li>'+
                    '	<li class="h-left" style="text-align: left;"><span class="text-block" style="font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">Text bullet 2</span></li>'+
                    '</ul>'+
                    '<div class="h-left">&nbsp;</div>'+
                    '</div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '2':
                //CKEDITOR.instances.inlineContent.setData('');
                this.refs.inlineContent.innerHTML = '';
                this.inputBoxButtonTitle = 'Switch to canvas with input boxes';
                break;
            case '3':
                this.refs.inlineContent.innerHTML = '<h1 style="text-align: center;">Title</h1>'+
                    '<p>text</p>';
                this.inputBoxButtonTitle = 'Switch to canvas with input boxes';
                break;
            case '11':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; ">Heading</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 65.14px; width: 941.77px; height: 610px; text-align: left; position: absolute; z-index: 2120483647; ">'+
                    '<p style="font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">&nbsp;Row 1 - Column 1</p></div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; ">Footer</div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '12':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; ">Heading</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 64.11px; width: 661px; height: 613.14px; text-align: left; position: absolute; z-index: 2138483647; ">'+
                    '<p style="text-align:center">Row 1 - Column&nbsp;1</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; ">Footer</div>'+
                    '<div style="left: 660.87px; top: 63.85px; width: 282.49px; height: 611.39px; position: absolute; z-index: 2138483647; ">'+
                    '<div class="h-mid" style="text-align: center;">'+
                    '<p style="text-align:center">Row 1 - Column&nbsp;2</p>'+
                    '</div></div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '22':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; ">Header</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 202.48px; width: 661.48px; height: 476.18px; text-align: left; position: absolute; z-index: 2138483647; ">'+
                    '<p style="text-align:center">Row 2 - Column&nbsp;1</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; ">Footer</div>'+
                    '<div style="left: 0.44px; top: 65.4px; width: 940.44px; height: 137.18px; position: absolute; z-index: 2138483647; ">'+
                    '<div class="h-mid" style="text-align: center;">&nbsp;</div>'+
                    '<div class="h-mid" style="text-align: center;"><p>Row 1</p></div></div>'+
                    '<div style="left: 660px; top: 201px; width: 279px; height: 476.18px; position: absolute; z-index: 80000; ">'+
                    '<div class="h-mid" style="text-align: center;">'+
                    '<p style="text-align:center">Row 2 - Column&nbsp;2</p>'+
                    '</div></div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '21':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; ">Header</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0.87px; top: 267.64px; width: 941.62px; height: 409px; text-align: left; position: absolute; z-index: 2138483647; ">'+
                    '<p style="text-align:center">Row 2 - Column 1</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; ">Footer</div>'+
                    '<div style="left: 0.44px; top: 65.4px; width: 941.74px; height: 203.38px; position: absolute; z-index: 2138483647; ">'+
                    '<div class="h-mid" style="text-align: center;">&nbsp;</div>'+
                    '<div class="h-mid" style="text-align: center;">Row 1 - Column 1</div>'+
                    '</div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '11img':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; ">Header</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 65.14px; width: 940.85px; height: 228.78px; text-align: left; position: absolute; z-index: 2138483647; ">'+
                    '<p style="font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">Row 1 - Column 1 - <br/> Insert the image by pasting the url in the HTML code in the last div section after source=</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 2.02366px; top: 667.247px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; ">Footer</div>'+
                    '<div style="left: 1.25px; top: 304px; width: 938.96px; height: 360.72px; position: absolute; z-index: 2138483647; ">'+
                    '<div class="h-mid" style="text-align: center;">'+
                    '<p style="text-align:center"><img alt="" height="322" src="http://fileservice.stable.slidewiki.org/2355/a5527130-f9b1-11e6-8593-f7fb03f4bfc1.jpg" width="408" /></p>'+
                    '<p>&nbsp;</p></div></div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
        }
        this.emitChange(); //confirm non-save on-leave
        //this.addBorders();
        this.uniqueIDAllElements();
        this.resizeDrag();
        this.forceUpdate();
    }
    handleCKeditorModeButton(){
        if (this.CKeditorMode === 'advanced toolbar'){
            console.log('current CKeditor toolbar mode is basic - set to advanced');
            CKEDITOR.instances.inlineContent.destroy();
            CKEDITOR.inline('inlineContent', {
                customConfig: '/assets/ckeditor_config.js',
                filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + this.props.UserProfileStore.userid,
                uploadUrl: Microservices.import.uri + '/importImagePaste/' + this.props.UserProfileStore.userid}); //leave all buttons

            this.CKeditorMode = 'basic toolbar';
        }
        else {
            console.log('current CKeditor toolbar mode is advanced - set to basic');
            CKEDITOR.instances.inlineContent.destroy();
            CKEDITOR.inline('inlineContent', {
                customConfig: '/assets/ckeditor_config_basic.js',
                filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + this.props.UserProfileStore.userid,
                uploadUrl: Microservices.import.uri + '/importImagePaste/' + this.props.UserProfileStore.userid}); //leave all buttons
            this.CKeditorMode = 'advanced toolbar';
        }
        CKEDITOR.instances.inlineContent.on('instanceReady', (evt) => {
            if (this.refs.inlineContent.innerHTML.includes('pptx2html'))
            {
                this.forceUpdate();
                //this.addBorders();
                this.resizeDrag();
                $('.cke_button__sourcedialog_label').mousedown((evt) => { //detect click on source dialog button
                    //remove resize and drag interaction because it generates HTML in slide editor content
                    this.disableResizeDrag();
                    console.log('====ckeditor on change====');
                    //add time because dialog needs to be generate/added to page before mousedown handler can be assigned to "OK" button with class cke_dialog_ui_button_ok
                    setTimeout(() => {
                        $('.cke_dialog_ui_button_ok').mouseup((evt) => { //detect click on "OK" in source dialog button
                            console.log('====ckeditor save button ok==== - refresh drag and menus');
                            //this.addBorders();
                            setTimeout(() => {
                                this.resizeDrag();
                                //this.forceUpdate();
                            }, 500);
                        });
                    }, 500);
                });
            }
        });

    }
    uniqueIDAllElements(){
        let allElements = this.refs.inlineContent.getElementsByTagName('*');
        let allIds = [];
        for (let i = 0, n = allElements.length; i < n; ++i) {
            let random = Math.floor((Math.random() * 100000) + 1);
            let el = allElements[i];
            if (el.id && allIds.indexOf(el.id) !== -1) { allIds.push(el.id); }
            else {el.id = random; allIds.push(random);}
        }
    }
    handleSaveButton(){
        if (this.props.UserProfileStore.username !== '') {
            // Replace the onbeforeunload function by a Blank Function because it is not neccesary when saved.
            // TODO: wait for successfull save signal from
            swal({
                title: 'Saving Content...',
                text: '',
                type: 'success',
                timer: 1000,
                showCloseButton: false,
                showCancelButton: false,
                allowEscapeKey: false,
                showConfirmButton: false
            });
            //remove editing borders input boxes:
            $('.pptx2html [style*="absolute"]')
            .css({'borderStyle': '', 'borderColor': ''});
            $('.pptx2html')
            .css({'borderStyle': '', 'borderColor': '', 'box-shadow': ''});
            //reset scaling of pptx2html element to get original size
            $('.pptx2html').css({'transform': '', 'transform-origin': ''});
            this.removeEditMode();
            this.contextMenuAllRemove();
            this.disableResizeDrag();
            CKEDITOR.instances.inlineContent.destroy();

            this.uniqueIDAllElements();
            let title = (this.props.SlideEditStore.title !== '') ? this.props.SlideEditStore.title : ' ';
            let content = (this.refs.inlineContent.innerHTML !== '') ? this.refs.inlineContent.innerHTML : ' ';
            let speakernotes = (this.refs.inlineSpeakerNotes.innerHTML !== '') ? this.refs.inlineSpeakerNotes.innerHTML : ' ';
            //update store
            this.props.SlideEditStore.title = title;
            this.props.SlideEditStore.content = content;
            this.props.SlideEditStore.speakernotes = speakernotes;
            let currentSelector = this.props.selector;
            let deckID = currentSelector.id;
            let dataSources = (this.props.DataSourceStore.dataSources !== undefined) ? this.props.DataSourceStore.dataSources : [];
            let tags = this.props.SlideViewStore.tags? this.props.SlideViewStore: [];

            this.context.executeAction(saveSlide, {
                id: currentSelector.sid,
                deckID: deckID,
                title: title,
                content: content,
                speakernotes: speakernotes,
                dataSources: dataSources,
                selector: currentSelector,
                tags: tags
            });
            this.resize();
        }
        return false;
    }
    disableResizeDrag(){
        $('.pptx2html [style*="absolute"]').each(function () {
            if($(this).draggable( 'instance' )){$(this).draggable('destroy');}
            if($(this).resizable( 'instance' )){$(this).resizable('destroy');}
            $(this).css('cursor', 'auto');
            $(this).css('box-shadow','');
        });
    }
    getHighestZIndex(){
        let index_highest = 0;
        $('.pptx2html [style*="absolute"]').each(function() {
            let index_current = parseInt($(this).css('zIndex'), 10);
            if(index_current > index_highest) {
                index_highest = index_current;
            }
        });
        //cEl.style.zIndex = index_highest + 10;
        return index_highest;
    }
    getLowestZIndex(){
        let index_lowest = 9999999999;
        $('.pptx2html [style*="absolute"]').each(function() {
            let index_current = parseInt($(this).css('zIndex'), 10);
            if(index_current < index_lowest) {
                index_lowest = index_current;
            }
        });
        //cEl.style.zIndex = index_highest + 10;
        return index_lowest;
    }
    addAbsoluteDiv() {
        //absolutediv
        //Check if content already has canvas/absolute positioning
        //TODO replace with this.refs.inlineContent.innerHTML
        //if (typeof(CKEDITOR.instances.inlineContent) !== 'undefined' && CKEDITOR.instances.inlineContent.getData().indexOf('pptx2html') !== -1)
        if (this.refs.inlineContent.innerHTML.includes('pptx2html'))
        { // if pptx2html element with absolute content is in slide content (underlying HTML)
            //$('.pptx2html').append(this.getAbsoluteDiv(index_highest + 10));
            $('.pptx2html').append(this.getAbsoluteDiv(this.getHighestZIndex() + 10));
            //.css({'borderStyle': 'dashed dashed dashed dashed', 'borderColor': '#33cc33'});
            this.emitChange(); //confirm non-save on-leave
            this.uniqueIDAllElements();
            this.resizeDrag();
            this.forceUpdate();
        } else { //if slide does not have pptx2html/canvas/absolute positioning
            swal({
                title: 'Switch to canvas style layout',
                text: 'This will add input boxes to your slide which can be moved and resized. Your existing content will be placed in one input box. You will then be able to add new input boxes to separate existing content or add new boxes. Do you wish to continue?',
                type: 'question',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes, switch to canvas-style with input boxes',
                confirmButtonClass: 'ui olive button',
                cancelButtonText: 'No',
                cancelButtonClass: 'ui red button',
                buttonsStyling: false
            }).then((accepted) => {
                //TODO replace with this.refs.inlineContent.innerHTML
                //let currentContent = CKEDITOR.instances.inlineContent.getData();
                //let newContent =
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1,1); transform-origin: left top 0px;">' +
                '<p></p><p></p><p></p><p></p><p></p><div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="position: absolute; top: 10px; left: 10px; width: 940px; height: 700px; z-index: 2138483647; ">' +
                '<div class="h-left">' + this.refs.inlineContent.innerHTML + '</div>' +
                '</div>' +
                '</div>';
                //update content
                //TODO replace with this.refs.inlineContent.innerHTML
                //CKEDITOR.instances.inlineContent.setData(newContent);
                this.inputBoxButtonTitle = 'Add input box';
                this.emitChange(); //confirm non-save on-leave
                this.forceUpdate();
                this.resizeDrag();
            }, (reason) => {
                //done(reason);
            });
        }

    }
    getAbsoluteDiv(zindex){
        //return '<div style="position: absolute; top: 50px; left: 100px; width: 400px; height: 200px; z-index: '+zindex+';"><div class="h-mid" style="text-align: center;"><span class="text-block h-mid" style="color: #000; font-size: 44pt; font-family: Calibri; font-weight: initial; font-style: normal; ">New content</span></div></div>';
        return '<div style="position: absolute; top: 50px; left: 100px; width: 400px; height: 200px; z-index: '+zindex+';"><div class="h-left"><span class="text-block" ">New content</span></div></div>';
    }
    componentDidMount() {

        //TODO replace with context.getUser();
        const userId = this.props.UserProfileStore.userid;
        //TODO: needs sharedspace plugin for proper positioning of inline toolbars + http://ckeditor.com/addon/closebtn plugin for closing inline editor

        //destroy previous ckeditor-plugins
        if (CKEDITOR.instances.inlineContent != null) {
            console.log('destroy previous CKEDITOR instance');
            CKEDITOR.instances.inlineContent.destroy();
        }
        if (CKEDITOR.instances.inlineSpeakerNotes != null)  {
            console.log('destroy previous CKEDITOR instance');
            CKEDITOR.instances.inlineSpeakerNotes.destroy();
        }

        //TODO: takes some time before font-size and other drop-downs work... or immediately when clicking in inline input
        CKEDITOR.disableAutoInline = true;
        //if (typeof(CKEDITOR.instances.inlineSpeakerNotes) === 'undefined'){
        CKEDITOR.inline('inlineSpeakerNotes', {
            customConfig: '/assets/ckeditor_config_basic.js',
            toolbarGroups: [
                //needed for Chrome initialization
                { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                { name: 'styles', items: [ 'FontSize' ] },
                { name: 'insert', items: [ 'Image'] },
                { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter'] },
            ],
            //floatSpacePreferRight: true,
            //uiColor: '#4183C4',
            //removeButtons: 'Youtube,MathJax,Sourcedialog,CodeSnippet,Source,Save,NewPage,Preview,Print,Templates,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Button,Select,HiddenField,ImageButton,Subscript,Superscript,RemoveFormat,NumberedList,Outdent,BulletedList,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Maximize,ShowBlocks,About',
            filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId,
            uploadUrl: Microservices.import.uri + '/importImagePaste/' + userId
        });
        //}
        //if (typeof(CKEDITOR.instances.inlineContent) === 'undefined'){
            //const userId = this.props.UserProfileStore.userid;
            // CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: 'http://localhost:4000/importImage/' + userId, customConfig: '../../../../../../assets/ckeditor_config.js'});
            //CKEDITOR.inline('inlineContent', {customConfig: '../../../../../../assets/ckeditor_config.js'});
            //CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId, customConfig: '../../../../../../assets/ckeditor_config.js'});
            //CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId, customConfig: '../../../../../../custom_modules/ckeditor/config.js'});
        CKEDITOR.inline('inlineContent', {
            //CKEDITOR.replace('inlineContent', {
            //customConfig: '/assets/ckeditor_config.js',
            customConfig: '/assets/ckeditor_config_basic.js',
            toolbarGroups: [
                //needed for Chrome initialization
                { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                { name: 'styles', items: [ 'FontSize' ] },
                { name: 'insert', items: [ 'Image'] },
                { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter'] },
            ],
            filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId,
            uploadUrl: Microservices.import.uri + '/importImagePaste/' + userId
        }); //leave all buttons
        //this.currentcontent = this.props.content;

        CKEDITOR.instances.inlineContent.on('instanceReady', (evt) => {
            this.resize();
            this.uniqueIDAllElements();

            //SWIK-1238 - detect change to source code via source dialog plugin
            //console.log($( ".cke_dialog_ui_button_ok" ).innerHTML);
            //$( ".cke_dialog_ui_button_ok" ).click(function() {
            //    console.log( "Handler for .click() called." );
            //});
            //CKEDITOR.instances.inlineContent.on('change', function(){console.log('change');});
            //console.log('inlineConent CKeditor ready' + CKEDITOR.instances.inlineContent);
            //if (!CKEDITOR.instances.inlineContent)

            /*
            if (typeof(CKEDITOR.instances.inlineContent) === 'undefined')
            {
                //CKEDITOR.instances.inlineContent.destroy();
                CKEDITOR.inline('inlineContent', {
                    //customConfig: '/assets/ckeditor_config.js',
                    customConfig: '/assets/ckeditor_config_basic.js',
                    filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId,
                    uploadUrl: Microservices.import.uri + '/importImagePaste/' + userId}); //leave all buttons

            }
            */

            if (this.refs.inlineContent.innerHTML.includes('pptx2html'))
            {
                this.forceUpdate();
                //this.addBorders();
                this.resizeDrag();
                //console.log('resizeDrag and borders');
                //show that content is outside of pptx2html box
                //$('.pptx2html').css({'borderStyle': 'none none double none', 'borderColor': '#3366ff', 'box-shadow': '0px 100px 1000px #ff8787'});
                $('.pptx2html').css({'borderStyle': 'double', 'borderColor': 'rgba(218,102,25,0.5)'});
            }
            if(document.domain !== 'localhost')
            {
                document.domain = 'slidewiki.org';
            }
        });
        //fix bug with speakernotes overlapping soure dialog/other elements - SWIK-832
        $('#inlineSpeakerNotes [style*="absolute"]').css({'position': 'relative', 'zIndex': '0'});

        ReactDOM.findDOMNode(this.refs.container).addEventListener('resize', (evt) => {
            if(process.env.BROWSER){
                this.resize();
                //this.forceUpdate();
            }
        });
    }
    resizeDrag(){
        //http://jqueryui.com/resizable/
        //http://interface.eyecon.ro/docs/resizable

        // TODO -> create SVG around draggable element with points/blocks for resize handlers
        // OR by emulating textarea - http://stackoverflow.com/questions/18427555/jquery-textarea-draggable
        // or: make images JQUERY draggable, and have original button for text input  - too complex
        //<g><path fill="#000" fill-opacity="0" stroke="#000" stroke-opacity="0" stroke-width="10550.76923076923" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" pointer-events="visiblePainted" d="M 4331 28073 L 318671 28073 318671 170081 4331 170081 Z"></path></g>
        // TODO: Make background outside slide grey!

        //***************position mode - default/start//***************

        let slideEditorContext = this; //set slideEditorContext inside doubleclick callbacks

        $('.pptx2html [style*="absolute"]').not('.drawing').css('cursor', 'move');

        $('.pptx2html [style*="absolute"]').not('.drawing').hover(function() { //no dragging of SVG - makes them go away
            if (!$(this).hasClass('editMode')) {
                //if(!$('.editMode').draggable( 'instance' )){$(this).draggable({cursor: 'move'});}
                if(!$('.editMode').draggable( 'instance' )){
                    $(this).draggable({
                        cursor: 'move',
                        //handle: '.drag-handle',
                        start: function(event, ui) {
                            ui.position.left = 0;
                            ui.position.top = 0;
                        },
                        drag: function(event, ui) {
                            let changeLeft = ui.position.left - ui.originalPosition.left; // find change in left
                            let newLeft = ui.originalPosition.left + changeLeft / (( slideEditorContext.scaleratio)); // adjust new left by our zoomScale
                            let changeTop = ui.position.top - ui.originalPosition.top; // find change in top
                            let newTop = ui.originalPosition.top + changeTop / slideEditorContext.scaleratio; // adjust new top by our zoomScale
                            ui.position.left = newLeft;
                            ui.position.top = newTop;
                        }
                    });
                }
                //if(!$('.editMode').resizable( 'instance' )){$(this).resizable({handles: 'all', scroll: true});}
                if(!$('.editMode').resizable( 'instance' )){
                    $(this).resizable({
                        handles: 'all',
                        scroll: true,
                        minWidth: -($(this).width()) * 10,  // these need to be large and negative
                        minHeight: -($(this).width()) * 10, // so we can shrink our resizable while scaled
                        resize: function(event, ui) {
                            let changeWidth = ui.size.width - ui.originalSize.width; // find change in width
                            let newWidth = ui.originalSize.width + changeWidth / slideEditorContext.scaleratio; // adjust new width by our zoomScale
                            let changeHeight = ui.size.height - ui.originalSize.height; // find change in height
                            let newHeight = ui.originalSize.height + changeHeight / slideEditorContext.scaleratio; // adjust new height by our zoomScale
                            //console.log(ui.size.width + ' ' + newWidth + ' ' + ui.size.height + ' ' + newHeight);
                            ui.size.width = newWidth;
                            ui.size.height = newHeight;
                        }
                    });
                };
                //$(this).css({'box-shadow':'0 0 15px 5px rgba(81, 203, 238, 1)'});
                $(this).css({'box-shadow':'0 0 15px 5px rgba(0, 150, 253, 1)'});
            }
            else {
                $(this).css({'box-shadow':'0 0 15px 5px rgba(218, 102, 25, 1)'});
            }
        }, function() {
            if (!$(this).hasClass('editMode'))
            {
                $(this).css('box-shadow','');
            }
            //$(this).not('.drawing-container').css({'borderStyle': '', 'borderWidth': '', 'borderColor': ''});
        });
        $('.pptx2html [style*="absolute"]').not('.drawing').keyup((event) => {
            if( event.which === 9 ) { //if tabkey
                console.log( event.target.id );
                console.log('tabFocus');
                //let id = $(':focus').attr('id');
                let id = event.target.id;
                if (!id || id === 'inlineContent'){id = this.menuFocus; console.log('used menuFocus');}
                if (id && id !== 'inlineContent')
                {
                    if(!$('#'+id).hasClass('editMode')){
                        if($('.editMode').length)
                        {   //there is one or more editMode element (earlier via doubleclick)
                            //we disable edit mode from the(se) element(s).
                            this.removeEditMode();
                        }
                    }
                    this.menuFocus = id;
                    console.log('tabFocus set to: ' + id + ' - this.menufocus:'+ this.menuFocus + 'slideEditorContext.menufocus:'+  slideEditorContext.menuFocus);
                    $('.pptx2html [style*="absolute"]').css({'box-shadow':''}); //remove existing box-shadows
                    //$('#' + id).css({'box-shadow':'0 0 15px 5px rgba(81, 203, 238, 1)'});
                    $('#' + id).css({'box-shadow':'0 0 15px 5px rgba(0, 150, 253, 1)'});
                }
            }
        });
        //TODO: http://chrispearce.co/exploring-hotkeys-and-focus-in-react/

        /*
        $('.pptx2html [style*="absolute"]').focusin(function(event) {
            event.preventDefault();
        }, function() {
        });
        */

        //$('.pptx2html [style*="absolute"]').click(function() {
        $('.pptx2html [style*="absolute"]').not('.drawing').mousedown(function(event) {
            switch (event.which) {
                case 1:
                    console.log('Left Mouse button pressed.');
                    //$('.cke_menu').hide();
                    if ($(this).attr('id') !== 'inlineContent')
                    {
                        slideEditorContext.menuFocus = $(this).attr('id');
                        console.log('this.menuFocus: ' + slideEditorContext.menuFocus + 'should be ' + $(this).attr('id'));
                        if (!$(this).hasClass('editMode'))
                        { //the clicked element is not editMode
                            console.log('hide ckeditor context menu');
                            $('.cke_menu').hide();
                            if($('.editMode').length)
                            {   //there is one or more editMode element (earlier via doubleclick)
                                //we disable edit mode from the(se) element(s).
                                slideEditorContext.removeEditMode();
                            }
                        }
                    }
                    break;
                case 2:
                    console.log('Middle Mouse button pressed.');
                    break;
                case 3:
                    console.log('Right Mouse button pressed.');
                    //event.preventDefault();
                    if ($(this).attr('id') !== 'inlineContent')
                    {
                        slideEditorContext.menuFocus = $(this).attr('id');
                        console.log('this.menuFocus: ' + slideEditorContext.menuFocus + 'should be ' + $(this).attr('id'));
                        if (!$(this).hasClass('editMode'))
                        {
                            $('.pptx2html [style*="absolute"]').css({'box-shadow':''}); //remove existing box-shadows
                            //$(this).css({'box-shadow':'0 0 15px 5px rgba(81, 203, 238, 1)'});
                            $(this).css({'box-shadow':'0 0 15px 5px rgba(0, 150, 253, 1)'});
                            console.log('hide ckeditor context menu');
                            $('.cke_menu').hide();
                            //set cursor to
                            slideEditorContext.previousCaretRange = slideEditorContext.getMouseEventCaretRange(event);
                            //slideEditorContext.selectRange(caretRange);
                            //also need to get + store previous caretrange for context menu
                            //console.log('caretrange: ' + caretRange + evt.clientX + evt.clientY);
                            //let caretRange = this.getMouseEventCaretRange(evt);
                            // Set a timer to allow the selection to happen and the dust settle first
                            //window.setTimeout(function() {
                            //CKEDITOR.instances.inlineContent.destroy();
                            //slideEditorContext.refs.inlineContent.contentEditable = false;
                            //CKEDITOR.instances.inlineContent.hide();
                        }
                        else {
                            context.removeEditMode();
                        }
                        //$(this).focus();
                    }
                    break;
                default:
                    break;
            }

        });


        //give each input element a tab index
        //$('.pptx2html [style*="absolute"]').each(function (i) { $(this).attr('tabindex', i + 1); });
        //$('.pptx2html [style*="absolute"]').each(function () { if ($(this).attr('tabindex') !== ''){$(this).attr('tabindex', 0);} });
        $('.pptx2html [style*="absolute"]').not('.drawing').each(function () { if ($(this).attr('tabindex') !== ''){$(this).attr('tabindex', 0);} });
        //give each input box element a context menu (hide/overlap CKeditor context menu)
        this.contextMenuAll();

        //***************content mode//***************
        //TODO: on undo (ctr-l Z) - restore resize/drag elements previously removed
        //TODO: on editing source in CKeditor - restore resize/drag elements
        //TODO: caret position is reset in firefox, except for when typing
        //TODO: call emitChange() for new actions
        //TODO: if you select an element and starty typing: then directly switch to edit mode

        //set double click event for input box - ondoubleclick - remove dragable and set cursor to auto for editing content
        $('.pptx2html [style*="absolute"]').not('.drawing').dblclick(function(evt) {
            if (!$(this).hasClass('editMode'))
            {
                slideEditorContext.setEditMode(evt, slideEditorContext, $(this).attr('id'), false);
            }
        });
    }
    removeEditMode(){
        //$(this).focus();
        // re-apply draggable to editMode element
        if ($('.editMode').length){
            if(!$('.editMode').draggable( 'instance' )){$('.editMode').draggable({cursor: 'move'});}
            $('.editMode').css('cursor', 'pointer');
            $('.editMode').css('box-shadow','');
            //$('.cke_menu').show();
            $('.cke_menu').hide();
            $('.editMode').contextMenu(true);
            $('.editMode').removeClass('editMode');
        }
    }
    setEditMode(evt, slideEditorContext, clickMenuFocus, previousCaret){
        console.log('editmode with event: ' + evt);
        let id = $(':focus').attr('id');
        //let id = this.currentfocus;
        //let id = $('.currentFocus').attr('id');
        if (clickMenuFocus){
            //if right-click context menu has selected an input box object
            id = clickMenuFocus;
            console.log('right-click context menu or dblclick has selected an input box - clickMenuFocusId: ' + id);
            if($('#'+id).css('position') === 'absolute'){
                console.log('position of menufocus' + $('#'+clickMenuFocus).css('position'));
            }
        } else if (slideEditorContext.menuFocus) {
            id = slideEditorContext.menuFocus;
            console.log('menufocus via shortkey and/or tabindex - clickMenuFocusId: ' + id);
        }
        //id on which edit mode is applied
        console.log('seteditmode with id: ' + id);
        if(id !== 'inlineContent')
        {
            $('.context-menu-list').trigger('contextmenu:hide'); //hide any active context menu
            slideEditorContext.removeEditMode(); //remove existing edit mode from existing elements

            if(!$('#'+id).hasClass('.editMode') &&
               !$('#'+id).hasClass('drawing-container') &&
                id !== 'inlineContent')
            { //if not already in edit mode or is not SVG in drawing-container
                $('.cke_menu').show();
                console.log('disable extra context menu with id: ' + id );
                $('#'+id).contextMenu(false);

                if (evt)
                {//if not already in input mode
                    if(evt.keyCode){ //if keyboard event
                        evt.preventDefault(); //do not fire enter key for changing content via contenteditable/Ckeditor
                        //set caret to start of text (span) in last selected div element
                        slideEditorContext.placeCaretAtStart(id);
                    }
                    else {
                        let caretRange = slideEditorContext.getMouseEventCaretRange(evt);
                        //console.log('caretrange: ' + caretRange + evt.clientX + evt.clientY);
                        //let caretRange = this.getMouseEventCaretRange(evt);
                        // Set a timer to allow the selection to happen and the dust settle first
                        //window.setTimeout(function() {
                        slideEditorContext.selectRange(caretRange);
                        //this.selectRange(caretRange);
                        //}, 10);
                    }
                }
                else {
                    //event is false = right-click context menu was used
                    if (previousCaret){
                        slideEditorContext.selectRange(previousCaret);
                    } else {
                        //set caret to start of text (span) in last selected div element
                        slideEditorContext.placeCaretAtStart(id);
                    }
                }
                if($('#' + id).draggable( 'instance' )){$('#' + id).draggable('destroy');}
                $('#' + id).css('cursor', 'auto');
                $('#' + id).addClass('editMode');
                // TODO:  restore draggable after pressing 'esc' key
                $('#' + id).css({'box-shadow':'0 0 15px 5px rgba(218, 102, 25, 1)'});
                console.log('set edit mode end, with currentfocus: ' + id);
            }
        }
        else {
            console.log('editmode canceled due to selection of inlineContent');
        }
    }
    placeCaretAtStart(id) {
        console.log('placeCaretAtStart');
        let el = $('#'+id).find('span:first').not('.cke_widget_wrapper')[0];
        console.log(el);
        if(!el){el = $('#'+id).find('p:first')[0];console.log('id + find first span not found'); console.log('try id + find first p');}
        if(!el){el = $('#'+id).find('div:first').not('.ui-resizable-handle')[0];console.log('try id + find first div not ui-resizable');}
        if(!el){el = $('#'+id).find('img:first')[0];console.log('try id + find first img');
        //if ($('#'+id).find('img:first')[0])
            if (el)
            {console.log('create surrounding div so image can be selected with keyboard');
                let emptySpan = document.createElement('span');
                emptySpan.innerHTML = '';
                $('#'+id).prepend(emptySpan);
                el = $('#'+id).find('span:first').not('.cke_widget_wrapper')[0];
            }
        }
        if(!el){el = $('#'+id)[0];console.log('id directly');}
        if(!el){el = $(':focus').find('span:first')[0];console.log('try focus find span first 0');}
        //if(!el){el = $(':focus');console.log('id of focus');}
        if(!el){console.log('nothing found, create span element');
            let emptySpan = document.createElement('span');
            emptySpan.innerHTML = '';
            $('#'+id).prepend(emptySpan);
            el = $('#'+id).find('span:first').not('.cke_widget_wrapper')[0];
        }
        el.focus();
        if (typeof window.getSelection != 'undefined'
                && typeof document.createRange != 'undefined') {
            let range = document.createRange();
            try{
                range.selectNodeContents(el);
            } catch(error){
                console.log('selectNodeContents - error');
                console.log('reset context menu');
                $('#'+id).contextMenu(true);
                return false;
            }
            //range.collapse(false);
            range.collapse(true);
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != 'undefined') {
            let textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }
    getMouseEventCaretRange(evt) {
        let range, x = evt.clientX, y = evt.clientY;
        // Try the simple IE way first
        if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToPoint(x, y);
        }
        else if (typeof document.createRange != 'undefined') {
            // Try Mozilla's rangeOffset and rangeParent properties,
            // which are exactly what we want
            if (typeof evt.rangeParent != 'undefined') {
                range = document.createRange();
                range.setStart(evt.rangeParent, evt.rangeOffset);
                range.collapse(true);
            }
            // Try the standards-based way next
            else if (document.caretPositionFromPoint) {
                let pos = document.caretPositionFromPoint(x, y);
                range = document.createRange();
                range.setStart(pos.offsetNode, pos.offset);
                range.collapse(true);
            }
            // Next, the WebKit way
            else if (document.caretRangeFromPoint) {
                range = document.caretRangeFromPoint(x, y);
            }
        }
        return range;
    }
    selectRange(range) {
        if (range) {
            if (typeof range.select != 'undefined') {
                range.select();
            } else if (typeof window.getSelection != 'undefined') {
                let sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }
    contextMenuAllRemove(){
        $('.pptx2html [style*="absolute"]').each(function () {
            $(this).contextMenu(false);
        });
    }
    contextMenuAll(){
        let slideEditorContext = this;
        //https://github.com/swisnl/jQuery-contextMenu
        //http://swisnl.github.io/jQuery-contextMenu/
        $('.pptx2html [style*="absolute"]').each(function () {
            //if(!$(this).draggable( 'instance' )){
            console.log('menu for: ' + $(this).attr('id'));
            $.contextMenu({
            //$('.pptx2html').contextMenu({
                // define which elements trigger this menu
                //selector: '.pptx2html [style*="absolute"]',
                selector: '#'+$(this).attr('id'),
                // define the elements + functions of the menu
                callback: function(key, options) {
                    console.log('context menu clicked: ' + key +  'on'  + $(this).text());
                    switch (key) {
                        case 'edit':
                            //slideEditorContext.setEditMode(key, slideEditorContext, slideEditorContext.menuFocus);
                            slideEditorContext.setEditMode(false, slideEditorContext, slideEditorContext.menuFocus, slideEditorContext.previousCaretRange);
                            break;
                        case 'front':
                            slideEditorContext.bringToFront(slideEditorContext, false);
                            break;
                        case 'back':
                            slideEditorContext.sendToBack(slideEditorContext, false);
                            break;
                        case 'copy':
                            slideEditorContext.CopyNode(slideEditorContext, false);
                            break;
                        case 'delete':
                            slideEditorContext.deleteNode(slideEditorContext, false);
                            break;
                        case 'quit':
                            break;
                        default:
                    }
                },
                items: {
                    'edit': {name: 'Edit (key: Ctrl enter)', icon: 'edit'},
                    //'move': {name: 'Move around', icon: 'fa-arrows',},
                    'front': {name: 'Bring to front (Ctrl-shift +)', icon: 'fa-arrow-circle-up'},
                    'back': {name: 'Send to back (Ctrl-shift -)', icon: 'fa-arrow-circle-o-down'},
                    'copy': {name: 'Copy (key: Ctrl c)', icon: 'copy'},
                    'delete': {name: 'Delete (key: Delete)', icon: 'delete'},
                    //'sep1': '---------',
                    'quit': {name: 'Close menu (key: Esc)', icon: 'quit', accesskey: 'esc'}
                    //'quit': {name: 'Send to back', icon: 'quit'},
                }
            });
            $(this).contextMenu(true);
            //}
        });
    }

    componentDidUpdate() {
        if(typeof(CKEDITOR.instances.inlineContent) !== 'undefined' && CKEDITOR.instances.inlineContent.getData().indexOf('pptx2html') !== -1)
        { // if pptx2html element with absolute content is in slide content (underlying HTML)
            this.inputBoxButtonTitle = 'Add input box';
        } else { //if slide does not have pptx2html/canvas/absolute positioning
            this.inputBoxButtonTitle = 'Switch to canvas with input boxes';
        }
    }
    addBorders() { //not used at the moment
        //do not put borders around empty divs containing SVG elements
        //if ($('.pptx2html [style*="absolute"]').not('.drawing-container').css('borderStyle') !== 'dashed') {
        if ($('.pptx2html [style*="absolute"]').not('.drawing-container').css('borderStyle') !== 'solid') {
            //$('.pptx2html [style*="absolute"]').not('.drawing-container').css({'borderStyle': 'dashed', 'borderColor': '#33cc33'});
            $('.pptx2html [style*="absolute"]').not('.drawing-container').css({'borderStyle': 'solid', 'borderWidth': '1px', 'borderColor': 'rgba(30,120,187,0.5)'});
        }
    }
    keyContextMenu(event, context){
        let id = $(':focus').attr('id');
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        console.log('keyContextMenu id: ' + id);
        if(!$('#'+id).hasClass('editMode')){
            if(event){event.preventDefault();}
            $('#'+id).contextMenu();
        }
    }

    /*
    setTabFocus(event, context){
        //if($('.pptx2html [style*="absolute"]:focus').length)
        //{
        console.log('tabFocus');
        let id = $(':focus').attr('id');
        if (!id || id === 'inlineContent'){id = context.menuFocus; console.log('used menuFocus');}
        if(!$('#'+id).hasClass('editMode')){
            if($('.editMode').length)
            {   //there is one or more editMode element (earlier via doubleclick)
                //we disable edit mode from the(se) element(s).
                context.removeEditMode();
            }
        }
        context.menuFocus = id;
        console.log('tabFocus set for: ' + $(':focus').attr('id'));
        $('.pptx2html [style*="absolute"]').css({'box-shadow':''}); //remove existing box-shadows
        //$('#' + id).css({'box-shadow':'0 0 15px 5px rgba(81, 203, 238, 1)'});
        $('#' + id).css({'box-shadow':'0 0 15px 5px rgba(0, 150, 253, 1)'});
        //else {
            //set caret at start position
        //    setEditMode(event, context);
        //}
    }
    */
    keyMoveUp(context, event){
        //TODO: detect whether context menu is shown
        console.log('keyup');
        let id = $(':focus').attr('id');
        //if(!$('#'+id).hasClass('editMode')){
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        if(!$('.editMode').length && !$('#'+id).hasClass('context-menu-active') && id !== 'inlineContent'){
            //console.log('keyup not in edit mode + preventdefault');
            if(event){event.preventDefault();}
            $('#'+id).css('top', '-=10');
            context.emitChange(); //confirm non-save on-leave
        }
    }
    keyMoveDown(context, event){
        console.log('keyup');
        let id = $(':focus').attr('id');
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        if(!$('.editMode').length && !$('#'+id).hasClass('context-menu-active') && id !== 'inlineContent'){
            if(event){event.preventDefault();}
            //console.log('keyup not in edit mode + preventdefault');
            $('#'+id).css('top', '+=10');
            context.emitChange(); //confirm non-save on-leave
        }
    }
    keyMoveLeft(context, event){
        let id = $(':focus').attr('id');
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        if(!$('.editMode').length && !$('#'+id).hasClass('context-menu-active') && id !== 'inlineContent'){
            if(event){event.preventDefault();}
            $('#'+id).css('left', '-=10');
            context.emitChange(); //confirm non-save on-leave
        }
    }
    keyMoveRight(context, event){
        let id = $(':focus').attr('id');
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        if(!$('.editMode').length && !$('#'+id).hasClass('context-menu-active') && id !== 'inlineContent'){
            if(event){event.preventDefault();}
            $('#'+id).css('left', '+=10');
            context.emitChange(); //confirm non-save on-leave
        }
    }
    bringToFront(context, event){
        $('.context-menu-list').trigger('contextmenu:hide'); //hide any active context menu
        let id = $(':focus').attr('id');
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        if(!$('#'+id).hasClass('editMode') &&  id !== 'inlineContent'){
            if(event){event.preventDefault();}
            $('#'+id).css('zIndex', context.getHighestZIndex() + 10);
            context.emitChange(); //confirm non-save on-leave
        }
    }
    sendToBack(context, event){
        $('.context-menu-list').trigger('contextmenu:hide'); //hide any active context menu
        let id = $(':focus').attr('id');
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        if(!$('#'+id).hasClass('editMode')){
            if(event){event.preventDefault();}
            $('#'+id).css('zIndex', context.getLowestZIndex() - 10);
            context.emitChange(); //confirm non-save on-leave
        }
    }
    CopyNode(context, event){
        $('.context-menu-list').trigger('contextmenu:hide'); //hide any active context menu
        let id = $(':focus').attr('id');
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        console.log('copy node' + id);
        if(!$('#'+id).hasClass('editMode') && !$('.editMode').length){
            if(event){event.preventDefault();}
            $('#'+id).clone().appendTo('.pptx2html');
            $('#'+id).css('top', '+=50');
            context.uniqueIDAllElements();
            context.resizeDrag();
            context.emitChange(); //confirm non-save on-leave
            //this.forceUpdate();
        }
    }
    deleteNode(context, event){
        $('.context-menu-list').trigger('contextmenu:hide'); //hide any active context menu
        let id = $(':focus').attr('id');
        if (!id){id = context.menuFocus;}
        if(!$('#'+id).hasClass('editMode') && !$('.editMode').length && !$('#'+id).hasClass('pptx2html') && id !== 'inlineContent'){
            if(event){event.preventDefault();}
            swal({
                title: 'Remove element',
                text: 'Are you sure you want to delete this element?',
                type: 'question',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                confirmButtonClass: 'ui olive button',
                cancelButtonText: 'No',
                cancelButtonClass: 'ui red button',
                buttonsStyling: false
            }).then((accepted) => {
                //if (!$(this).hasClass('pptx2html')){
                //if (!$('#'+id).hasClass('pptx2html') && id !== 'inlineContent'){
                console.log('delete node with id:' + id);
                if ($('.pptx2html [style*="absolute"]').length === 1)
                {
                    console.log('last element');
                    //add a div element to prevent empty PPTX element which gets removed by CKeditor
                    let emptydiv = document.createElement('div');
                    emptydiv.innerHTML = '';
                    //$('#'+id).parentNode.appendChild(emptydiv);
                    $('#'+id).parent().append(emptydiv);
                }
                //$(this).remove();
                $('#'+id).remove();
                context.emitChange(); //confirm non-save on-leave
                //}
            }, (reason) => {
                //done(reason);
            });
        }
    }
    /*
    menuOptionsPreventDefault(event, context){
        let id = $(':focus').attr('id');
        if (context.menuFocus){
            id = context.menuFocus;
        }
        console.log('prevent default 1-5 key if in context menu' + !$('.editMode').length + $('#'+id).hasClass('context-menu-active') + id);
        //if(!$('.editMode').length && $('#'+id).hasClass('context-menu-active')){
        //if(!$('.editMode').length){
        if(!$('.editMode').length && $('#'+id).hasClass('context-menu-active')){
            if(event){event.preventDefault();}
            console.log('prevent default 1-5 key');
        }
    }
    */
    keyEnter(event){
        $('.context-menu-list').trigger('contextmenu:hide'); //hide any active context menu
        let id = $(':focus').attr('id');
        console.log('prevent default enter key if not in edit mode' + !$('.editMode').length + $('#'+id).hasClass('context-menu-active') + id);
        //if(!$('.editMode').length && $('#'+id).hasClass('context-menu-active')){
        //if(!$('.editMode').length){
        if(!$('.editMode').length && $('#'+id).hasClass('context-menu-active')){
            if(event){event.preventDefault();}
            console.log('prevent default enter key');
        }
    }
    resize() {
        if($('.pptx2html').length)
        {
            let containerwidth = document.getElementById('container').offsetWidth;
            let containerheight = document.getElementById('container').offsetHeight;
            //reset scaling of pptx2html element to get original size
            $('.pptx2html').css({'transform': '', 'transform-origin': ''});
            //Function to fit contents in edit and view component
            let pptxwidth = $('.pptx2html').width();
            let pptxheight = $('.pptx2html').height();
            //TODO - change to get right!
            //this.scaleratio = containerwidth / (pptxwidth+50);
            this.scaleratio = containerwidth / (pptxwidth+120);
            $('.pptx2html').css({'transform': '', 'transform-origin': ''});
            $('.pptx2html').css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});
            //$('.pptx2html').animate({
            //    transform: 'scale(2)'
            //});
            console.log('scale with ratio: ' + this.scaleratio);

            //set height of content panel to at least size of pptx2html + (100 pixels * scaleratio).
            this.refs.slideEditPanel.style.height = ((pptxheight + 5 + 20) * this.scaleratio) + 'px';
            this.refs.inlineContent.style.height = ((pptxheight + 0 + 20) * this.scaleratio) + 'px';
        }
    }
    componentWillUnmount() {
        // Remove the warning window.
        window.onbeforeunload = () => {};
        CKEDITOR.instances.inlineContent.destroy();
        CKEDITOR.instances.inlineSpeakerNotes.destroy();
    }
    render() {
        //TODO: offer option to switch between inline-editor (alloy) and permanent/full editor (CKeditor)
        //TODO - remove use of id - Only use 'ref=' for React. Find CKeditor create function(s) that do not require id.
        //styles should match slideViewPanel for consistency
        //TODO - add zoomin button + restore button - see other slide editors
        //TODO - center editable screen + space above + below
        // When the component is rendered the confirmation is configured.
        // TODO: copy-paste elements based on ctrl-c / ctrl-v
        // TODO: keyboard focus and arrows to move; enter to start editing
        // TODO: move elements based on key-up / key-down / etc..

        const keyMap = {
            //'menuOptions': ['1', '2', '3', '4', '5', ],
            //'tabFocus': ['tab'],
            'contextmenu': ['ctrl+alt', 'alt+ctrl'],
            'deleteNode': ['del', 'backspace',
                'shift+del', 'shift+backspace',
                'ctrl+del', 'ctrl+backspace',
                'alt+del', 'alt+backspace'],
            'moveUp': ['up'],
            'moveDown': ['down'],
            'moveLeft': ['left'],
            'moveRight': ['right'],
            'bringToFront': [ 'ctrl+shift+plus'],
            'bringToBack': ['ctrl+shift+-'],
            'copy': ['ctrl+c'],
            'enter': ['ctrl+enter'],
            'escape': ['escape']
        };
        let slideEditorContext = this;
        const handlers = {
            //'menuOptions': (event) => this.menuOptionsPreventDefault(event, slideEditorContext),
            'contextmenu': (event) => this.keyContextMenu(event, slideEditorContext),
            //'tabFocus': (event) => this.setTabFocus(event, slideEditorContext),
            'enter': (event) => this.setEditMode(event, slideEditorContext, false , false),
            'deleteNode': (event) => this.deleteNode(slideEditorContext),
            'moveUp': (event) => this.keyMoveUp(slideEditorContext, event),
            'moveDown': (event) => this.keyMoveDown(slideEditorContext, event),
            'moveLeft': (event) => this.keyMoveLeft(slideEditorContext, event),
            'moveRight': (event) => this.keyMoveRight(slideEditorContext, event),
            'bringToFront': (event) => this.bringToFront(slideEditorContext, event),
            'bringToBack': (event) => this.sendToBack(slideEditorContext, event),
            'copy': (event) => this.CopyNode(slideEditorContext, event),
            'escape': (event) => {this.removeEditMode(); $('#' + this.menuFocus).focus(); $('#' + this.menuFocus).css({'box-shadow':'0 0 15px 5px rgba(0, 150, 253, 1)'});}
        };

        const headerStyle = {
            //minWidth: '100%',
            height: '0px',
            overflowY: 'auto',
            //borderStyle: 'dashed dashed none dashed',
            //borderColor: '#e7e7e7',
            position: 'relative'
        };
        const contentStyle = {
            minWidth: '100%',
            // maxHeight: 450,
            //padding: 10,
            paddingLeft: 50,
            paddingRight: 50,
            paddingTop: 10,
            xpaddingBottom: 10,
            minHeight: 610,
            overflowY: 'auto',
            overflowX: 'auto',
            //borderStyle: 'dashed',
            //borderColor: '#e7e7e7',
        };
        const speakernotesStyle = {
            maxHeight: 50,
            minHeight: 50,
            overflowY: 'auto',
            position: 'relative'
        };

        const buttonColorBlack = {
            color: 'black'
        };

        const compStyle = {
            // maxHeight: 450,
            //minHeight: 450,
            //overflowY: 'auto',
            //position: 'relative'
            //minWidth: '100%',
            // maxHeight: 450,
            //padding: 20,
            minHeight: 600,
            //minHeight: '100%',
            overflowY: 'auto',
            //overflowX: 'hidden',
            overflowX: 'auto',
            //overflowY: 'visible',
            //overflow: 'hidden,'
            position: 'relative'
        };

        const sectionElementStyle = {
            overflowY: 'hidden',
            overflowX: 'auto',
            //padding: 10,
            paddingTop: 40,
            height: '100%'
        };

        //<textarea style={compStyle} name='nonInline' ref='nonInline' id='nonInline' value={this.props.content} rows="10" cols="80" onChange={this.handleEditorChange}></textarea>
        //                <div style={headerStyle} contentEditable='true' name='inlineHeader' ref='inlineHeader' id='inlineHeader' dangerouslySetInnerHTML={{__html:'<h1>SLIDE ' + this.props.selector.sid + ' TITLE</h1>'}}></div>
        /*
         <div style={headerStyle} contentEditable='true' name='inlineHeader' ref='inlineHeader' id='inlineHeader' dangerouslySetInnerHTML={{__html:this.props.title}}></div>
         Slide title (in deck): <label htmlFor='title' hidden>Slide title (in deck)</label>
         <input type='title' id='title' name='title' ref='title' defaultValue={this.props.title} placeholder='Slide title (in deck)' autoFocus tabIndex='0' aria-required='true' required size='50'/>
         <hr/>
         <input type='text' id='title' name='title' ref='title' defaultValue={this.props.title} placeholder='Slide title (in deck)' autoFocus tabIndex='0' aria-required='true' required size='50'/>
            <input type="text" name="deck-title" placeholder="Title" aria-required="true" ref="title" />
            Slide title (in deck): <label htmlFor='title' hidden>Slide title (in deck)</label>
            <input type='text' id='title' name='title' ref='title' value={this.props.title} placeholder='Slide title (in deck)' autoFocus tabIndex='0' aria-required='true' required size='50' onChange='' />
                    */

        // Add the CSS dependency for the theme
        // Get the theme information, and download the stylesheet
        let styleName = 'default';
        if(this.props.selector.theme && typeof this.props.selector.theme !== 'undefined'){
            styleName = this.props.selector.theme;
        }
        else if(this.props.PresentationStore.theme && typeof this.props.PresentationStore.theme !== 'undefined'){
            styleName = this.props.PresentationStore.theme;
        }
        if (styleName === '' || typeof styleName === 'undefined' || styleName === 'undefined')
        {
            //if none of above yield a theme they will be legacy decks:
            styleName = 'white';
        }
        let style = require('../../../../../custom_modules/reveal.js/css/theme/' + styleName + '.css');
        //<div style={headerStyle} contentEditable='true' name='inlineHeader' ref='inlineHeader' id='inlineHeader' onInput={this.emitChange} dangerouslySetInnerHTML={{__html:this.props.title}}></div>
        return (
            <ResizeAware ref='container' id='container' style={{position: 'relative'}}>
                <button tabIndex="0" ref="submitbutton" className="ui button blue primary " onClick={this.handleSaveButton.bind(this)} onChange={this.handleSaveButton.bind(this)}>
                 <i className="save icon"></i>
                 Save
                </button>
                <button tabIndex="0" ref="submitbutton" className="ui orange button " onClick={this.addAbsoluteDiv.bind(this)} onChange={this.addAbsoluteDiv.bind(this)}>
                    <i className="plus square outline icon black"></i>
                    <a style={buttonColorBlack}>{this.inputBoxButtonTitle}</a>
                </button>
                <button tabIndex="0" ref="templatebutton" className="ui orange button " onClick={this.handleTemplatechange.bind(this)} >
                    <i className="browser icon black"> </i>
                    <a style={buttonColorBlack}>Use template</a>
                </button>
                <TemplateDropdown name="template" ref="template" id="template" onChange={this.handleTemplatechange.bind(this)}/>
                <button tabIndex="0" ref="CKeditorModeButton" className="ui orange button " onClick={this.handleCKeditorModeButton.bind(this)} onChange={this.handleCKeditorModeButton.bind(this)}>
                 <i className="outline tasks icon black"></i>
                 <a style={buttonColorBlack}>{this.CKeditorMode}</a>
                </button>
                <div className="ui" style={compStyle} ref='slideEditPanel'>
                    <div className={[style.reveal, 'reveal'].join(' ')}>
                        <div className={[style.slides, 'slides'].join(' ')}>
                            <section className="present"  style={sectionElementStyle}>
                                <HotKeys keyMap={keyMap} handlers={handlers}>
                                    <div style={contentStyle} contentEditable='true' name='inlineContent' ref='inlineContent' id='inlineContent' onInput={this.emitChange} dangerouslySetInnerHTML={{__html:this.props.content}}></div>
                                </HotKeys>
                            </section>
                        </div>
                    </div>
                </div>
                <b>Speaker notes:</b><br />
                <div style={speakernotesStyle} contentEditable='true' name='inlineSpeakerNotes' ref='inlineSpeakerNotes' id='inlineSpeakerNotes' onInput={this.emitChange} dangerouslySetInnerHTML={{__html:this.props.speakernotes}}></div>
            </ResizeAware>
        );
    }

    // To detect changes in the editable content.
/*
    shouldComponentUpdate(nextProps) {
        console.log(ReactDOM.findDOMNode(this));
        console.log('shouldComponentUpdate');
        return false;
        // return nextProps.html !== ReactDOM.findDOMNode(this).innerHTML;
    }*/

    emitChange() {
        window.onbeforeunload = () => {
            return 'If you don\'t save the slide, it won\'t be updated. ' +
            'Are you sure you want to exit this page?';
        };
    }
}

SlideContentEditor.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

SlideContentEditor = connectToStores(SlideContentEditor, [SlideEditStore, UserProfileStore, DataSourceStore, SlideViewStore, PresentationStore], (context, props) => {

    return {
        SlideEditStore: context.getStore(SlideEditStore).getState(),
        SlideViewStore: context.getStore(SlideViewStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        DataSourceStore: context.getStore(DataSourceStore).getState(),
        PresentationStore: context.getStore(PresentationStore).getState()
    };
});
export default SlideContentEditor;
