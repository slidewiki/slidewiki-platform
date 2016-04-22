import React from 'react';
import ContentQuestionsItem from './ContentQuestionsItem';

class ContentQuestionsList extends React.Component {
    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <ContentQuestionsItem question={node} key={index}/>
            );
        });

        return (
            <div ref="contentquestionsList">
                <div className="ui relaxed list">
                    {list}
                </div>
             </div>
        );
    }
}

export default ContentQuestionsList;
