import PropTypes from 'prop-types';
import React from 'react';
import CollectionsListItem from './CollectionsListItem';
import { defineMessages } from 'react-intl';

class CollectionsList extends React.Component {
    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
    }
    getIntlMessages() {
        return defineMessages({
            partOfPlaylists: {
                id: 'CollectionsList.partOfPlaylists',
                defaultMessage: 'This deck is part of the following playlists'
            },
        });
    }
    render() {

        const selector = this.props.selector;
        const collections = this.props.collections;
        const collectionsList = collections.map( (node, index) => <CollectionsListItem key={index} item={node} selector={this.props.selector} userId={this.props.userId} userGroups={this.props.userGroups} />);

        return (
            <div ref="collectionsList">
                {
                    (collections.length === 0) ? (
                        <div>This deck is currently not part of any playlist.</div>
                    ) : (
                        <h4 className="ui header">{this.context.intl.formatMessage(this.messages.partOfPlaylists)}:</h4>
                    )
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

CollectionsList.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default CollectionsList;
