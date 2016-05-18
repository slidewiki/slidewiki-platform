import React from 'react';
import ReactDOM from 'react-dom';
//import AlloyEditor from 'alloyeditor';

class AlloyEditorComponent extends React.Component {
    componentDidMount() {
        //ALLOYEDITOR_BASEPATH = '../node_modules/alloyeditor/dist/alloy-editor/';
        //CKEDITOR_BASEPATH = '../node_modules/alloyeditor/dist/alloy-editor/';
        //window.ALLOYEDITOR_BASEPATH = "../node_modules/alloyeditor/dist/alloy-editor/";
        //window.CKEDITOR_BASEPATH = "../node_modules/alloyeditor/dist/alloy-editor/";
        //window.ALLOYEDITOR_BASEPATH = '../custom_modules//alloy-editor/';
        //window.CKEDITOR_BASEPATH = '../custom_modules//alloy-editor/';
        //window.ALLOYEDITOR_BASEPATH = "../../../../";
        //window.CKEDITOR_BASEPATH = "../../../../";
        //AlloyEditor.editable($(this.props.container).attr('id'), this.props.alloyEditorConfig);
        //AlloyEditor.editable(this.props.container, this.props.alloyEditorConfig);
        //{this.props.selector.sid}
        //AlloyEditor.editable(this.props.container);
        //alert(this.props.container);
        //AlloyEditor.editable(this.props.container);
        //AlloyEditor.editable(this.props.container);
        //if (!CKEDITOR.instances[this.props.container])
        //{
        //AlloyEditor.editable(this.props.container, {
        //    extraPlugins: AlloyEditor.Core.ATTRS.extraPlugins.value + ',ae_autolink'
        //});
        /*
        this.props.alloyEditorConfig = {
            extraPlugins: AlloyEditor.Core.ATTRS.extraPlugins.value + ',ae_autolink',
            toolbars: {
                styles: {
                    selections: [
                        {
                            name: 'image',
                            buttons: ['imageCenter'],
                            test: AlloyEditor.SelectionTest.image
                        }
                    ]
                }
            }
        };
        */
        let Selections = [{
            name: 'link',
            buttons: ['linkEdit'],
            test: AlloyEditor.SelectionTest.link
        }, {
            name: 'image',
            buttons: ['imageLeft', 'imageCenter','imageRight'],
            test: AlloyEditor.SelectionTest.image
        }, {
            name: 'text',
            buttons: [
                {
                    name: 'styles',
                    cfg: {
                        styles: ['h1']
                    }
                }, 'bold', 'italic', 'underline', 'link', 'twitter'],
            test: AlloyEditor.SelectionTest.text
        }, {
            name: 'table',
            buttons: ['tableRow', 'tableColumn', 'tableCell', 'tableRemove'],
            getArrowBoxClasses: AlloyEditor.SelectionGetArrowBoxClasses.table,
            setPosition: AlloyEditor.SelectionSetPosition.table,
            test: AlloyEditor.SelectionTest.table
        }, {
            name: 'image',
            buttons: ['imageLeft', 'imageCenter', 'imageright'],
            test: AlloyEditor.SelectionTest.image
        }];
        let toolbars = {
            add: {
                buttons: ['image', 'camera', 'hline', 'table'],
                tabIndex: 2
            },
            styles: {
                selections: this.Selections,
                tabIndex: 1
            }
        };
        let alloyEditorConfig = {
            extraPlugins: AlloyEditor.Core.ATTRS.extraPlugins.value + ',ae_autolink',
            toolbars: this.toolbars
        };
        //AlloyEditor.editable(this.props.container, this.props.alloyEditorConfig);
        //this.props.alloyEditorConfig = {
        //    extraPlugins: AlloyEditor.Core.ATTRS.extraPlugins.value + ',ae_autolink',
        //    toolbars: this.toolbars
        //};
        //AlloyEditor.editable(this.props.container, alloyEditorConfig);
        if (this.props.content !== '')
        {
            AlloyEditor.editable(this.props.container);
        }
        //alert('test' + CKEDITOR.instances[this.props.container]);
        //}
        //alert('test_inti');
        //alert('test0');
        //setTimeout( () => {
            //this.forceUpdate();
        //    alert('test');
        //}, 2000);
    }
    //foreceUpdate()
    //{
    //}
    //shouldComponentUpdate() {
        //return false;
    //}
    componentDidUpdate() {
        //alert('test' + ReactDOM.findDOMNode(this.refs.alloycomponent).getAttribute('content'));
        //alert('test' + $(this.refs.alloycomponent).attr('class'));
        //alert(this.refs.alloycomponent);
        //alert(this.props.container);
        //alert((ReactDOM.findDOMNode(this.refs.alloycomponent).getAttribute('class') !== 'cke_editable cke_editable_inline cke_contents_ltr ae-editable'));
        //assign Alloy-editor
        //if (ReactDOM.findDOMNode(this.refs.alloycomponent).getAttribute('class') !== 'cke_editable cke_editable_inline cke_contents_ltr ae-editable')

        //let editor = CKEDITOR.instances[this.props.container];
        //if (editor) {
            //alert('instance exists');
        //    editor.destroy(true);
            //alert('destroyed');
        //}
        //alert('test' + CKEDITOR.instances[this.props.container]);
        //if (typeof(CKEDITOR.instances[this.props.container]) === 'undefined')
        //{
        //    AlloyEditor.editable(this.props.container);
        ///    alert('undefined');
        //}        //CKEDITOR.replace(this.props.container);
        //}
        //alert('test');
        //alert('test' + ReactDOM.findDOMNode(this.refs.alloycomponent).attr('dangerouslySetInnerHTML'));
        //alert('test1');
        if (this.props.content !== '' && typeof(CKEDITOR.instances[this.props.container]) === 'undefined')
        {
            AlloyEditor.editable(this.props.container);
        }
    }
    componentWillUnmount() {
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
