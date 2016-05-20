import React from 'react';
import ReactDOM from 'react-dom';
//import AlloyEditor from 'alloyeditor';

//(Klaas note) TODO: fix bug - alloyeditor is not loaded when quickly focusing on (=clicking in) HTMLcontent of slideEditPanel onload
//editor is loaded as soon as you click outside the HTMLcontent in slideEditPanel

class AlloyEditorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.alloyEditorConfig;
        this.Selections;
        this.toolbars;
    }
    componentDidMount() {
        this.Selections = [{
            name: 'text',
            buttons: ['bold', 'italic', 'underline', 'h1', 'h2', 'h3', 'subscript', 'superscript', 'strike',
                {
                    name: 'styles',
                    cfg: {
                        styles: [
                            {
                                name: 'Head 1',
                                style: { element: 'h1' }
                            },
                            {
                                name: 'Head 2',
                                style: { element: 'h2' }
                            },
                            {
                                name: 'Head 3',
                                style: { element: 'h3' }
                            },
                            {
                                name: 'Big',
                                style: { element: 'big' }
                            },
                            {
                                name: 'Small',
                                style: { element: 'small' }
                            },
                            {
                                name: 'Strikethrough',
                                style: { element: 'strike' }
                            },
                            {
                                name: 'Code',
                                style: { element: 'code' }
                            },
                            {
                                name: 'Remove Format',
                                style: { element: 'removeFormat' }
                            }
                        ]
                    }
                }, 'removeFormat',
                'paragraphLeft', 'paragraphCenter', 'paragraphRight', 'paragraphJustify' ,'outdentBlock', 'indentBlock',
                'ol', 'ul', 'link', 'quote', 'code', 'twitter'],
            test: AlloyEditor.SelectionTest.text
        }, {
            name: 'image',
            buttons: ['imageLeft', 'imageCenter','imageRight'],
            test: AlloyEditor.SelectionTest.image
        }, {
            name: 'link',
            buttons: ['linkEdit'],
            test: AlloyEditor.SelectionTest.link
        }, {
            name: 'table',
            buttons: ['tableHeading', 'tableRow', 'tableColumn', 'tableCell', 'tableRemove'],
            getArrowBoxClasses: AlloyEditor.SelectionGetArrowBoxClasses.table,
            setPosition: AlloyEditor.SelectionSetPosition.table,
            test: AlloyEditor.SelectionTest.table
        }];
        this.toolbars = {
            add: {
                buttons: ['image', 'camera', 'hline', 'table', 'ol', 'ul'],
                tabIndex: 2
            },
            styles: {
                selections: this.Selections,
                tabIndex: 1
            }
        };
        this.alloyEditorConfig = {
            extraPlugins: AlloyEditor.Core.ATTRS.extraPlugins.value + ',ae_autolink',
            toolbars: this.toolbars
        };
        //if (this.props.content !== '')
        //{
        AlloyEditor.editable(this.props.container, this.alloyEditorConfig);
        //}
    }
    componentDidUpdate() {
        /**
        ** Only load Alloy-Editor when the content has been loaded via loadSlideEdit.js
        **AND when there is not yet an instance of CKeditor
        ** ?TODO? = maybe we should, e.g., check for instance of AlloyEditor instead for increased reliability...
        ** UPDATE - FIX = only load WYSIWYG editor (=slideContentEditor and transitive AlloyEditorComponent) when this.props.content (HTML TO BE EDITED) is known in slideEditPanel.js 
        **/
        //if (this.props.content !== '' && typeof(CKEDITOR.instances[this.props.container]) === 'undefined')
        //{
        //AlloyEditor.editable(this.props.container, this.alloyEditorConfig);
        //}
    }
    componentWillUnmount() {
        //TODO
        //AlloyEditor.destroy();
        //AlloyEditor.destroy(true);
        //CKEDITOR.instances[this.props.container].destroy(true);
        //AlloyEditor.instances[this.props.container].destroy(true);
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
