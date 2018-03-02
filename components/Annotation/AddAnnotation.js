import React from 'react';
import AddSemanticAnnotation from './AddSemanticAnnotation';
import AddCommentAnnotation from './AddCommentAnnotation';
import AddHighlightAnnotation from './AddHighlightAnnotation';

/**
 * Created by akorovin on 01.03.2017.
 */
export default class AddAnnotation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'comment'
        };
    }
    handleChange(e){
        e.preventDefault();
        this.setState({type:e.target.value});
    }
    getAnnotationComponent(type) {
        switch (type) {
            case 'semantic':
                return <AddSemanticAnnotation/>;
            case 'comment':
                return <AddCommentAnnotation/>;
            case 'highlight':
                return <AddHighlightAnnotation/>;
        }
    }

    render () {
        let annotationTypeComp = this.getAnnotationComponent(this.state.type);

        return (
            <div>
                <h2 ref="subtitle">Add annotation</h2>
                <button onClick={this.props.closeModal}>close</button>
                <select
                    name="type"
                    className="ui fluid dropdown"
                    onChange={this.handleChange.bind(this)}
                >
                    <option value="semantic">Semantic</option>
                    <option value="comment" selected="selected">Comment</option>
                    <option value="highlight">Highlight</option>
                </select>
                { annotationTypeComp }
            </div>
        );
    }
}
