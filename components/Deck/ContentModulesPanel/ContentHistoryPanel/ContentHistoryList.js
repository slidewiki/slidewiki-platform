import React from 'react';
import ContentHistoryItem from './ContentHistoryItem';

class ContentHistoryList extends React.Component {
    render() {
        const selector = this.props.selector;
        let selectedNodeRevision = parseInt(this.props.selector.sid.split('-')[1]);

        const list = this.props.revisions.map((node, index) => {
            return (
                <ContentHistoryItem key={index} revision={node} isSelected={isNaN(selectedNodeRevision) ? node.active : selectedNodeRevision === node.id} selector={selector} allowRevert={this.props.allowRevert}/>
            );
        });

        return (
            <div ref="contentHistoryList">
                <div className="ui relaxed divided selection list revisions">
                    {list}
                </div>
            </div>
        );
    }
}

export default ContentHistoryList;