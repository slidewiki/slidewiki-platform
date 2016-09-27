import React from 'react';
import ContentUsageItem from './ContentUsageItem';

class ContentUsageList extends React.Component {
    render() {
        const selector = this.props.selector;
        const list = this.props.usage.map((node, index) => {
            return (
            <ContentUsageItem key={index} usageItem={node} selector={selector}/>
            );
        });
        return (
        <div ref="contentUsageList">
            <div className="ui relaxed divided list">
                {list}
            </div>
        </div>
        );
    }
}

export default ContentUsageList;