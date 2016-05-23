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
        CKEDITOR.replace('nonInline');
        CKEDITOR.inline('inlineHeader');
        CKEDITOR.inline('inline');
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
            CKEDITOR.replace('nonInline');
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
        */
        return (
            <div>
                <textarea style={compStyle} name='nonInline' ref='nonInline' id='nonInline' value={this.props.content} rows="10" cols="80" onChange={this.handleEditorChange}></textarea>
                <br />
                <br />
                <br />
                    <div contentEditable='true' name='inlineHeader' ref='inlineHeader' id='inlineHeader' dangerouslySetInnerHTML={{__html:'<h1>Inline example test - SLIDE TITLE</h1>' + this.props.selector.sid}}></div>
                    <div contentEditable='true' name='inline' ref='inline' id='inline' dangerouslySetInnerHTML={{__html:'<b>some CONTENT to be edited</b>' + this.props.content}}></div>
                <br />
                ...
                <br />
            </div>
        );
    }
}

export default SlideContentEditor;
