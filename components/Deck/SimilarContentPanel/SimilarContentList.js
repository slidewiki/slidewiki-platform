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
            <div >
                <div className="ui cards">
                    {list}
                </div>
             </div>
        );
    }
}

export default SimilarContentList;
