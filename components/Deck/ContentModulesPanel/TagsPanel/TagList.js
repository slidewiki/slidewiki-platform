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
                <div className="ui basic segment">
                    { this.props.items.map((tag) => (<a key={tag.tagName + '-' + (parseInt(Math.random()*1000000))} className="ui large tag label" tabIndex="0" role="link">
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
