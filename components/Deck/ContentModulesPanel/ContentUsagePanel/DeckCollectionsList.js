import React from 'react';
import ContentUsageItem from './ContentUsageItem';

class DeckCollectionsList extends React.Component {

    render() {
        const list = this.props.collections.map((collection, index) =>
            <div className="item">
                <div className="content">
                    <div className="header">
                        {collection.name || 'title'}
                    </div>
                    <div className="description">
                        <span>{'by '}</span>
                        {collection.user || 'user'}
                    </div>
                </div>
            </div>
        );

        return (
        <div className="ui relaxed divided list">
            {list}
        </div>
        );
    }
}

export default DeckCollectionsList;
