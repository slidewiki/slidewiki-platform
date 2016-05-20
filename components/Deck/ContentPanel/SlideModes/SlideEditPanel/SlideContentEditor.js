import React from 'react';
//import AlloyEditor from 'alloyeditor';
//import AlloyEditorComponent from '../../SlideModes/SlideEditPanel/AlloyEditor';
import AlloyEditorComponent from './AlloyEditorComponent';
//import CKEDITOR from 'ckeditor';

class SlideContentEditor extends React.Component {
    componentDidMount() {
        //AlloyEditorComponent.editable(this.refs.deckEditPanel.id);
        //AlloyEditorComponent.editable(this.refs.deckEditPanel);
        //AlloyEditorComponent.editable(this.props.container);
        //AlloyEditorComponent.editable(this.props.container);

        //AlloyEditor.editable('myContentEditable');

        //AlloyEditor.editable('1');
        //AlloyEditor.editable(this.props.selector.sid);
        //CKEDITOR.replace('CKeditor1');
        //CKEDITOR.replace(this.props.container);
        //CKEDITOR.replace(this.props.selector.sid);
        //CKEDITOR.replace(this.refs.CKeditor1), {language: 'fr', uiColor: '#9AB8F3'};
        //CKEDITOR.appendTO()
    }
    componentWillReceiveProps(nextProps) {
        // check editor exists before use
        //todo: update editor content
        //CKEDITOR.replace('editor1');
    }
    componentDidUpdate() {
    }
    handleEditorChange(e) {
        console.log(e.target.getContent());
    }
    render() {
        //TODO: offer option to switch between inline-editor (alloy) and permanent/full editor (CKeditor)
        /*const compStyle = {
            minWidth: '100%',
            maxHeight: 500,
            minHeight: 500,
            overflowY: 'auto'
        };*/
        //<textarea style={compStyle} ref={this.props.selector.sid} value={this.props.content} onChange={this.handleEditorChange} />
        //<AlloyEditorComponent container="1" ref={this.props.selector.sid} id={this.props.selector.sid} alloyEditorConfig={{}} content="test"></AlloyEditorComponent>
        //<AlloyEditorComponent  style={compStyle} container="1" ref={this.props.selector.sid} id={this.props.selector.sid} alloyEditorConfig={{}} content={this.props.content}></AlloyEditorComponent>
        //<textarea name="CKeditor1" ref="CKeditor1" rows="10" cols="80" content={this.props.content}></textarea>
        return (
            <div>
                <AlloyEditorComponent container="myContentEditable" id="myContentEditable" content={this.props.content}></AlloyEditorComponent>
            </div>
        );
    }
}

export default SlideContentEditor;
