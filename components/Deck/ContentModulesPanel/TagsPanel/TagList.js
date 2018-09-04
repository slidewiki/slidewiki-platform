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
        let tags = this.props.items.map((t) => Object.assign(t, { tagColor: t.tagType === 'topic' ? 'green' : ''}));

        return (
            <div ref="tagList">
                { tags.map((tag, index) => (<a key={index} target="_blank" href={'/deckfamily/' + tag.tagName} key={tag.tagName} className={`ui large tag label ${tag.tagColor}`} tabIndex="0" aria-label={tag.defaultName || tag.tagName}>
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
