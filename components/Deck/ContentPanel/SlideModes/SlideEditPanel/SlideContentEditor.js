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
import addSlide from '../../../../../actions/slide/addSlide';
import saveSlide from '../../../../../actions/slide/saveSlide';
import loadSlideAll from '../../../../../actions/slide/loadSlideAll';
import ResizeAware from 'react-resize-aware';
import { findDOMNode } from 'react-dom';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import {Microservices} from '../../../../../configs/microservices';

let ReactDOM = require('react-dom');

//let simpledraggable = require('simple-draggable'); //remove window dependency
//let SimpleDraggable = require('../../../../../assets/simpledraggable');
const absolutediv = '<div style="position: absolute; top: 50px; left: 100px; width: 400px; height: 200px; z-index: 80000;"><div class="h-mid" style="text-align: center;"><span class="text-block h-mid" style="color: #000; font-size: 44pt; font-family: Calibri; font-weight: initial; font-style: normal; ">New content</span></div></div>';


class SlideContentEditor extends React.Component {
    constructor(props) {
        super(props);
        this.currentcontent;
        this.refresh = 'false';
        this.CKEDitor_loaded = false;
        //this.props.scaleratio = 1;
        this.scaleratio = 1;
        this.addBoxButtonHTML = '';
    }
    handleSaveButton(){

        if (this.props.UserProfileStore.username === '')
        {
            //TODO: show login modal via context action
            alert('you need to login to save changes');
        }
        else
        {
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
            //remove editing borders:
            $('.pptx2html [style*="absolute"]')
            .css({'borderStyle': '', 'borderColor': ''});
            $(".pptx2html")
            .css({'borderStyle': '', 'borderColor': '', 'box-shadow': ''});
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
            let dataSources = (this.props.DataSourceStore.dataSources !== undefined) ? this.props.DataSourceStore.dataSources : [];
            this.context.executeAction(saveSlide,
              {id: currentSelector.sid, deckID: deckID, title: title, content: content, speakernotes: speakernotes, dataSources: dataSources, selector: currentSelector});
            //console.log('saving slide');
            this.resize();
        }
        return false;
    }
    addAbsoluteDiv() {
        //absolutediv
        //this.props.SlideEditStore.content = CKEDITOR.instances.inlineContent.getData();
        $('.pptx2html').append(absolutediv);
        $(".pptx2html [style*='absolute']")
        .css({'borderStyle': 'dashed dashed dashed dashed', 'borderColor': '#33cc33'});
        this.forceUpdate();
    }
    componentDidMount() {
        //alert('remount');
        const userId = this.props.UserProfileStore.userid;

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
            removeButtons: 'Youtube,texzilla,Sourcedialog,CodeSnippet,Undo,Clipboard,Source,Save,NewPage,Preview,Print,Templates,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Button,Select,HiddenField,ImageButton,Subscript,Superscript,RemoveFormat,NumberedList,Outdent,BulletedList,Indent,Blockquote,CreateDiv,Language,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Maximize,ShowBlocks,About',
            filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId
        });}

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
            removeButtons: 'Youtube,texzilla,Sourcedialog,CodeSnippet,Source,Save,NewPage,Preview,Print,Templates,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Button,Select,HiddenField,ImageButton,Subscript,Superscript,RemoveFormat,NumberedList,Outdent,BulletedList,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Maximize,ShowBlocks,About',
            filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId
        });}
        if (typeof(CKEDITOR.instances.inlineContent) === 'undefined'){
            //alert('test');
            //console.log(userId);
            // CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: 'http://localhost:4000/importImage/' + userId, customConfig: '../../../../../../assets/ckeditor_config.js'});

            //if (typeof(CKEDITOR.instances.inlineContent) === 'undefined'){CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: Microservices.import.uri +  + '/importImage/' + userId, customConfig: '../../../../../../assets/ckeditor_config.js'});
            //CKEDITOR.inline('inlineContent', {customConfig: '../../../../../../assets/ckeditor_config.js'});
            //CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId, customConfig: '../../../../../../assets/ckeditor_config.js'});
            //alert('test: ' + Microservices.import.uri + '/importImage/' + userId);
            //CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId, customConfig: '../../../../../../custom_modules/ckeditor/config.js'});
            //CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId, customConfig: '../../../../../../custom_modules/ckeditor/config.js'});
            CKEDITOR.inline('inlineContent', {filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId}); //leave all buttons

        }
        this.currentcontent = this.props.content;

        ReactDOM.findDOMNode(this.refs.container).addEventListener('resize', (evt) =>
        {
                if(process.env.BROWSER){
                    //this.resize();
                    //alert('resize');
                    this.forceUpdate();
                }
        });

        CKEDITOR.instances.inlineContent.on("instanceReady", function() {
        //needs copy of resize function == cannot find this.something in this context.
        //tried ReactDOM.findDOMNode(this.refs.inlineContent).addEventListener('instanceReady', (evt) =>
        //but did not work
        //if(process.env.BROWSER){
            //this.resize();
            //alert('ckeditor load');
            //this.forceUpdate();
            //this.resize();
        //    }
            if ($(".pptx2html [style*='absolute']").css('borderStyle') !== 'dashed')
            {
                $(".pptx2html [style*='absolute']").css({'borderStyle': 'dashed', 'borderColor': '#33cc33'});
            }
            let containerwidth = document.getElementById('container').offsetWidth;
            let containerheight = document.getElementById('container').offsetHeight;
            $(".pptx2html").css({'transform': '', 'transform-origin': ''});
            let pptxwidth = $('.pptx2html').width();
            let pptxheight = $('.pptx2html').height();
            if (containerwidth > pptxwidth)
            {
                this.scaleratio = pptxwidth / containerwidth;
            } else {
                this.scaleratio = containerwidth / pptxwidth;
            }
            $(".pptx2html").css({'transform': '', 'transform-origin': ''});
            $(".pptx2html").css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});
            require('../../../../../custom_modules/simple-draggable/lib/index.js');

            SimpleDraggable(".pptx2html [style*='absolute']", {
                onlyX: false
              , onlyY: false
              , ratio: this.scaleratio
            });
            if(document.domain != "localhost")
            {
                document.domain = 'slidewiki.org';
            }
            $(".pptx2html").css({'borderStyle': 'none none double none', 'borderColor': '#3366ff', 'box-shadow': '0px 100px 1000px #ff8787'});
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
    }
    resize()
    {
        //if(process.env.BROWSER){
            //require('../../../../../bower_components/reveal.js/css/reveal.css');
            // Uncomment this to see with the different themes.  Assuming testing for PPTPX2HTML for now
            // Possible values: ['beige', 'black', 'blood', 'league', 'moon', 'night', 'serif', 'simple', 'sky', 'solarized', 'white']
            // require('../../../../../bower_components/reveal.js/css/theme/black.css');
            // require('../../../../../bower_components/reveal.js/css/theme/black.css');
            //require('../../SetupReveal.css');
            /*add border*/
            //alert($(".pptx2html [style*='absolute']").css('borderStyle'));
            if ($(".pptx2html [style*='absolute']").css('borderStyle') !== 'dashed')
            {
                $(".pptx2html [style*='absolute']").css({'borderStyle': 'dashed', 'borderColor': '#33cc33'});
            }
        //}

        let containerwidth = document.getElementById('container').offsetWidth;
        let containerheight = document.getElementById('container').offsetHeight;
        //console.log('Component has been resized! Width =' + containerwidth + 'height' + containerheight);

        //reset scaling of pptx2html element to get original size
        $(".pptx2html").css({'transform': '', 'transform-origin': ''});

        //Function to fit contents in edit and view component
        //let pptxwidth = document.getElementByClassName('pptx2html').offsetWidth;
        //let pptxheight = document.getElementByClassName('pptx2html').offsetHeight;
        let pptxwidth = $('.pptx2html').width();
        let pptxheight = $('.pptx2html').height();
        //console.log('pptx2html Width =' + pptxwidth + 'height' + pptxheight);

        this.scaleratio = containerwidth / pptxwidth;

        $(".pptx2html").css({'transform': '', 'transform-origin': ''});
        $(".pptx2html").css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});
        require('../../../../../custom_modules/simple-draggable/lib/index.js');

        //TODO: remove previous event listeners!
        SimpleDraggable(".pptx2html [style*='absolute']", {
            onlyX: false
          , onlyY: false
          , ratio: this.scaleratio
        });

        //set height of content panel to at least size of pptx2html + (100 pixels * scaleratio).
        this.refs.slideEditPanel.style.height = ((pptxheight + 5 + 20) * this.scaleratio) + 'px';
        this.refs.inlineContent.style.height = ((pptxheight + 0 + 20) * this.scaleratio) + 'px';

        //show that content is outside of pptx2html box
        $(".pptx2html").css({'borderStyle': 'none none double none', 'borderColor': '#3366ff', 'box-shadow': '0px 100px 1000px #ff8787'});

    }

    componentWillUnmount() {
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
            minHeight: 450,
            overflowY: 'auto',
            overflowX: 'hidden',
            //borderStyle: 'dashed',
            //borderColor: '#e7e7e7',
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
            //minHeight: 450,
            //overflowY: 'auto',
            //position: 'relative'
            //minWidth: '100%',
            // maxHeight: 450,
            minHeight: 450,
            //minHeight: '100%',
            overflowY: 'auto',
            //overflowX: 'hidden',
            overflowX: 'auto',
            //overflowY: 'visible',
            //overflow: 'hidden,'
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

        //Check if addboxbutton should be included
        if(this.props.content.indexOf('pptx2html') !== -1)
        { // if pptx2html element with absolute content is in slide content (underlying HTML)
            this.addBoxButtonHTML = <button tabIndex="0" ref="submitbutton" className="ui blue basic button" onClick={this.addAbsoluteDiv.bind(this)} onChange={this.addAbsoluteDiv.bind(this)}>
                             <i className="plus square outline icon"></i>
                             Add input box
                             </button>
        } else {this.addBoxButtonHTML = '';}

        return (

            <ResizeAware ref='container' id='container' style={{position: 'relative'}}>
                <button tabIndex="0" ref="submitbutton" className="ui button blue" onClick={this.handleSaveButton.bind(this)} onChange={this.handleSaveButton.bind(this)}>
                 <i className="save icon"></i>
                 Save
                </button>
                {this.addBoxButtonHTML}
                <div style={headerStyle} contentEditable='true' name='inlineHeader' ref='inlineHeader' id='inlineHeader' dangerouslySetInnerHTML={{__html:this.props.title}}></div>
                <hr />
                <div className="ui" style={compStyle} ref='slideEditPanel'>
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

SlideContentEditor = connectToStores(SlideContentEditor, [SlideEditStore, UserProfileStore, DataSourceStore], (context, props) => {
    return {
        SlideEditStore: context.getStore(SlideEditStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        DataSourceStore: context.getStore(DataSourceStore).getState()
    };
});
export default SlideContentEditor;
