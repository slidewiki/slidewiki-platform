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
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">Heading</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 65.14px; width: 941.77px; height: 610px; text-align: left; position: absolute; z-index: 2120483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">'+
                    '<p style="font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">&nbsp;Row 1 - Column 1</p></div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">Footer</div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '12':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">Heading</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 64.11px; width: 661px; height: 613.14px; text-align: left; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">'+
                    '<p style="text-align:center">Row 1 - Column&nbsp;1</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">Footer</div>'+
                    '<div style="left: 660.87px; top: 63.85px; width: 282.49px; height: 611.39px; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">'+
                    '<div class="h-mid" style="text-align: center;">'+
                    '<p style="text-align:center">Row 1 - Column&nbsp;2</p>'+
                    '</div></div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '22':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">Header</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 202.48px; width: 661.48px; height: 476.18px; text-align: left; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">'+
                    '<p style="text-align:center">Row 2 - Column&nbsp;1</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">Footer</div>'+
                    '<div style="left: 0.44px; top: 65.4px; width: 940.44px; height: 137.18px; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">'+
                    '<div class="h-mid" style="text-align: center;">&nbsp;</div>'+
                    '<div class="h-mid" style="text-align: center;"><p>Row 1</p></div></div>'+
                    '<div style="left: 660px; top: 201px; width: 279px; height: 476.18px; position: absolute; z-index: 80000; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">'+
                    '<div class="h-mid" style="text-align: center;">'+
                    '<p style="text-align:center">Row 2 - Column&nbsp;2</p>'+
                    '</div></div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '21':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<p></p><p></p><p></p><p></p><p></p><div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">Header</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0.87px; top: 267.64px; width: 941.62px; height: 409px; text-align: left; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">'+
                    '<p style="text-align:center">Row 2 - Column 1</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">Footer</div>'+
                    '<div style="left: 0.44px; top: 65.4px; width: 941.74px; height: 203.38px; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">'+
                    '<div class="h-mid" style="text-align: center;">&nbsp;</div>'+
                    '<div class="h-mid" style="text-align: center;">Row 1 - Column 1</div>'+
                    '</div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '11img':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative; border-style: ridge ridge ridge ridge; border-color: rgb(218, 102, 25); transform: scale(1.14479, 1.14479); transform-origin: left top 0px;">'+
                    '<div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">Header</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 65.14px; width: 940.85px; height: 228.78px; text-align: left; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">'+
                    '<p style="font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">Row 1 - Column 1 - <br/> Insert the image by pasting the url in the HTML code in the last div section after source=</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 2.02366px; top: 667.247px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">Footer</div>'+
                    '<div style="left: 1.25px; top: 304px; width: 938.96px; height: 360.72px; position: absolute; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">'+
                    '<div class="h-mid" style="text-align: center;">'+
                    '<p style="text-align:center"><img alt="" height="322" src="http://fileservice.stable.slidewiki.org/2355/a5527130-f9b1-11e6-8593-f7fb03f4bfc1.jpg" width="408" /></p>'+
                    '<p>&nbsp;</p></div></div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
        }
        this.emitChange();
        //this.addBorders();
        this.resizeDrag();
        this.forceUpdate();
    }
    uniqueIDAllElements(){
        let allElements = this.refs.inlineContent.getElementsByTagName('*');
        let allIds = [];
        for (let i = 0, n = allElements.length; i < n; ++i) {
            let random = Math.floor((Math.random() * 100000) + 1);
            let el = allElements[i];
            if (el.id) { allIds.push(el.id); }
            else {el.id = random;}
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
            //SWIK 107 - remove input box edit buttons
            $('.dragdiv').remove();
            $('.removediv').remove();
            $('.resizediv').remove();
            $('.movetofrontdiv').remove();
            $('.sendtobackdiv').remove();

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
    addAbsoluteDiv() {
        //absolutediv
        //Check if content already has canvas/absolute positioning
        //TODO replace with this.refs.inlineContent.innerHTML
        //if (typeof(CKEDITOR.instances.inlineContent) !== 'undefined' && CKEDITOR.instances.inlineContent.getData().indexOf('pptx2html') !== -1)
        if (this.refs.inlineContent.innerHTML.includes('pptx2html'))
        { // if pptx2html element with absolute content is in slide content (underlying HTML)
            let index_highest = 0;
            $('.pptx2html [style*="absolute"]').each(function() {
                let index_current = parseInt($(this).css('zIndex'), 10);
                if(index_current > index_highest) {
                    index_highest = index_current;
                }
            });
            //cEl.style.zIndex = index_highest + 10;

            $('.pptx2html').append(this.getAbsoluteDiv(index_highest + 10));
            //.css({'borderStyle': 'dashed dashed dashed dashed', 'borderColor': '#33cc33'});
            this.emitChange();
            this.forceUpdate();
            this.resizeDrag();
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
                '<p></p><p></p><p></p><p></p><p></p><div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="position: absolute; top: 10px; left: 10px; width: 940px; height: 700px; z-index: 2138483647; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);">' +
                '<div class="h-left">' + this.refs.inlineContent.innerHTML + '</div>' +
                '</div>' +
                '</div>';
                //update content
                //TODO replace with this.refs.inlineContent.innerHTML
                //CKEDITOR.instances.inlineContent.setData(newContent);
                this.inputBoxButtonTitle = 'Add input box';
                this.emitChange();
                this.forceUpdate();
                this.resizeDrag();
            }, (reason) => {
                //done(reason);
            });
        }

    }
    getAbsoluteDiv(zindex){
        //return '<div style="position: absolute; top: 50px; left: 100px; width: 400px; height: 200px; z-index: '+zindex+';"><div class="h-mid" style="text-align: center;"><span class="text-block h-mid" style="color: #000; font-size: 44pt; font-family: Calibri; font-weight: initial; font-style: normal; ">New content</span></div></div>';
        return '<div style="position: absolute; top: 50px; left: 100px; width: 400px; height: 200px; z-index: '+zindex+'; border-style: solid; border-width: 1px; border-color: rgba(30,120,187,0.5);"><div class="h-left"><span class="text-block" ">New content</span></div></div>';
    }
    componentDidMount() {

        //TODO replace with context.getUser();
        const userId = this.props.UserProfileStore.userid;

        //TODO/bug? = inline-toolbar does not resize properly when zooming in browser. Does work in example on CKeditor website..
        //TODO: needs sharedspace plugin for proper positioning of inline toolbars + http://ckeditor.com/addon/closebtn plugin for closing inline editor
        //TODO: refresh of edit pages resets the toolbar configuration to default - needs fix

        CKEDITOR.disableAutoInline = true;
        //CKEDITOR.disableAutoInline = false;
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
        //if (typeof(CKEDITOR.instances.inlineContent) === 'undefined'){
            //const userId = this.props.UserProfileStore.userid;
            // CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: 'http://localhost:4000/importImage/' + userId, customConfig: '../../../../../../assets/ckeditor_config.js'});
            //CKEDITOR.inline('inlineContent', {customConfig: '../../../../../../assets/ckeditor_config.js'});
            //CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId, customConfig: '../../../../../../assets/ckeditor_config.js'});
            //CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId, customConfig: '../../../../../../custom_modules/ckeditor/config.js'});
        CKEDITOR.inline('inlineContent', {
            //CKEDITOR.replace('inlineContent', {
            customConfig: '/assets/ckeditor_config.js',
            filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId,
            uploadUrl: Microservices.import.uri + '/importImagePaste/' + userId}); //leave all buttons
        //}
        this.currentcontent = this.props.content;

        CKEDITOR.instances.inlineContent.on('instanceReady', (evt) => {
            this.resize();
            //console.log('inlineConent CKeditor ready' + CKEDITOR.instances.inlineContent);
            //if (!CKEDITOR.instances.inlineContent)
            if (typeof(CKEDITOR.instances.inlineContent) === 'undefined')
            {
                CKEDITOR.instances.inlineContent.destroy();
                CKEDITOR.inline('inlineContent', {
                    customConfig: '/assets/ckeditor_config.js',
                    filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId,
                    uploadUrl: Microservices.import.uri + '/importImagePaste/' + userId}); //leave all buttons

            }
            if (this.refs.inlineContent.innerHTML.includes('pptx2html'))
            {
                this.emitChange();
                this.forceUpdate();
                //this.addBorders();
                this.resizeDrag();
                //console.log('resizeDrag and borders');
            }
            if(document.domain !== 'localhost')
            {
                document.domain = 'slidewiki.org';
            }
        });

        ReactDOM.findDOMNode(this.refs.container).addEventListener('resize', (evt) => {
            if(process.env.BROWSER){
                this.resize();
                //this.forceUpdate();
            }
        });
        //show that content is outside of pptx2html box
        //$('.pptx2html').css({'borderStyle': 'none none double none', 'borderColor': '#3366ff', 'box-shadow': '0px 100px 1000px #ff8787'});
        $('.pptx2html').css({'borderStyle': 'double', 'borderColor': 'rgba(218,102,25,0.5)'});
        //fix bug with speakernotes overlapping soure dialog/other elements - SWIK-832
        $('#inlineSpeakerNotes [style*="absolute"]').css({'position': 'relative', 'zIndex': '0'});
        this.contextMenu();

    }

    contextMenu(){
        // TODO: https://swisnl.github.io/jQuery-contextMenu/demo/accesskeys.html

        //https://github.com/swisnl/jQuery-contextMenu
        //http://swisnl.github.io/jQuery-contextMenu/
        $.contextMenu({
        //$('.pptx2html').contextMenu({
            // define which elements trigger this menu
            selector: '.pptx2html > [style*="absolute"]',
            // define the elements of the menu
            callback: function(key, options) {
                //console.log('clicked: ' + key +  'on'  + $(this).text());
                console.log('clicked: ' + key +  'on'  + $(this).text());
                if(key === 'edit'){
                    //copied from $('.pptx2html > [style*="absolute"]').dblclick(function() {
                    //keep consistent!!
                    if($(this).draggable( 'instance' )){$(this).draggable('destroy');}
                    $(this).css('cursor', 'auto');
                    $(this).css('background-color','rgba(30,120,187,0.1)');
                    $(this).addClass('activeContent');
                    $(this).mouseleave(function(){$(this).css('background-color','rgba(30,120,187,0.1)');});
                }
                /*
                else if(key === 'move')
                {
                    if (!$(this).hasClass('activeContent'))
                    {
                        //reset cursor
                        $(this).focus();
                        //$(this).select();
                        //if(!$(this).draggable( 'instance' )){$(this).draggable({cursor: 'move', containment: '#inlineContent'});}
                        if(!$('.activeContent').draggable( 'instance' )){$('.activeContent').draggable({cursor: 'move'});}
                        $('.activeContent').css('cursor', 'pointer');
                        $('.activeContent').css('background-color','');
                        $('.activeContent').mouseleave(function(){$(this).css('background-color','');});
                        $('.activeContent').removeClass('activeContent');
                    }
                }
                */
                else if(key === 'cut')
                {
                    //TODO: store in temporary variable + $(this).remove();

                }
                else if(key === 'copy')
                {
                    //TODO: move to different x / Y position if draggable element
                    //this.clone().appendTo('.pptx2html');
                    $(this).clone().appendTo('.pptx2html');
                    //this.emitChange();
                    //this.forceUpdate();
                    //this.addBorders();
                    //this.resizeDrag();
                }

                else if(key === 'paste')
                {
                    //TODO: get from temporary variable + .appendTo('.pptx2html');
                }
                else if(key === 'delete')
                {
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
                        //alert(cEl.parentNode.className);
                        //if ($(this).parentNode.childNodes.length === 1)
                        //{
                            //add a div element to prevent empty PPTX element which gets removed by CKeditor
                            //let emptydiv = document.createElement('div');
                            //emptydiv.innerHTML = "";
                            //$(this).parentNode.appendChild(emptydiv);
                        //}
                        //$(this).parentNode.removeChild(cEl);
                        if (!$(this).hasClass('pptx2html')){$(this).remove();}
                    }, (reason) => {
                        //done(reason);
                    });
                }

            },
            items: {
                'edit': {name: 'Edit', icon: 'edit'},
                'move': {move: 'Move'},
                'cut': {name: 'Cut', icon: 'cut'},
                'copy': {name: 'Copy', icon: 'copy'},
                'paste': {name: 'Paste', icon: 'paste'},
                'delete': {name: 'Delete', icon: 'delete'},
                'sep1': '---------',
                'quit': {name: 'Quit', icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
            }
        });
    }

    resizeDrag(){
        //http://jqueryui.com/resizable/
        //http://interface.eyecon.ro/docs/resizable
        /*ResizableDestroy
        A Resizable can be destroyed at anytime.
        Code sample:
        $('#resizeMe').ResizableDestroy();*/

        // TODO -> create SVG around draggable element with points/blocks for resize handlers
        // OR by emulating textarea - http://stackoverflow.com/questions/18427555/jquery-textarea-draggable
        // or: make images JQUERY draggable, and have original button for text input  - too complex
        //<g><path fill="#000" fill-opacity="0" stroke="#000" stroke-opacity="0" stroke-width="10550.76923076923" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" pointer-events="visiblePainted" d="M 4331 28073 L 318671 28073 318671 170081 4331 170081 Z"></path></g>
        // TODO: Make background outside slide grey!
        // TODO: move elements based on key-up / key-down / etc..
        // TODO: copy-paste elements based on ctrl-c / ctrl-v
        // TODO: keyboard focus and arrows to move; enter to start editing

        //***position mode - default/start***
        //http://api.jqueryui.com/resizable/
        //aspect ratio: http://stackoverflow.com/questions/3699125/jquery-ui-resize-only-one-handle-with-aspect-ratio
        $('.pptx2html > [style*="absolute"]').resizable({handles: 'all',  scroll: true});
        //$('.pptx2html > [style*="absolute"]').resizable({handles: 'all'});
        //$('.pptx2html > [style*="absolute"]').draggable({cursor: 'move', containment: '#inlineContent'});
        //$('.pptx2html > [style*="absolute"]').draggable({cursor: 'move'});

        //$('.pptx2html > [type="image"]').resizable({handles: 'all'});
        //$('.pptx2html > [type="image"]').resizable({handles: 'all',  scroll: true, containment: "#inlineContent", aspectRatio: true });
        //$('.pptx2html > [type="image"]').draggable();
        //$('.pptx2html').resizable({handles: 'all'});

        //***content mode***
        // TODO:  set enter-keycode-event for input box remove dragable and set cursor to auto for editing content

        //TODO: if you select an element and starty typing: then directly switch to edit mode

        //set double click event for input box - ondoubleclick - remove dragable and set cursor to auto for editing content
        $('.pptx2html > [style*="absolute"]').dblclick(function() {
            //$(this).ResizableDestroy();
            if($(this).draggable( 'instance' )){$(this).draggable('destroy');}
            $(this).css('cursor', 'auto');
            //$(this).css('background-color','rgba(81, 203, 238,0.1)');
            $(this).addClass('activeContent');
            //$(this).mouseleave(function(){$(this).css('background-color','rgba(81, 203, 238,0.1)');});
            // TODO:  restore draggable after pressing 'esc' key
            if ($(this).not('.drawing-container').css('borderStyle') !== 'solid') {
                //$('.pptx2html [style*="absolute"]').not('.drawing-container').css({'borderStyle': 'dashed', 'borderColor': '#33cc33'});
                $(this).not('.drawing-container').css({'borderStyle': 'solid', 'borderWidth': '1px', 'borderColor': 'rgba(30,120,187,0.5)'});
            }

        });

        $('.pptx2html > [style*="absolute"]').click(function() {
        //$('.pptx2html').click(function() {
            if (!$(this).hasClass('activeContent'))
            {
                //reset cursor
                $(this).focus();
                //$(this).select();
                //if(!$(this).draggable( 'instance' )){$(this).draggable({cursor: 'move', containment: '#inlineContent'});}
                if(!$('.activeContent').draggable( 'instance' )){$('.activeContent').draggable({cursor: 'move'});}
                $('.activeContent').css('cursor', 'pointer');
                //$('.activeContent').css('background-color','');
                //$('.activeContent').mouseleave(function(){$(this).css('background-color','');});
                $('.activeContent').not('.drawing-container').css({'borderStyle': '', 'borderWidth': '', 'borderColor': ''});
                $('.activeContent').removeClass('activeContent');
            }
        });


        $('.pptx2html > [style*="absolute"]').css('cursor', 'pointer');
        $('.pptx2html > [style*="absolute"]').hover(function() {
            $(this).draggable({cursor: 'move'});
            $(this).css({'box-shadow':'0 0 5px rgba(81, 203, 238, 1)', 'animation': 'blink .5s step-end infinite alternate'});
        }, function() {
            $(this).css('box-shadow','');
            //$(this).not('.drawing-container').css({'borderStyle': '', 'borderWidth': '', 'borderColor': ''});
        });

        //give each input element a tab index
        //$('.pptx2html > [style*="absolute"]').each(function (i) { $(this).attr('tabindex', i + 1); });
        $('.pptx2html > [style*="absolute"]').each(function () { if ($(this).attr('tabindex') !== ''){$(this).attr('tabindex', 0);} });


    }

    componentDidUpdate() {
        if(typeof(CKEDITOR.instances.inlineContent) !== 'undefined' && CKEDITOR.instances.inlineContent.getData().indexOf('pptx2html') !== -1)
        { // if pptx2html element with absolute content is in slide content (underlying HTML)
            this.inputBoxButtonTitle = 'Add input box';
        } else { //if slide does not have pptx2html/canvas/absolute positioning
            this.inputBoxButtonTitle = 'Switch to canvas with input boxes';
        }
    }

    addBorders() {
        //do not put borders around empty divs containing SVG elements
        //if ($('.pptx2html [style*="absolute"]').not('.drawing-container').css('borderStyle') !== 'dashed') {
        if ($('.pptx2html [style*="absolute"]').not('.drawing-container').css('borderStyle') !== 'solid') {
            //$('.pptx2html [style*="absolute"]').not('.drawing-container').css({'borderStyle': 'dashed', 'borderColor': '#33cc33'});
            $('.pptx2html [style*="absolute"]').not('.drawing-container').css({'borderStyle': 'solid', 'borderWidth': '1px', 'borderColor': 'rgba(30,120,187,0.5)'});
        }
    }

    resize() {
        let containerwidth = document.getElementById('container').offsetWidth;
        let containerheight = document.getElementById('container').offsetHeight;
        //reset scaling of pptx2html element to get original size
        $('.pptx2html').css({'transform': '', 'transform-origin': ''});
        //Function to fit contents in edit and view component
        let pptxwidth = $('.pptx2html').width();
        let pptxheight = $('.pptx2html').height();
        //TODO - change to get right!
        this.scaleratio = containerwidth / (pptxwidth+50);
        $('.pptx2html').css({'transform': '', 'transform-origin': ''});
        $('.pptx2html').css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});

        //set height of content panel to at least size of pptx2html + (100 pixels * scaleratio).
        this.refs.slideEditPanel.style.height = ((pptxheight + 5 + 20) * this.scaleratio) + 'px';
        this.refs.inlineContent.style.height = ((pptxheight + 0 + 20) * this.scaleratio) + 'px';
    }

    handleClick(e, data) {
        console.log('Clicked on menu '+ data.item);
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
        //TODO - add zoomin button + restore button
        //TODO - center editable screen + space above + below
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
        //<div style={headerStyle} contentEditable='true' name='inlineHeader' ref='inlineHeader' id='inlineHeader' onInput={this.emitChange} dangerouslySetInnerHTML={{__html:this.props.title}}></div>

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
                <div className="ui" style={compStyle} ref='slideEditPanel'>
                    <div className={[style.reveal, 'reveal'].join(' ')}>
                        <div className={[style.slides, 'slides'].join(' ')}>
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
