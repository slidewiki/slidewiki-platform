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
        return (
            <div ref="slideContentEditor">
                <textarea rows="20" cols="70" ref={this.props.selector.sid} value={this.props.content} onChange={this.handleEditorChange} />
            </div>
        );
    }
}

export default SlideContentEditor;
