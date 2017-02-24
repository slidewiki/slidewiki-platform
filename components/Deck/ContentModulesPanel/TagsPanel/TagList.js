import React from 'react';

class TagList extends React.Component {
    constructor(props) {
        super(props);
    }

    onTagDelete(tag) {
        console.log(tag);
        this.props.onTagDelete(tag);
    }

    render() {
        return (
            <div ref="tagList">
                <div className="ui basic segment">
                    { this.props.items.map((tag) => (<a className="ui large tag label" tabIndex="0" role="link">
                        { tag }
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
