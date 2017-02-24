import React from 'react';

class TagList extends React.Component {
    constructor(props) {
        super(props);
    }

    onTagDelete(e) {
        e.preventDefault();
    }

    render() {
        const selector = this.props.selector;
        const editable = this.props.editable;
        const deleteIcon = this.props.isEditMode?
            <i onClick={this.onTagDelete.bind(this)} className="delete icon" />
            : '';

        return (
            <div ref="tagList">
                <div className="ui basic segment">
                    { this.props.items.map((tag) => (<a className="ui large tag label" tabIndex="0" role="link">
                        { tag }{ deleteIcon }
                    </a>)) }
                </div>
             </div>
        );
    }
}

export default TagList;
