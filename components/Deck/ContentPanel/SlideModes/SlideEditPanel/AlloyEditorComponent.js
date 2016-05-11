import React from 'react';
import ReactDOM from 'react-dom';
//import AlloyEditor from 'alloyeditor';

class AlloyEditorComponent extends React.Component {
    componentDidMount() {
        //AlloyEditor.editable($(this.props.container).attr('id'), this.props.alloyEditorConfig);
        //AlloyEditor.editable(this.props.container, this.props.alloyEditorConfig);
        //{this.props.selector.sid}
        AlloyEditor.editable(this.props.container);
        //alert(this.props.container);
    }
    componentWillUnmount() {
        AlloyEditor.destroy();
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
