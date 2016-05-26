import React from 'react';
//import AlloyEditor from 'alloyeditor';
//import AlloyEditorComponent from '../../SlideModes/SlideEditPanel/AlloyEditor';
//import CKeditorComponent from './CKeditorComponent';
//import CKEDITOR from 'ckeditor';
//import ckeditor from 'ckeditor';

class SlideContentEditor extends React.Component {
    constructor(props) {
        super(props);
        this.currentcontent;
        //this.currentCKeditorid;
    }
    componentDidMount() {
        //AlloyEditorComponent.editable(this.refs.deckEditPanel.id);
        //AlloyEditorComponent.editable(this.refs.deckEditPanel);
        //AlloyEditorComponent.editable(this.props.container);
        //AlloyEditorComponent.editable(this.props.container);

        //AlloyEditor.editable('myContentEditable');

        //AlloyEditor.editable('1');
        //AlloyEditor.editable(this.props.selector.sid);
        //CKEDITOR.replace('CKeditor1');
        //let myInstanceName = this.props.selector.sid;
        //if (CKEDITOR.instances[this.props.selector.sid]) CKEDITOR.instances[this.props.selector.sid].destroy();
        //CKEDITOR.replace('nonInline');

        //TODO/bug? = inline-toolbar does not resize properly when zooming in browser. Does work in example on CKeditor website..

        //if (typeof(CKEDITOR.instances.nonInline) === 'undefined'){CKEDITOR.replace('nonInline');}
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
		{ name: 'clipboard', groups: [ 'undo', 'clipboard' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'about', groups: [ 'about' ] }
            ],
            removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Button,Select,HiddenField,ImageButton,Subscript,Superscript,RemoveFormat,NumberedList,Outdent,BulletedList,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Maximize,ShowBlocks,About'
        });}
        if (typeof(CKEDITOR.instances.inlineContent) === 'undefined'){CKEDITOR.inline('inlineContent', {customConfig: '../../../../../../assets/ckeditor_config.js'});}
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
            removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Button,Select,HiddenField,ImageButton,Subscript,Superscript,RemoveFormat,NumberedList,Outdent,BulletedList,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Maximize,ShowBlocks,About'
        });}
        if (typeof(CKEDITOR.instances.nonInline) === 'undefined'){CKEDITOR.replace('nonInline', {customConfig: '../../../../../../assets/ckeditor_config.js'});}
        //CKEDITOR.replace('nonInline');
        //CKEDITOR.inline('inlineHeader');
        //CKEDITOR.inline('inlineContent');
        //CKEDITOR.inline('inlineSpeakerNotes');
        this.currentcontent = this.props.content;
        //CKEDITOR.replace(this.props.container);
        //CKEDITOR.replace(this.props.selector.sid);
        //CKEDITOR.replace(this.refs.CKeditor1), {language: 'fr', uiColor: '#9AB8F3'};
        //CKEDITOR.appendTO()
    }
    componentWillReceiveProps(nextProps) {
        // check editor exists before use
        //todo: update editor content
        //CKEDITOR.replace(this.props.selector.sid);
        //if (CKEDITOR.instances[this.props.selector.sid])
        //CKEDITOR.instances[this.props.selector.sid].destroy();
        //CKEDITOR.replace(this.props.selector.sid);
        //alert('test' + this.props.selector.sid);
        //alert(this.props.selector.sid + typeof(CKEDITOR.instances[this.props.selector.sid]));
        //alert(typeof(CKEDITOR.instances[this.props.selector.sid]));
    }
    componentDidUpdate() {
        //if (typeof(CKEDITOR.instances[this.props.selector.sid]) !== 'undefined' && this.currentCKeditorid !== this.props.selector.sid)
        //{
        //    CKEDITOR.instances[this.props.selector.sid].destroy();
        //    CKEDITOR.replace(this.props.selector.sid);
        //    this.currentCKeditorid = this.props.selector.sid;
        //    alert('CKEDITOR destroyed, and ID of editor instance (currentCKeditorid) updated');
        //}
        if (typeof(CKEDITOR.instances.nonInline) !== 'undefined' && this.currentcontent !== this.props.content)
        {   /*If an instance of CKeditor exists,
            **and
            **the content of the slide has changed because of navigating to different slide (not because of WYSIWYG edit = is handleEditorChange() instead )
            ** TODO - probably a more fluent solution would be to use a CKeditor function for updating.
            */
            CKEDITOR.instances.nonInline.destroy();
            CKEDITOR.replace('nonInline', {customConfig: '../../../../../../assets/ckeditor_config.js'});
            //if (typeof(CKEDITOR.instances.inlineHeader) !== 'undefined'){CKEDITOR.instances.inlineHeader.destroy();CKEDITOR.inline('inlineHeader');}
            //if (typeof(CKEDITOR.instances.inlineContent) !== 'undefined'){CKEDITOR.instances.inlineContent.destroy();CKEDITOR.inline('inlineContent');}
            //if (typeof(CKEDITOR.instances.inlineSpeakerNotes) !== 'undefined'){CKEDITOR.instances.inlineSpeakerNotes.destroy();CKEDITOR.inline('inlineSpeakerNotes');}
            this.currentcontent = this.props.content;
            //alert('CKEDITOR destroyed, and content updated');
        }
        //let myInstanceName = this.props.selector.sid;
        //if (CKEDITOR.instances[this.props.selector.sid]) CKEDITOR.instances[this.props.selector.sid].destroy();
        //CKEDITOR.replace(this.props.selector.sid);
        //alert('test' + this.props.selector.sid);
    }
    componentWillUnmount() {
        //TODO
        CKEDITOR.instances.nonInline.destroy();
        CKEDITOR.instances.inlineHeader.destroy();
        CKEDITOR.instances.inlineContent.destroy();
        CKEDITOR.instances.inlineSpeakerNotes.destroy();
        //AlloyEditor.destroy();
        //AlloyEditor.destroy(true);
        //let myInstanceName = this.props.selector.sid;
        //if (CKEDITOR.instances[this.props.selector.sid])
        //if (typeof(CKEDITOR.instances[this.props.selector.sid]) !== 'undefined')
        //{
        //    alert('test'); CKEDITOR.instances[this.props.selector.sid].destroy();
        //}
        //alert('test' + this.props.selector.sid + typeof(CKEDITOR.instances[this.props.selector.sid]));
        //CKEDITOR.instances[this.props.selector.sid].destroy(true);
        //AlloyEditor.instances[this.props.container].destroy(true);
    }
    handleEditorChange(e) {
        console.log(e.target.getContent());
    }
    render() {
        //TODO: offer option to switch between inline-editor (alloy) and permanent/full editor (CKeditor)
        const compStyle = {
            minWidth: '100%',
            maxHeight: 500,
            minHeight: 500,
            overflowY: 'auto'
        };
        //<textarea style={compStyle} ref={this.props.selector.sid} value={this.props.content} onChange={this.handleEditorChange} />
        //<AlloyEditorComponent container="1" ref={this.props.selector.sid} id={this.props.selector.sid} alloyEditorConfig={{}} content="test"></AlloyEditorComponent>
        //<AlloyEditorComponent  style={compStyle} container="1" ref={this.props.selector.sid} id={this.props.selector.sid} alloyEditorConfig={{}} content={this.props.content}></AlloyEditorComponent>
        //<textarea name="CKeditor1" ref="CKeditor1" rows="10" cols="80" content={this.props.content}></textarea>
        //<CKeditorComponent container="myContentEditable" id="myContentEditable" content={this.props.content}></AlloyEditorComponent>
        /*
        <textarea contenteditable='true' name='Inline' ref='Inline' id='Inline' onChange={this.handleEditorChange} value="
                            <h1>Inline example test</h1>
                            <p> some text to be edited</p>
                            <br />
        ">
        </textarea>
        //TODO - remove use of id - Only use 'ref=' for React. Find CKeditor create function(s) that do not require id.
        */
        return (
            <div>
                <br />
                    <div contentEditable='true' name='inlineHeader' ref='inlineHeader' id='inlineHeader' dangerouslySetInnerHTML={{__html:'<br /><br /><br /><h1>Inline example test - SLIDE ' + this.props.selector.sid + ' TITLE</h1><br /><br />'}}></div>
                    <br />
                    <div contentEditable='true' name='inlineContent' ref='inlineContent' id='inlineContent' dangerouslySetInnerHTML={{__html:'<b>CONTENT to be edited</b>' + this.props.content}}></div>
                    <br />
                    <br />
                    <div contentEditable='true' name='inlineSpeakerNotes' ref='inlineSpeakerNotes' id='inlineSpeakerNotes' dangerouslySetInnerHTML={{__html:'<b>Speaker Notes</b>'}}></div>
                <br />
                <textarea style={compStyle} name='nonInline' ref='nonInline' id='nonInline' value={this.props.content} rows="10" cols="80" onChange={this.handleEditorChange}></textarea>
            </div>
        );
    }
}

export default SlideContentEditor;
