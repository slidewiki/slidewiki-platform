import React from 'react';
import ContentQuestionAnswersItem from './ContentQuestionAnswersItem';

class ContentQuestionAnswersList extends React.Component {
    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <ContentQuestionAnswersItem answer={node} key={index}/>
            );
        });

        return (
            <div ref="contentquestionanswersList">
                <div className="ui relaxed list">
                    {list}
                </div>
             </div>
        );
    }
}

export default ContentQuestionAnswersList;
