import React from 'react';
//import AlloyEditor from 'alloyeditor';
//import AlloyEditorComponent from '../../SlideModes/SlideEditPanel/AlloyEditor';
//import CKeditorComponent from './CKeditorComponent';
//import CKEDITOR from 'ckeditor';
//import ckeditor from 'ckeditor';
let ReactDOM = require('react-dom');

class SlideContentEditor extends React.Component {
    constructor(props) {
        super(props);
        this.currentcontent;
    }
    componentDidMount() {
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
        if (typeof(CKEDITOR.instances.inlineContent) === 'undefined'){CKEDITOR.inline('inlineContent', {customConfig: '../../../../../../assets/ckeditor_config.js'});}
        //if (typeof(CKEDITOR.instances.nonInline) === 'undefined'){CKEDITOR.replace('nonInline', {customConfig: '../../../../../../assets/ckeditor_config.js'});}
        this.currentcontent = this.props.content;
        ReactDOM.findDOMNode(this.refs.inlineContent).focus();
        //this.forceUpdate();
    }
    componentDidUpdate() {
        /*
        if (typeof(CKEDITOR.instances.nonInline) !== 'undefined' && this.currentcontent !== this.props.content)
        {   */
        /*If an instance of CKeditor exists,
            **and
            **the content of the slide has changed because of navigating to different slide (not because of WYSIWYG edit = is handleEditorChange() instead )
            ** TODO - probably a more fluent solution would be to use a CKeditor function for updating.
            *//*
            CKEDITOR.instances.nonInline.destroy();
            CKEDITOR.replace('nonInline', {customConfig: '../../../../../../assets/ckeditor_config.js'});
            //if (typeof(CKEDITOR.instances.inlineHeader) !== 'undefined'){CKEDITOR.instances.inlineHeader.destroy();CKEDITOR.inline('inlineHeader');}
            //if (typeof(CKEDITOR.instances.inlineContent) !== 'undefined'){CKEDITOR.instances.inlineContent.destroy();CKEDITOR.inline('inlineContent');}
            //if (typeof(CKEDITOR.instances.inlineSpeakerNotes) !== 'undefined'){CKEDITOR.instances.inlineSpeakerNotes.destroy();CKEDITOR.inline('inlineSpeakerNotes');}
            this.currentcontent = this.props.content;
            //alert('CKEDITOR destroyed, and content updated');
        }
        */
    }
    componentWillUnmount() {
        //TODO
        //CKEDITOR.instances.nonInline.destroy();
        CKEDITOR.instances.inlineHeader.destroy();
        CKEDITOR.instances.inlineContent.destroy();
        CKEDITOR.instances.inlineSpeakerNotes.destroy();
    }
    handleEditorChange(e) {
        //http://docs.ckeditor.com/#!/guide/dev_savedata
        console.log(e.target.getContent());
    }
    render() {
        //TODO: offer option to switch between inline-editor (alloy) and permanent/full editor (CKeditor)
        //TODO - remove use of id - Only use 'ref=' for React. Find CKeditor create function(s) that do not require id.

        const headerStyle = {
            minWidth: '100%',
            maxHeight: 60,
            minHeight: 60,
            overflowY: 'auto'
        };        const contentStyle = {
            minWidth: '100%',
            maxHeight: 500,
            minHeight: 500,
            overflowY: 'auto'
        };
        const speakernotesStyle = {
            minWidth: '100%',
            maxHeight: 120,
            minHeight: 120,
            overflowY: 'auto'
        };
        //<textarea style={compStyle} name='nonInline' ref='nonInline' id='nonInline' value={this.props.content} rows="10" cols="80" onChange={this.handleEditorChange}></textarea>
        return (
            <div>
            <br />
                Edit slide title:<br />
                <div style={headerStyle} contentEditable='true' name='inlineHeader' ref='inlineHeader' id='inlineHeader' dangerouslySetInnerHTML={{__html:'<h1>SLIDE ' + this.props.selector.sid + ' TITLE</h1>'}}></div>
                <br />
                Edit slide content:<br />
                <div style={contentStyle} contentEditable='true' name='inlineContent' ref='inlineContent' id='inlineContent' dangerouslySetInnerHTML={{__html:this.props.content}}></div>
                <br />
                Edit speaker notes:<br />
                <div style={speakernotesStyle} contentEditable='true' name='inlineSpeakerNotes' ref='inlineSpeakerNotes' id='inlineSpeakerNotes' dangerouslySetInnerHTML={{__html:'<b>Speaker Notes</b>'}}></div>
            </div>
        );
    }
}

export default SlideContentEditor;
