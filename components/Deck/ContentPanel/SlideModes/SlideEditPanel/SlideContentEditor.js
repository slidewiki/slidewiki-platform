import React from 'react';
//import AlloyEditor from 'alloyeditor';
//import AlloyEditorComponent from '../../SlideModes/SlideEditPanel/AlloyEditor';
//import CKeditorComponent from './CKeditorComponent';
//import CKEDITOR from 'ckeditor';
//import ckeditor from 'ckeditor';
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

let ReactDOM = require('react-dom');

class SlideContentEditor extends React.Component {
    constructor(props) {
        super(props);
        this.currentcontent;
        this.refresh = 'false';
        this.CKEDitor_loaded = false;
        //this.props.scaleratio = 1;
        this.scaleratio = 1;
        //this.addBoxButtonHTML = '';
        this.inputBoxButtonTitle;
        if(this.props.content.indexOf('pptx2html') !== -1)
        { // if pptx2html element with absolute content is in slide content (underlying HTML)
            this.inputBoxButtonTitle = 'Add input box';
        } else { //if slide does not have pptx2html/canvas/absolute positioning
            this.inputBoxButtonTitle = 'Switch to canvas with input boxes';
        }
        this.refs.template;
        this.showTemplates = false;


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
                //const template = this.refs.templates.getSelected();
                //console.log('selected template:' + template);
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
                CKEDITOR.instances.inlineContent.setData('<div class="pptx2html" style="position: relative; width: 960px; height: 720px;">'+
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="position: absolute; top: 38.3334px; left: 66px; width: 828px; height: 139.167px; z-index: 23488;">'+
                    '<h3 class="h-mid"><span class="text-block" style="font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">Title</span></h3></div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="position: absolute; top: 191.667px; left: 66px; width: 828px; height: 456.833px; z-index: 23520;">'+
                    '<ul>'+
                    '	<li class="h-left" style="text-align: left;"><span class="text-block" style="font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">Text bullet 1</span></li>'+
                    '	<li class="h-left" style="text-align: left;"><span class="text-block" style="font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">Text bullet 2</span></li>'+
                    '</ul>'+
                    '<div class="h-left">&nbsp;</div>'+
                    '</div></div>');
                this.inputBoxButtonTitle = 'Add input box';
                this.emitChange();
                break;
            case '2':
                CKEDITOR.instances.inlineContent.setData(''+
                    '');
                this.inputBoxButtonTitle = 'Switch to canvas with input boxes';
                this.emitChange();
                break;
            case '3':
                CKEDITOR.instances.inlineContent.setData(''+
                    '<h1 style="text-align: center;">Title</h1>'+
                    '<p>text</p>');
                this.inputBoxButtonTitle = 'Switch to canvas with input boxes';
                this.emitChange();
                break;
            case '11':
                CKEDITOR.instances.inlineContent.setData('<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">Heading</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 65.14px; width: 941.77px; height: 610px; text-align: left; position: absolute; z-index: 2120483647; border-style: dashed; border-color: rgb(51, 204, 51);">'+
                    '<p style="font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">&nbsp;Row 1 - Column 1</p></div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">Footer</div></div>');
                this.inputBoxButtonTitle = 'Add input box';
                this.emitChange();
                break;
            case '12':
                CKEDITOR.instances.inlineContent.setData('<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">Heading</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 64.11px; width: 661px; height: 613.14px; text-align: left; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">'+
                    '<p style="text-align:center">Row 1 - Column&nbsp;1</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">Footer</div>'+
                    '<div style="left: 660.87px; top: 63.85px; width: 282.49px; height: 611.39px; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">'+
                    '<div class="h-mid" style="text-align: center;">'+
                    '<p style="text-align:center">Row 1 - Column&nbsp;2</p>'+
                    '</div></div></div>');
                this.inputBoxButtonTitle = 'Add input box';
                this.emitChange();
                break;
            case '22':
                CKEDITOR.instances.inlineContent.setData('<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">Header</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 202.48px; width: 661.48px; height: 476.18px; text-align: left; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">'+
                    '<p style="text-align:center">Row 2 - Column&nbsp;1</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">Footer</div>'+
                    '<div style="left: 0.44px; top: 65.4px; width: 940.44px; height: 137.18px; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">'+
                    '<div class="h-mid" style="text-align: center;">&nbsp;</div>'+
                    '<div class="h-mid" style="text-align: center;"><p>Row 1</p></div></div>'+
                    '<div style="left: 660px; top: 201px; width: 279px; height: 476.18px; position: absolute; z-index: 80000; border-style: dashed; border-color: rgb(51, 204, 51);">'+
                    '<div class="h-mid" style="text-align: center;">'+
                    '<p style="text-align:center">Row 2 - Column&nbsp;2</p>'+
                    '</div></div></div>');
                this.inputBoxButtonTitle = 'Add input box';
                this.emitChange();
                break;
            case '21':
                CKEDITOR.instances.inlineContent.setData('<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">Header</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0.87px; top: 267.64px; width: 941.62px; height: 409px; text-align: left; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">'+
                    '<p style="text-align:center">Row 2 - Column 1</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">Footer</div>'+
                    '<div style="left: 0.44px; top: 65.4px; width: 941.74px; height: 203.38px; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">'+
                    '<div class="h-mid" style="text-align: center;">&nbsp;</div>'+
                    '<div class="h-mid" style="text-align: center;">Row 1 - Column 1</div>'+
                    '</div></div>');
                this.inputBoxButtonTitle = 'Add input box';
                this.emitChange();
                break;
            case '11img':
                this.changeCKeditorData('<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">Header</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 65.14px; width: 940.85px; height: 228.78px; text-align: left; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">'+
                    '<p style="font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">Row 1 - Column 1 - <br/> Insert the image by pasting the url in the HTML code in the last div section after source=</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 2.02366px; top: 667.247px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">Footer</div>'+
                    '<div style="left: 1.25px; top: 304px; width: 938.96px; height: 360.72px; position: absolute; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">'+
                    '<div class="h-mid" style="text-align: center;">'+
                    '<p style="text-align:center"><img alt="" height="322" src="http://fileservice.stable.slidewiki.org/2355/a5527130-f9b1-11e6-8593-f7fb03f4bfc1.jpg" width="408" /></p>'+
                    '<p>&nbsp;</p></div></div></div>', 'Add input box');
                break;
        }
        this.forceUpdate();
    }

    changeCKeditorData(data, title){
        CKEDITOR.instances.inlineContent.setData(data);
        this.inputBoxButtonTitle = title;
        this.emitChange();
        this.forceUpdate();
    }

    handleSaveButton(){
        if (this.props.UserProfileStore.username !== '') {
            // Replace the onbeforeunload function by a Blank Function because it is not neccesary when saved.
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
            //SWIK 107 - remove input box edit buttons
            $('.dragdiv').remove();
            $('.removediv').remove();
            $('.resizediv').remove();
            $('.movetofrontdiv').remove();
            $('.sendtobackdiv').remove();

            //ReactDOM.findDOMNode(this.refs.inlineContent).attr('value');
            //ReactDOM.findDOMNode(this.refs.inlineContent).getContent();
            //let slide.content = 'test';
            //this.context.executeAction(saveSlide, {slide});
            //let slide = 'test';
            // let title = CKEDITOR.instances.inlineHeader.getData();
            let title = this.props.SlideEditStore.title;
            //let title = this.refs.inlineHeader.value;
            //let title = this.refs.title.value;
            let content = CKEDITOR.instances.inlineContent.getData();
            let speakernotes = CKEDITOR.instances.inlineSpeakerNotes.getData();
            //these fields should not be empty:
            if (title === ''){title = ' ';}
            if (content === ''){content = ' ';}
            if (speakernotes === ''){speakernotes = ' ';}
            //update store
            this.props.SlideEditStore.title = title;
            this.props.SlideEditStore.content = content;
            this.props.SlideEditStore.speakernotes = speakernotes;
            let currentSelector = this.props.selector;
            //console.log('currentSelector: ' + currentSelector.id);
            let deckID = currentSelector.id;
            //TODO GET subdeck from spath in currentSelector e.g. = Object {id: "56", sid: "691", stype: "slide", spath: "68:3;685:1;691:2"} = 56 is deck, 68 is subdeck
            //TEST - create slide (before can be saved (=updated))
            //console.log(speakernotes);
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
    addAbsoluteDiv() {
        //absolutediv
        //this.props.SlideEditStore.content = CKEDITOR.instances.inlineContent.getData();
        //Check if content already has canvas/absolute positioning
        //console.log('absolutediv');
        //if(this.props.content.indexOf('pptx2html') !== -1 || (CKEDITOR.instances.inlineContent.getData() !== '' && CKEDITOR.instances.inlineContent.getData().indexOf('pptx2html') !== -1))
        //if(this.props.content.indexOf('pptx2html') !== -1 || (CKEDITOR.instances.inlineContent.getData() !== '' && CKEDITOR.instances.inlineContent.getData().indexOf('pptx2html') !== -1))
        if (typeof(CKEDITOR.instances.inlineContent) !== 'undefined' && CKEDITOR.instances.inlineContent.getData().indexOf('pptx2html') !== -1)
        { // if pptx2html element with absolute content is in slide content (underlying HTML)
            //console.log('input box');
            let index_highest = 0;
            $('.pptx2html [style*="absolute"]').each(function() {
                let index_current = parseInt($(this).css('zIndex'), 10);
                if(index_current > index_highest) {
                    index_highest = index_current;
                }
            });
            //cEl.style.zIndex = index_highest + 10;

            $('.pptx2html').append(this.getAbsoluteDiv(index_highest + 10));
            //$('.pptx2html [style*="absolute"]')
            //.css({'borderStyle': 'dashed dashed dashed dashed', 'borderColor': '#33cc33'});
            this.emitChange();
            this.forceUpdate();
        } else { //if slide does not have pptx2html/canvas/absolute positioning
            //console.log('canvas');
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
                let currentContent = CKEDITOR.instances.inlineContent.getData();
                let newContent = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1,1); transform-origin: left top 0px;">' +
                '<p></p><p></p><p></p><p></p><p></p><div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="position: absolute; top: 10px; left: 10px; width: 940px; height: 700px; z-index: 2138483647; border-style: dashed; border-color: rgb(51, 204, 51);">' +
                '<div class="h-left">' + currentContent + '</div>' +
                '</div>' +
                '</div>';
                //update content
                CKEDITOR.instances.inlineContent.setData(newContent);
                this.inputBoxButtonTitle = 'Add input box';
                this.emitChange();
                this.forceUpdate();
            }, (reason) => {
                //done(reason);
            });
        }

    }
    getAbsoluteDiv(zindex){
        //let simpledraggable = require('simple-draggable'); //remove window dependency
        //let SimpleDraggable = require('../../../../../assets/simpledraggable');
        //return '<div style="position: absolute; top: 50px; left: 100px; width: 400px; height: 200px; z-index: '+zindex+';"><div class="h-mid" style="text-align: center;"><span class="text-block h-mid" style="color: #000; font-size: 44pt; font-family: Calibri; font-weight: initial; font-style: normal; ">New content</span></div></div>';
        return '<div style="position: absolute; top: 50px; left: 100px; width: 400px; height: 200px; z-index: '+zindex+'; border-style: dashed; border-color: rgb(51, 204, 51);"><div class="h-left"><span class="text-block" ">New content</span></div></div>';
    }
    componentDidMount() {

        //alert('remount');
        const userId = this.props.UserProfileStore.userid;

        //TODO/bug? = inline-toolbar does not resize properly when zooming in browser. Does work in example on CKeditor website..
        //TODO: needs sharedspace plugin for proper positioning of inline toolbars + http://ckeditor.com/addon/closebtn plugin for closing inline editor
        //TODO: refresh of edit pages resets the toolbar configuration to default - needs fix

        if (typeof(CKEDITOR.instances.inlineHeader) === 'undefined'){CKEDITOR.inline('inlineHeader', {
            customConfig: '/assets/ckeditor_config.js',
            toolbarGroups: [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'about', groups: [ 'about' ] }
            ],
            floatSpacePreferRight: true,
            uiColor: '#4183C4',
            removeButtons: 'Youtube,MathJax,Sourcedialog,CodeSnippet,Undo,Clipboard,Source,Save,NewPage,Preview,Print,Templates,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Button,Select,HiddenField,ImageButton,Subscript,Superscript,RemoveFormat,NumberedList,Outdent,BulletedList,Indent,Blockquote,CreateDiv,Language,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Maximize,ShowBlocks,About',
            filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId
        });}

        CKEDITOR.disableAutoInline = true;
        //if (typeof(CKEDITOR.instances.title) === 'undefined'){CKEDITOR.instances.title.destroy();}
        //TODO - remove more buttons speakernotes
        if (typeof(CKEDITOR.instances.inlineSpeakerNotes) === 'undefined'){CKEDITOR.inline('inlineSpeakerNotes', {
            customConfig: '/assets/ckeditor_config.js',
            toolbarGroups: [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'clipboard', groups: [ 'undo', 'clipboard' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'about', groups: [ 'about' ] }
            ],
            floatSpacePreferRight: true,
            uiColor: '#4183C4',
            removeButtons: 'Youtube,MathJax,Sourcedialog,CodeSnippet,Source,Save,NewPage,Preview,Print,Templates,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Button,Select,HiddenField,ImageButton,Subscript,Superscript,RemoveFormat,NumberedList,Outdent,BulletedList,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Maximize,ShowBlocks,About',
            filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId
        });}
        if (typeof(CKEDITOR.instances.inlineContent) === 'undefined'){
            //alert('test');
            const userId = this.props.UserProfileStore.userid;
            //console.log(userId);
            // CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: 'http://localhost:4000/importImage/' + userId, customConfig: '../../../../../../assets/ckeditor_config.js'});

            //if (typeof(CKEDITOR.instances.inlineContent) === 'undefined'){CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: Microservices.import.uri +  + '/importImage/' + userId, customConfig: '../../../../../../assets/ckeditor_config.js'});
            //CKEDITOR.inline('inlineContent', {customConfig: '../../../../../../assets/ckeditor_config.js'});
            //CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId, customConfig: '../../../../../../assets/ckeditor_config.js'});
            //alert('test: ' + Microservices.import.uri + '/importImage/' + userId);
            //CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId, customConfig: '../../../../../../custom_modules/ckeditor/config.js'});
            //CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId, customConfig: '../../../../../../custom_modules/ckeditor/config.js'});
            CKEDITOR.inline('inlineContent', {
                customConfig: '/assets/ckeditor_config.js',
                filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId,
                uploadUrl: Microservices.import.uri + '/importImagePaste/' + userId}); //leave all buttons

        }
        this.currentcontent = this.props.content;

        ReactDOM.findDOMNode(this.refs.container).addEventListener('resize', (evt) => {
            if(process.env.BROWSER){
                //this.resize();
                // alert('resize');
                this.forceUpdate();
            }
        });

        CKEDITOR.instances.inlineContent.on('instanceReady', (evt) => {
        //needs copy of resize function == cannot find this.something in this context.
        //tried ReactDOM.findDOMNode(this.refs.inlineContent).addEventListener('instanceReady', (evt) =>
        //but did not work
        //if(process.env.BROWSER){
            //this.resize();
            //alert('ckeditor load');
            //this.forceUpdate();
            //this.resize();
        //    }
        /*
            //do not put borders around empty divs containing SVG elements
            if ($('.pptx2html [style*="absolute"]').not('.drawing-container').css('borderStyle') !== 'dashed'){
                $('.pptx2html [style*="absolute"]').not('.drawing-container').css({'borderStyle': 'dashed', 'borderColor': '#33cc33'});
            }
            let containerwidth = document.getElementById('container').offsetWidth;
            let containerheight = document.getElementById('container').offsetHeight;
            $('.pptx2html').css({'transform': '', 'transform-origin': ''});
            let pptxwidth = $('.pptx2html').width();
            let pptxheight = $('.pptx2html').height();
            //remove previous event listeners!
            let scaleratio = containerwidth / pptxwidth;
            $('.pptx2html').css({'transform': '', 'transform-origin': ''});
            $('.pptx2html').css({'transform': 'scale('+scaleratio+','+scaleratio+')', 'transform-origin': 'top left'});
            require('../../../../../custom_modules/simple-draggable/lib/index.js');

            SimpleDraggable('.pptx2html [style*="absolute"]', {
                onlyX: false,
                onlyY: false,
                ratio: scaleratio
            });
            SimpleDraggable('.pptx2html > [style*="absolute"] > [style*="absolute"]', {
                onlyX: false
              , onlyY: false
              , ratio: scaleratio
            });

            //set height of content panel to at least size of pptx2html + (100 pixels * scaleratio).
            //this.refs.slideEditPanel.style.height = ((pptxheight + 5 + 20) * this.scaleratio) + 'px';
            //this.refs.inlineContent.style.height = ((pptxheight + 0 + 20) * this.scaleratio) + 'px';
            $('.slideEditPanel').height(((pptxheight + 5 + 20) * scaleratio) + 'px');
            $('.inlineContent').height(((pptxheight + 0 + 20) * scaleratio) + 'px');
            //show that content is outside of pptx2html box
            $('.pptx2html').css({'borderStyle': 'none none double none', 'borderColor': '#3366ff', 'box-shadow': '0px 100px 1000px #ff8787'});
            //fix bug with speakernotes overlapping soure dialog/other elements - SWIK-832
            $('#inlineSpeakerNotes [style*="absolute"]').css({'position': 'relative', 'zIndex': '0'});*/
            this.resize();
            if(document.domain !== 'localhost')
            {
                document.domain = 'slidewiki.org';
            }
        });



        //setTimeout(this.forceUpdate(), 500);
        //alert('componentdidmount');
        //this.forceUpdate();

    }
    componentDidUpdate() {
        //alert('update');
        if(process.env.BROWSER){
            this.resize();
        }
        if(typeof(CKEDITOR.instances.inlineContent) !== 'undefined' && CKEDITOR.instances.inlineContent.getData().indexOf('pptx2html') !== -1)
        { // if pptx2html element with absolute content is in slide content (underlying HTML)
            this.inputBoxButtonTitle = 'Add input box';
        } else { //if slide does not have pptx2html/canvas/absolute positioning
            this.inputBoxButtonTitle = 'Switch to canvas with input boxes';
        }
    }

    resize() {
        //console.log('resize_all');
        //do not put borders around empty divs containing SVG elements
        if ($('.pptx2html [style*="absolute"]').not('.drawing-container').css('borderStyle') !== 'dashed') {
            $('.pptx2html [style*="absolute"]').not('.drawing-container').css({'borderStyle': 'dashed', 'borderColor': '#33cc33'});
        }
        let containerwidth = document.getElementById('container').offsetWidth;
        let containerheight = document.getElementById('container').offsetHeight;
        //reset scaling of pptx2html element to get original size
        $('.pptx2html').css({'transform': '', 'transform-origin': ''});
        //Function to fit contents in edit and view component
        let pptxwidth = $('.pptx2html').width();
        let pptxheight = $('.pptx2html').height();
        this.scaleratio = containerwidth / (pptxwidth+50);
        $('.pptx2html').css({'transform': '', 'transform-origin': ''});
        $('.pptx2html').css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});
        require('../../../../../custom_modules/simple-draggable/lib/index.js');
        //remove previous event listeners!
        SimpleDraggable('.pptx2html [style*="absolute"]', {
            onlyX: false
          , onlyY: false
          , ratio: this.scaleratio
        });
        SimpleDraggable('.pptx2html > [style*="absolute"] > [style*="absolute"]', {
            onlyX: false
          , onlyY: false
          , ratio: this.scaleratio
        });
        SimpleDraggable('.pptx2html > [style*="absolute"] > [style*="absolute"] > [style*="absolute"]', {
            onlyX: false
          , onlyY: false
          , ratio: this.scaleratio
        });
        //set height of content panel to at least size of pptx2html + (100 pixels * scaleratio).
        this.refs.slideEditPanel.style.height = ((pptxheight + 5 + 20) * this.scaleratio) + 'px';
        this.refs.inlineContent.style.height = ((pptxheight + 0 + 20) * this.scaleratio) + 'px';
        //show that content is outside of pptx2html box
        //$('.pptx2html').css({'borderStyle': 'none none double none', 'borderColor': '#3366ff', 'box-shadow': '0px 100px 1000px #ff8787'});
        $('.pptx2html').css({'borderStyle': 'double', 'borderColor': '#DA6619'});
        //fix bug with speakernotes overlapping soure dialog/other elements - SWIK-832
        $('#inlineSpeakerNotes [style*="absolute"]').css({'position': 'relative', 'zIndex': '0'});
    }

    componentWillUnmount() {
        // Remove the warning window.
        window.onbeforeunload = () => {};
        //TODO
        //CKEDITOR.instances.nonInline.destroy();
        CKEDITOR.instances.inlineHeader.destroy();
        CKEDITOR.instances.inlineContent.destroy();
        CKEDITOR.instances.inlineSpeakerNotes.destroy();
    }
    //handleEditorChange(e) {
        //http://docs.ckeditor.com/#!/guide/dev_savedata
        //console.log(e.target.getContent());
    //}
    render() {
        //TODO: offer option to switch between inline-editor (alloy) and permanent/full editor (CKeditor)
        //TODO - remove use of id - Only use 'ref=' for React. Find CKeditor create function(s) that do not require id.
        //styles should match slideViewPanel for consistency

        // When the component is rendered the confirmation is configured.

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
            minHeight: 610,
            overflowY: 'auto',
            overflowX: 'auto',
            //borderStyle: 'dashed',
            //borderColor: '#e7e7e7',
        };
        /*const speakernotesStyle = {
            minWidth: '100%',
            maxHeight: 120,
            minHeight: 120,
            overflowY: 'auto',
            borderStyle: 'dashed',
            borderColor: '#e7e7e7',
            position: 'relative'
        };*/
        const speakernotesStyle = {
            maxHeight: 50,
            minHeight: 50,
            overflowY: 'auto',
            position: 'relative'
        };

        const compStyle = {
            // maxHeight: 450,
            //minHeight: 450,
            //overflowY: 'auto',
            //position: 'relative'
            //minWidth: '100%',
            // maxHeight: 450,
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

        return (
            <ResizeAware ref='container' id='container' style={{position: 'relative'}}>
                <button tabIndex="0" ref="submitbutton" className="ui button blue" onClick={this.handleSaveButton.bind(this)} onChange={this.handleSaveButton.bind(this)}>
                 <i className="save icon"></i>
                 Save
                </button>
                <button tabIndex="0" ref="submitbutton" className="ui blue basic button" onClick={this.addAbsoluteDiv.bind(this)} onChange={this.addAbsoluteDiv.bind(this)}>
                    <i className="plus square outline icon"></i>
                    {this.inputBoxButtonTitle}
                </button>
                <TemplateDropdown name="template" ref="template" id="template" />
                <button tabIndex="0" ref="templatebutton" className="ui icon button" onClick={this.handleTemplatechange.bind(this)} >
                    <i className="browser icon blue"> </i>
                    Use template
                </button>
                <div style={headerStyle} contentEditable='true' name='inlineHeader' ref='inlineHeader' id='inlineHeader' onInput={this.emitChange} dangerouslySetInnerHTML={{__html:this.props.title}}></div>
                <div className="ui" style={compStyle} ref='slideEditPanel'>
                    <div className={[style.reveal, "reveal"]}>
                        <div className={[style.slides, "slides"]}>
                            <section className="present"  style={sectionElementStyle}>
                                <div style={contentStyle} contentEditable='true' name='inlineContent' ref='inlineContent' id='inlineContent' onInput={this.emitChange} dangerouslySetInnerHTML={{__html:this.props.content}}></div>
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
/*
    confirmExit() {

      return 'If you don\'t save the slide the content won\'t be updated. ' +
        'Are you sure you want to exit this page?';

    }
*/

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
