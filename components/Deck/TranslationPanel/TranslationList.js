import React from 'react';
import TranslationItem from './TranslationItem';

class TranslationList extends React.Component {
    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <TranslationItem key={index} data={node} />
            );
        });
        return (
        		
            <div ref="translationList">
                <div className="ui relaxed divided list">
                    {list}
                </div>
             </div>
        );
    }
}

export default TranslationList;
