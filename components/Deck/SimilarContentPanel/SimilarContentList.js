import React from 'react';
import SimilarContentItem from './SimilarContentItem';

class SimilarContentList extends React.Component {
    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <SimilarContentItem key={index} data={node} />
            );
        });
        return (
            <div ref="similarContentList">
                <div className="ui relaxed divided list">
                    {list}
                </div>
             </div>
        );
    }
}

export default SimilarContentList;
