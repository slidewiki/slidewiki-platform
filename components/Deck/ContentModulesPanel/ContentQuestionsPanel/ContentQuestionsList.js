import React from 'react';
import ContentQuestionsItem from './ContentQuestionsItem';

class ContentQuestionsList extends React.Component {
    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <ContentQuestionsItem question={node} key={index} index={index}/>
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
