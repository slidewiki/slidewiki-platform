import React from 'react';
import ContentUsageItem from './ContentUsageItem';

class ContentUsageList extends React.Component {
    render() {
        const noUsageMessage = <div>There is currently no usage of
            this {this.props.selector.stype}.</div>;

        const selector = this.props.selector;
        const list = this.props.usage.map((node, index) => <ContentUsageItem key={index} usageItem={node} selector={selector}/>);

        return (
            <div ref="contentUsageList">
                {
                    list.length ? 
                    <div className="ui relaxed divided list">
                        {list}
                    </div>
                    : noUsageMessage
                }
            </div>
        );
    }
}

export default ContentUsageList;
