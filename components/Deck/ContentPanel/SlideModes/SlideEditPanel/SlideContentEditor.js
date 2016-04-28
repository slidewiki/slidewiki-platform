import React from 'react';

class SlideContentEditor extends React.Component {
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
        // check editor exists before use
        //todo: update editor content
    }
    componentDidUpdate() {

    }
    handleEditorChange(e) {
        console.log(e.target.getContent());
    }
    render() {
        const compStyle = {
            minWidth: '100%',
            maxHeight: 500,
            minHeight: 500,
            overflowY: 'auto'
        };
        return (
            <textarea style={compStyle} ref={this.props.selector.sid} value={this.props.content} onChange={this.handleEditorChange} />
        );
    }
}

export default SlideContentEditor;
