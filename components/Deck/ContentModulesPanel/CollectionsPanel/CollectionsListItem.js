import PropTypes from 'prop-types';
import React from 'react';
import { timeSince } from '../../../../common';
import { defineMessages } from 'react-intl';
import removeDeckFromCollection from '../../../../actions/collections/removeDeckFromCollection';

class CollectionsListItem extends React.Component {
    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
    }
    getIntlMessages() {
        return defineMessages({
            removeTooltip: {
                id: 'CollectionsListItem.removeTooltip',
                defaultMessage: 'Remove'
            },
            removeAria: {
                id: 'CollectionsListItem.removeAria', 
                defaultMessage: 'Remove current deck from collection'
            },
        });
    }
    removeCollection(collectionId, deckId, event) {
        event.preventDefault();
        this.context.executeAction(removeDeckFromCollection, {
            collectionId,
            deckId,
        });
    }
    render() {
        const item = this.props.item;
        const selector = this.props.selector;
        const description = `${item.description} ${(item.description) ? '\u00b7' : ''} Created ${timeSince((new Date(item.timestamp)))} ago`;

        return (
            <div className="item">
                <div className="ui grid">
                    <div className="twelve wide column">
                        <div className="content">
                            <div className="header">
                               <a className="header" href={`/playlist/${item._id}?sort=order`} target='_blank'>{item.title}</a>
                            </div>
                            <div className="description">
                                { description }
                            </div>
                        </div>
                    </div>
                    <div className="four wide column">
                        { (this.props.userId === item.user || this.props.userGroups.includes(item.userGroup)) &&
                            <button className="ui tiny compact borderless basic right floated icon button" data-tooltip={this.context.intl.formatMessage(this.messages.removeTooltip)} aria-label={this.context.intl.formatMessage(this.messages.removeAria)} onClick={this.removeCollection.bind(this, item._id, selector.sid)} >
                                <i aria-hidden="true" className="close icon"></i>
                            </button>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

CollectionsListItem.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired
};

export default CollectionsListItem;
