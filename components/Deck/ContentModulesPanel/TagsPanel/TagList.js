import React from 'react';

class TagList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const selector = this.props.selector;
        const editable = this.props.editable;

        return (
            <div ref="tagList">
                <div className="ui basic segment">
                    { this.props.items.map((tag) => (<a className="ui large tag label" tabIndex="0" role="link">{tag}</a>)) }
                </div>
             </div>
        );
    }
}

export default TagList;
