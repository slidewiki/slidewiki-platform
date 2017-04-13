import React from 'react';

class TagList extends React.Component {
    constructor(props) {
        super(props);
    }

    onTagDelete(tag) {
        this.props.onTagDelete(tag);
    }

    render() {
        return (
            <div ref="tagList">
                <div className="ui basic segment">
                    { this.props.items.map((tag) => (<a key={tag.tagName} className="ui large tag label" tabIndex="0" role="link">
                        { tag.tagName }
                        {
                            this.props.isEditMode?
                                <i onClick={this.onTagDelete.bind(this, tag)} className="delete icon" />
                                : ''
                        }
                    </a>)) }
                </div>
             </div>
        );
    }
}

export default TagList;
