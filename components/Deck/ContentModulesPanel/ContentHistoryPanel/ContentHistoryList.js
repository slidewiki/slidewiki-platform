import React from 'react';
import ContentHistoryItem from './ContentHistoryItem';

class ContentHistoryList extends React.Component {
    render() {
        const selector = this.props.selector;
        const list = this.props.revisions.map((node, index) => {
            return (
                <ContentHistoryItem key={index} revision={node} selector={selector}/>
            );
        });

        return (
            <div ref="contentHistoryList">
                <div className="ui relaxed divided list">
                    {list}
                </div>
            </div>
        );
    }
}

export default ContentHistoryList;