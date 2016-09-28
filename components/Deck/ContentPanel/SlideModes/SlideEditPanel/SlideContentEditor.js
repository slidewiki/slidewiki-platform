import React from 'react';
//import AlloyEditor from 'alloyeditor';
//import AlloyEditorComponent from '../../SlideModes/SlideEditPanel/AlloyEditor';
//import CKeditorComponent from './CKeditorComponent';
//import CKEDITOR from 'ckeditor';
//import ckeditor from 'ckeditor';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import addSlide from '../../../../../actions/slide/addSlide';
import saveSlide from '../../../../../actions/slide/saveSlide';
import loadSlideAll from '../../../../../actions/slide/loadSlideAll';
import ResizeAware from 'react-resize-aware';
import { findDOMNode } from 'react-dom';
import UserProfileStore from '../../../../../stores/UserProfileStore';

let ReactDOM = require('react-dom');

//let simpledraggable = require('simple-draggable'); //remove window dependency
//let SimpleDraggable = require('../../../../../assets/simpledraggable');


class SlideContentEditor extends React.Component {
    constructor(props) {
        super(props);
        this.currentcontent;
        this.refresh = 'false';
        this.CKEDitor_loaded = false;
        //this.props.scaleratio = 1;
        this.scaleratio = 1;
    }
    handleSaveButton(){

        if (this.props.UserProfileStore.username === '') {
            alert('you need to login to save changes');
        }
        else
        {
            alert('saving changes');
            //remove editing borders:
            $('.pptx2html [style*="absolute"]')
            .css({'borderStyle': '', 'borderColor': ''});

            //reset scaling of pptx2html element to get original size
            $(".pptx2html").css({'transform': '', 'transform-origin': ''});

            //ReactDOM.findDOMNode(this.refs.inlineContent).attr('value');
            //ReactDOM.findDOMNode(this.refs.inlineContent).getContent();
            //let slide.content = 'test';
            //this.context.executeAction(saveSlide, {slide});
            //let slide = 'test';
            let title = CKEDITOR.instances.inlineHeader.getData();
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
            this.context.executeAction(saveSlide,
              {id: currentSelector.sid, deckID: deckID, title: title, content: content, speakernotes: speakernotes, selector: currentSelector});
            //console.log('saving slide');
            this.resize();
        }
        return false;
    }
    componentDidMount() {
        if(process.env.BROWSER){
            //require('../../../../../bower_components/reveal.js/css/reveal.css');
            // Uncomment this to see with the different themes.  Assuming testing for PPTPX2HTML for now
            // Possible values: ['beige', 'black', 'blood', 'league', 'moon', 'night', 'serif', 'simple', 'sky', 'solarized', 'white']
            // require('../../../../../bower_components/reveal.js/css/theme/black.css');
            // require('../../../../../bower_components/reveal.js/css/theme/black.css');
            //require('../../SetupReveal.css');
            /*add border*/
            $(".pptx2html [style*='absolute']")
            .css({'borderStyle': 'dashed dashed dashed dashed', 'borderColor': '#33cc33'});
        }
        //TODO/bug? = inline-toolbar does not resize properly when zooming in browser. Does work in example on CKeditor website..
        //TODO: needs sharedspace plugin for proper positioning of inline toolbars + http://ckeditor.com/addon/closebtn plugin for closing inline editor
        //TODO: refresh of edit pages resets the toolbar configuration to default - needs fix

        if (typeof(CKEDITOR.instances.inlineHeader) === 'undefined'){CKEDITOR.inline('inlineHeader', {
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
            removeButtons: 'Undo, Clipboard, Source,Save,NewPage,Preview,Print,Templates,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Button,Select,HiddenField,ImageButton,Subscript,Superscript,RemoveFormat,NumberedList,Outdent,BulletedList,Indent,Blockquote,CreateDiv,Language,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Maximize,ShowBlocks,About'
        });}

        CKEDITOR.disableAutoInline = true;
        //if (typeof(CKEDITOR.instances.title) === 'undefined'){CKEDITOR.instances.title.destroy();}
        //TODO - remove more buttons speakernotes
        if (typeof(CKEDITOR.instances.inlineSpeakerNotes) === 'undefined'){CKEDITOR.inline('inlineSpeakerNotes', {
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
            removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Button,Select,HiddenField,ImageButton,Subscript,Superscript,RemoveFormat,NumberedList,Outdent,BulletedList,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Maximize,ShowBlocks,About'
        });}
        //if (typeof(CKEDITOR.instances.inlineContent) === 'undefined'){CKEDITOR.inline('inlineContent', {customConfig: '../../../../../../assets/ckeditor_config.js'});}
        //if (typeof(CKEDITOR.instances.inlineContent) === 'undefined'){CKEDITOR.inline('inlineContent', {customConfig: '../../../../../../custom_modules/ckeditor/config.js'});}
        if (typeof(CKEDITOR.instances.inlineContent) === 'undefined'){CKEDITOR.inline('inlineContent');}
        //if (typeof(CKEDITOR.instances.inlineContent) === 'undefined'){CKEDITOR.inline('inlineContent');}
        //if (typeof(CKEDITOR.instances.nonInline) === 'undefined'){CKEDITOR.replace('nonInline', {customConfig: '../../../../../../assets/ckeditor_config.js'});}
        this.currentcontent = this.props.content;
        //ReactDOM.findDOMNode(this.refs.inlineHeader).focus();
        //ReactDOM.findDOMNode(this.refs.title).focus();

        //let simpledraggable = require('simple-draggable');
        //require('../../../../../assets/simpledraggable');
        //alert('test' + document.querySelectorAll("div.draggable"));
        //alert('test' + document.querySelectorAll("draggable"));

        //KLAAS ADAPT once CKeditor for content is succesfully loaded -> apply drag and resize handlers.
        //CKEDITOR.on('instanceReady', function(){
        //CKEDITOR.on('loaded', function(){
        /*
        CKEDITOR.instances.inlineContent.on("instanceReady", function() {

            //this.CKEditor_loaded = true; });

            //alert('test' + this.refresh);
            //execute only once
            //if (this.CKEDitor_loaded === true)
            //if (this.refresh === 'false')
            //{
            //    refresh = 'true';
                //alert('test1');
                //console.log('componentDidUpdate');
                //let simpledraggable = require('simple-draggable');
                //let simpledraggable =
                //../../../../../../assets/ckeditor_config.js
                //require('../../../../../assets/simple-draggable.js');

                require('../../../../../custom_modules/simple-draggable/lib/index.js');

                if(process.env.BROWSER){

                //require('../../../../../custom_modules/simple-draggable/lib/index.js');
                //SimpleDraggable('div.draggable', {
                //test on: http://localhost:3000/deck/344-2/slide/1397-1/1397-1:10/edit
                //SimpleDraggable('.pptx2html.div.draggable', {
                //SimpleDraggable('.div.draggable', {
                //alert($('.pptx2html.div').css("position"));
                //alert($('.pptx2html .block').css("position"));
                    //if ($('.pptx2html .block').css('position') === 'absolute')
                    //{/*add border*/ /* $('.pptx2html .block')
                    //if ($('.pptx2html').css('position') === 'absolute')
                    //{/*add border*/
                    /*    $(".pptx2html [style*='absolute']")
                        .css({'borderStyle': 'dashed dashed dashed dashed', 'borderColor': '#33cc33'});
                    //}

                    //need to remove existing event listener functions!!!
                    //                    , ratio: this.props.SlideEditStore.scaleratio
                  SimpleDraggable(".pptx2html [style*='absolute']", {
                      onlyX: false
                    , onlyY: false
                    , ratio: this.scaleratio
                  });
                }
                /*
                //SimpleDraggable('.block', {
                SimpleDraggable('.pptx2html .block', {
                    onlyX: false
                  , onlyY: false
                  , onStart: function (event, element) {
                      // Do something on drag start
                      //console.log('dragging start');
                  }
                  , onStop: function (event, element) {
                      // Do something on drag stop
                     // console.log('dragging stop');
                  }
                  , onDrag: function (event, element) {
                      // Do something on drag drag
                     // console.log('dragging element');
                  }
                });*/
                //based on querySelectorAll (selects based on class of elements - get all children + apply draggable x & y positioning)
                //TODO: remove surrounding DIVS of some PPTX2HTML output elements
                //########Works well with following PPTX2HTML output:
                // (TODO: Add class='draggable' to output! as well as style="resize: both; overflow: auto;)
                /*<div _id="4" _idx="1" _name="Text Placeholder 3" _type="body" class="draggable block content v-down" draggable="true" id="4" style="resize: both; overflow: auto; position: absolute; top: 245px; left: 52px; width: 612px; height: 122px; border: 1pt none rgb(0, 0, 0);">
                <div class="h-left">&nbsp;<span class="text-block" style="color: #000; font-size: 28pt; font-family: Calibri; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">What can</span><br>
                <br>
                <span class="text-block" style="color: #000; font-size: 28pt; font-family: Calibri; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">we learn from </span></div>

                <div class="h-left"><span class="text-block" style="color: #000; font-size: 28pt; font-family: Calibri; font-weight: initial; font-style: normal; text-decoration: initial; vertical-align: ;">the technology market?</span></div>
                </div>*/

                //TODO change style elements of PPTX2HTML divs based on loading Firefox (+IE?) or Chrome (+Safari) (or other browsers?)


                //if (typeof(CKEDITOR.instances.nonInline) !== 'undefined' && this.currentcontent !== this.props.content)
                //{
                /*If an instance of CKeditor exists,
                    **and
                    **the content of the slide has changed because of navigating to different slide (not because of WYSIWYG edit = is handleEditorChange() instead )
                    ** TODO - probably a more fluent solution would be to use a CKeditor function for updating.
                    */
                    /*
                    CKEDITOR.instances.nonInline.destroy();
                    CKEDITOR.replace('nonInline', {customConfig: '../../../../../../assets/ckeditor_config.js'});
                    //if (typeof(CKEDITOR.instances.inlineHeader) !== 'undefined'){CKEDITOR.instances.inlineHeader.destroy();CKEDITOR.inline('inlineHeader');}
                    //if (typeof(CKEDITOR.instances.inlineContent) !== 'undefined'){CKEDITOR.instances.inlineContent.destroy();CKEDITOR.inline('inlineContent');}
                    //if (typeof(CKEDITOR.instances.inlineSpeakerNotes) !== 'undefined'){CKEDITOR.instances.inlineSpeakerNotes.destroy();CKEDITOR.inline('inlineSpeakerNotes');}
                    this.currentcontent = this.props.content;
                    //alert('CKEDITOR destroyed, and content updated');
                }*/
                //}

                /*
                //set intitial resize:
                //TODO: make function to prevent repetition! - shared function with slide view!

                    let containerwidth = document.getElementById('container').offsetWidth;
                    let containerheight = document.getElementById('container').offsetHeight;
                    //console.log('Component has been resized! Width =' + containerwidth + 'height' + containerheight);

                    //reset scaling of pptx2html element to get original size
                    $(".pptx2html").css({'transform': '', 'transform-origin': ''});

                    //let pptxwidth = document.getElementByClassName('pptx2html').offsetWidth;
                    //let pptxheight = document.getElementByClassName('pptx2html').offsetHeight;
                    let pptxwidth = $('.pptx2html').width();
                    let pptxheight = $('.pptx2html').height();
                    //console.log('pptx2html Width =' + pptxwidth + 'height' + pptxheight);

                    //only calculate scaleration for width for now
                    if (containerwidth > pptxwidth)
                    {
                        this.scaleratio = pptxwidth / containerwidth;
                        //console.log(this.scaleratio);
                        //this.props.SlideEditStore.scaleratio = containerwidth / pptxwidth;
                        //let scaleratio = containerwidth / pptxwidth;
                    } else {
                        this.scaleratio = containerwidth / pptxwidth;
                        //console.log(this.scaleratio);
                        //this.props.SlideEditStore.scaleratio = pptxwidth / containerwidth;
                        //let scaleratio = pptxwidth / containerwidth;
                    }
                    //Function to fit contents in edit and view component
                    //$(".pptx2html").addClass('schaal');
                    //$(".pptx2html [style*='absolute']").addClass('schaal');
                    //$(".pptx2html").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                    //$("#inlineContent").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                    if(process.env.BROWSER){
                        if ($('.pptx2html').length)
                        {
                            //$(".pptx2html").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                            //$(".pptx2html").css({'transform': 'scale('+scaleratio+','+scaleratio+')', 'transform-origin': 'top left'});
                            //$(".pptx2html").css({'transform': 'scale('+this.props.SlideEditStore.scaleratio+','+this.props.SlideEditStore.scaleratio+')', 'transform-origin': 'top left'});
                            $(".pptx2html").css({'transform': '', 'transform-origin': ''});
                            $(".pptx2html").css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});

                            require('../../../../../custom_modules/simple-draggable/lib/index.js');

                            //TODO: give +this.props.SlideEditStore.scaleratio to ptx2html - DONE?
                            //TODO: remove previous event listeners!
                            //, ratio: this.props.SlideEditStore.scaleratio
                            SimpleDraggable(".pptx2html [style*='absolute']", {
                                onlyX: false
                              , onlyY: false
                              , ratio: this.scaleratio
                            });

                            //make z-index of pptx2html output negative for preventing overlap over CKeditor and login modal
                            //use algorithm for selecting all elements in simple-draggable!!
                            //z-index = z-index -999999
                            //$(".pptx2html [style*='absolute']").css({'z-index': '-1'});
                        } else {
                            //Do nothing for slideview - is relative content - will be scaled automatically?!

                            //$(".slides").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                            //$(".pptx2html").css({'z-index': ''});
                        }
                    }
                    if(process.env.BROWSER){
                        if ($('.pptx2html').length)
                        {
                            //$(".pptx2html").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                            //$(".pptx2html").css({'transform': 'scale('+scaleratio+','+scaleratio+')', 'transform-origin': 'top left'});
                            //$(".pptx2html").css({'transform': 'scale('+this.props.SlideEditStore.scaleratio+','+this.props.SlideEditStore.scaleratio+')', 'transform-origin': 'top left'});
                            $(".pptx2html").css({'transform': '', 'transform-origin': ''});
                            $(".pptx2html").css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});

                            require('../../../../../custom_modules/simple-draggable/lib/index.js');

                            //TODO: give +this.props.SlideEditStore.scaleratio to ptx2html - DONE?
                            //TODO: remove previous event listeners!
                            //, ratio: this.props.SlideEditStore.scaleratio
                            SimpleDraggable(".pptx2html [style*='absolute']", {
                                onlyX: false
                              , onlyY: false
                              , ratio: this.scaleratio
                            });

                            //make z-index of pptx2html output negative for preventing overlap over CKeditor and login modal
                            //use algorithm for selecting all elements in simple-draggable!!
                            //z-index = z-index -999999
                            //$(".pptx2html [style*='absolute']").css({'z-index': '-1'});
                        } else {
                            //Do nothing for slideview - is relative content - will be scaled automatically?!

                            //$(".slides").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                            //$(".pptx2html").css({'z-index': ''});
                        }
                    }

            });
            */



            ReactDOM.findDOMNode(this.refs.container).addEventListener('resize', (evt) =>
                {
                    /*
                let containerwidth = document.getElementById('container').offsetWidth;
                let containerheight = document.getElementById('container').offsetHeight;
                //console.log('Component has been resized! Width =' + containerwidth + 'height' + containerheight);

                //reset scaling of pptx2html element to get original size
                $(".pptx2html").css({'transform': '', 'transform-origin': ''});

                //let pptxwidth = document.getElementByClassName('pptx2html').offsetWidth;
                //let pptxheight = document.getElementByClassName('pptx2html').offsetHeight;
                let pptxwidth = $('.pptx2html').width();
                let pptxheight = $('.pptx2html').height();
                //console.log('pptx2html Width =' + pptxwidth + 'height' + pptxheight);

                //only calculate scaleration for width for now
                if (containerwidth > pptxwidth)
                {
                    this.scaleratio = pptxwidth / containerwidth;
                    //console.log(this.scaleratio);
                    //this.props.SlideEditStore.scaleratio = containerwidth / pptxwidth;
                    //let scaleratio = containerwidth / pptxwidth;
                } else {
                    this.scaleratio = containerwidth / pptxwidth;
                    //console.log(this.scaleratio);
                    //this.props.SlideEditStore.scaleratio = pptxwidth / containerwidth;
                    //let scaleratio = pptxwidth / containerwidth;
                }
                */
                //Function to fit contents in edit and view component
                //$(".pptx2html").addClass('schaal');
                //$(".pptx2html [style*='absolute']").addClass('schaal');
                //$(".pptx2html").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                //$("#inlineContent").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                if(process.env.BROWSER){
                    this.resize();
                    /*
                    if ($('.pptx2html').length)
                    {
                        //$(".pptx2html").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                        //$(".pptx2html").css({'transform': 'scale('+scaleratio+','+scaleratio+')', 'transform-origin': 'top left'});
                        //$(".pptx2html").css({'transform': 'scale('+this.props.SlideEditStore.scaleratio+','+this.props.SlideEditStore.scaleratio+')', 'transform-origin': 'top left'});
                        $(".pptx2html").css({'transform': '', 'transform-origin': ''});
                        $(".pptx2html").css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});

                        require('../../../../../custom_modules/simple-draggable/lib/index.js');

                        //TODO: give +this.props.SlideEditStore.scaleratio to ptx2html - DONE?
                        //TODO: remove previous event listeners!
                        //, ratio: this.props.SlideEditStore.scaleratio
                        SimpleDraggable(".pptx2html [style*='absolute']", {
                            onlyX: false
                          , onlyY: false
                          , ratio: this.scaleratio
                        });

                        //make z-index of pptx2html output negative for preventing overlap over CKeditor and login modal
                        //use algorithm for selecting all elements in simple-draggable!!
                        //z-index = z-index -999999
                        //$(".pptx2html [style*='absolute']").css({'z-index': '-1'});
                    } else {
                        //Do nothing for slideview - is relative content - will be scaled automatically?!

                        //$(".slides").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                        //$(".pptx2html").css({'z-index': ''});
                    }*/
                }
                CKEDITOR.instances.inlineContent.on("instanceReady", function() {
                if(process.env.BROWSER){
                    this.resize();
                    /*
                    if ($('.pptx2html').length)
                    {
                        //$(".pptx2html").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                        //$(".pptx2html").css({'transform': 'scale('+scaleratio+','+scaleratio+')', 'transform-origin': 'top left'});
                        //$(".pptx2html").css({'transform': 'scale('+this.props.SlideEditStore.scaleratio+','+this.props.SlideEditStore.scaleratio+')', 'transform-origin': 'top left'});
                        $(".pptx2html").css({'transform': '', 'transform-origin': ''});
                        $(".pptx2html").css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});

                        require('../../../../../custom_modules/simple-draggable/lib/index.js');

                        //TODO: give +this.props.SlideEditStore.scaleratio to ptx2html - DONE?
                        //TODO: remove previous event listeners!
                        //, ratio: this.props.SlideEditStore.scaleratio
                        SimpleDraggable(".pptx2html [style*='absolute']", {
                            onlyX: false
                          , onlyY: false
                          , ratio: this.scaleratio
                        });

                        //make z-index of pptx2html output negative for preventing overlap over CKeditor and login modal
                        //use algorithm for selecting all elements in simple-draggable!!
                        //z-index = z-index -999999
                        //$(".pptx2html [style*='absolute']").css({'z-index': '-1'});
                    } else {
                        //Do nothing for slideview - is relative content - will be scaled automatically?!

                        //$(".slides").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                        //$(".pptx2html").css({'z-index': ''});
                    }
                    */
                    }
                });

            });
        //setTimeout(this.forceUpdate(), 500);
        this.forceUpdate();

    }
    componentDidUpdate() {
        this.resize();
    }
    resize()
    {
        let containerwidth = document.getElementById('container').offsetWidth;
        let containerheight = document.getElementById('container').offsetHeight;
        //console.log('Component has been resized! Width =' + containerwidth + 'height' + containerheight);

        //reset scaling of pptx2html element to get original size
        $(".pptx2html").css({'transform': '', 'transform-origin': ''});

        //let pptxwidth = document.getElementByClassName('pptx2html').offsetWidth;
        //let pptxheight = document.getElementByClassName('pptx2html').offsetHeight;
        let pptxwidth = $('.pptx2html').width();
        let pptxheight = $('.pptx2html').height();
        //console.log('pptx2html Width =' + pptxwidth + 'height' + pptxheight);

        //only calculate scaleration for width for now
        if (containerwidth > pptxwidth)
        {
            this.scaleratio = pptxwidth / containerwidth;
            //console.log(this.scaleratio);
            //this.props.SlideEditStore.scaleratio = containerwidth / pptxwidth;
            //let scaleratio = containerwidth / pptxwidth;
        } else {
            this.scaleratio = containerwidth / pptxwidth;
            //console.log(this.scaleratio);
            //this.props.SlideEditStore.scaleratio = pptxwidth / containerwidth;
            //let scaleratio = pptxwidth / containerwidth;
        }
        //Function to fit contents in edit and view component
        //$(".pptx2html").addClass('schaal');
        //$(".pptx2html [style*='absolute']").addClass('schaal');
        //$(".pptx2html").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
        //$("#inlineContent").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
            if ($('.pptx2html').length)
            {
                //$(".pptx2html").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                //$(".pptx2html").css({'transform': 'scale('+scaleratio+','+scaleratio+')', 'transform-origin': 'top left'});
                //$(".pptx2html").css({'transform': 'scale('+this.props.SlideEditStore.scaleratio+','+this.props.SlideEditStore.scaleratio+')', 'transform-origin': 'top left'});
                $(".pptx2html").css({'transform': '', 'transform-origin': ''});
                $(".pptx2html").css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});
                require('../../../../../custom_modules/simple-draggable/lib/index.js');

                //TODO: give +this.props.SlideEditStore.scaleratio to ptx2html - DONE?
                //TODO: remove previous event listeners!
                //, ratio: this.props.SlideEditStore.scaleratio
                SimpleDraggable(".pptx2html [style*='absolute']", {
                    onlyX: false
                  , onlyY: false
                  , ratio: this.scaleratio
                });
            }
    }

    componentWillUnmount() {
        //TODO
        //CKEDITOR.instances.nonInline.destroy();
        //CKEDITOR.instances.inlineHeader.destroy();
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
        const headerStyle = {
            minWidth: '100%',
            overflowY: 'auto',
            borderStyle: 'dashed dashed none dashed',
            borderColor: '#e7e7e7',
            position: 'relative'
        };
        const contentStyle = {
            minWidth: '100%',
            // maxHeight: 450,
            minHeight: 450,
            overflowY: 'auto',
            borderStyle: 'dashed',
            borderColor: '#e7e7e7',
        };
        const speakernotesStyle = {
            minWidth: '100%',
            maxHeight: 120,
            minHeight: 120,
            overflowY: 'auto',
            borderStyle: 'dashed',
            borderColor: '#e7e7e7',
            position: 'relative'
        };

        const compStyle = {
            // maxHeight: 450,
            minHeight: 450,
            overflowY: 'auto',
            position: 'relative'
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

        return (
                <ResizeAware ref='container' id='container' style={{position: 'relative'}}>
                    <button tabIndex="0" ref="submitbutton" className="ui button blue" onClick={this.handleSaveButton.bind(this)} onChange={this.handleSaveButton.bind(this)}>
                     <i className="save icon"></i>
                     Save
                    </button>
                    <div class="ui" style={compStyle}>
                        <div className="reveal">
                            <div className="slides">
                                    <div style={contentStyle} contentEditable='true' name='inlineContent' ref='inlineContent' id='inlineContent' dangerouslySetInnerHTML={{__html:this.props.content}}></div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <hr />
                    <br />

                    <b>Speaker notes:</b><br />
                    <div style={speakernotesStyle} contentEditable='true' name='inlineSpeakerNotes' ref='inlineSpeakerNotes' id='inlineSpeakerNotes' dangerouslySetInnerHTML={{__html:this.props.speakernotes}}></div>
                </ResizeAware>

        );
    }
}

SlideContentEditor.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

SlideContentEditor = connectToStores(SlideContentEditor, [SlideEditStore, UserProfileStore], (context, props) => {
    return {
        SlideEditStore: context.getStore(SlideEditStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default SlideContentEditor;
