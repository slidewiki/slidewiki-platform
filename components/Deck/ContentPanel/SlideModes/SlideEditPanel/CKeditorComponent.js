import React from 'react';
import ReactDOM from 'react-dom';
//import AlloyEditor from 'alloyeditor';
import CKeditor from 'ckeditor';

//(Klaas note) TODO: fix bug - alloyeditor is not loaded when quickly focusing on (=clicking in) HTMLcontent of slideEditPanel onload
//editor is loaded as soon as you click outside the HTMLcontent in slideEditPanel

class CKeditorComponent extends React.Component {
    componentDidMount() {
        CKeditor.editable(this.props.container, this.alloyEditorConfig);
        //}
    }
    componentDidUpdate() {
    }
    componentWillUnmount() {
        //TODO
        //CKEDITOR.instances[this.props.container].destroy(true);
    }
    render() {
        return (
            <div id={this.props.container}
            dangerouslySetInnerHTML={{__html:this.props.content}}>
            </div>
        );
    }
}

export default AlloyEditorComponent;
