import React from 'react';

class TagList extends React.Component {
    render() {
        const selector = this.props.selector;
        const editable = this.props.editable;

        return (
            <div ref="tagList">
                <div className="ui relaxed divided list">
                  <ul>
                    { this.props.items.map((tag) => (<li>{tag}</li>)) }
                  </ul>
                </div>
             </div>
        );
    }
}

export default TagList;
