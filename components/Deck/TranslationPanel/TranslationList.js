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
            <div ref="translationList" className="menu">
                {list}
             </div>
        );
    }
}

export default TranslationList;
