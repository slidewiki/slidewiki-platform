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
                { this.props.items.map((tag) => (<a target="_blank" href={'/deckfamily/' + tag.tagName} key={tag.tagName + '-' + (parseInt(Math.random()*1000000))} className="ui large tag label" tabIndex="0">
                    { tag.defaultName }
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
