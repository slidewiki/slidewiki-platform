import React from 'react';

class TagList extends React.Component {
    constructor(props) {
        super(props);
    }

    onTagDelete(tag) {
        this.props.onTagDelete(tag);
    }

    //TODO shrink tag name if too long for screen
    render() {
        return (
            <div ref="tagList">
                { this.props.items.map((tag) => (<a target="_blank" href={'/deckfamily/' + tag.tagName} key={tag.tagName} className="ui large tag label" tabIndex="0" aria-label={tag.defaultName || tag.tagName}>
                    { tag.defaultName || tag.tagName }
                    {
                        this.props.isEditMode?
                            <i onClick={this.onTagDelete.bind(this, tag)} className="delete icon" />
                            : ''
                    }
                </a>)) }
             </div>
        );
    }
}

export default TagList;
