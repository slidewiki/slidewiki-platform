import PropTypes from 'prop-types';
import React from 'react';
import ContentUsageItem from './ContentUsageItem';
import { defineMessages } from 'react-intl';

class ContentUsageList extends React.Component {
    render() {
        const form_messages = defineMessages({
            no_usage: {
                id: 'ContentUsageList.form.no_usage',
                defaultMessage: 'There is currently no usage of this',
            }
        });
        const noUsageMessage = <div>{this.context.intl.formatMessage(form_messages.no_usage) + ' ' + this.props.selector.stype}.</div>;

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

ContentUsageList.contextTypes = {
    intl: PropTypes.object.isRequired
};

export default ContentUsageList;
