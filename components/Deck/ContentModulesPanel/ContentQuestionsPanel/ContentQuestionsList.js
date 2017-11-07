import React from 'react';
import ContentQuestionsItem from './ContentQuestionsItem';

class ContentQuestionsList extends React.Component {

    componentDidMount() {
        this.enableAccordion();
    }

    componentDidUpdate() {
        this.refreshAccordion();
    }

    enableAccordion(status) {
        let accordionDIV = this.refs.contentquestionsList;
        $(accordionDIV).find('.ui.accordion').accordion({
            exclusive: false
        });
    }

    refreshAccordion(status) {
        let accordionDIV = this.refs.contentquestionsList;
        $(accordionDIV).find('.ui.accordion').accordion('refresh');
    }

    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <ContentQuestionsItem question={node} key={index} index={index} selector={this.props.selector} />
            );
        });

        return (
            <div ref="contentquestionsList">
                <div className="ui styled fluid accordion">
                    {list}
                </div>
             </div>
        );
    }
}

export default ContentQuestionsList;
