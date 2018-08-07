import React from 'react';
import CollectionsListItem from './CollectionsListItem';

class CollectionsList extends React.Component {
    render() {

        const selector = this.props.selector;
        const collections = this.props.collections;
        const collectionsList = collections.map( (node, index) => <CollectionsListItem key={index} item={node} selector={this.props.selector} userId={this.props.userId} userGroups={this.props.userGroups} />);

        return (
            <div ref="collectionsList">
                {
                    (collections.length === 0) &&
                    <div>
                        This deck is currently not part of any playlist.
                    </div>
                    
                }
                { 
                    (collections.length > 0) &&
                    <div className="ui relaxed divided list">
                        { collectionsList }
                    </div>
                }

            </div>
        );
    }
}

export default CollectionsList;
