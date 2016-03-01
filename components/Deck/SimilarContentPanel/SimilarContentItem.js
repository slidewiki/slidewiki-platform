import React from 'react';

class SimilarContentItem extends React.Component {
    render() {
        return (
            <div className="item">
                  <a href={'/slideview/' + this.props.data.id}>{this.props.data.title}</a>
            </div>
        );
    }
}

export default SimilarContentItem;
