import PropTypes from 'prop-types';
import React from 'react';
import DeckCard from '../../User/UserProfile/DeckCard';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import { isEmpty } from '../../../common';
import {FormattedMessage, defineMessages} from 'react-intl';

class CollectionDecksReorder extends React.Component {
    constructor(props){
        super(props);
        this.messages = this.getIntlMessages();
    }
    handleMoveUp(index){
        this.props.moveUp(index);
    }
    handleMoveDown(index){
        this.props.moveDown(index);
    }
    handlRemove(index){
        this.props.remove(index);
    }
    getIntlMessages(){
        return defineMessages({
            moveUp: {
                id: 'CollectionDecksReorder.moveup',
                defaultMessage: 'Move Up'
            }, 
            moveDown: {
                id: 'CollectionDecksReorder.movedown',
                defaultMessage: 'Move Down'
            }, 
            remove: {
                id: 'CollectionDecksReorder.remove',
                defaultMessage: 'Remove'
            }
        });
    }
    render() {
        let size = 0;
        let content = '';

        if(isEmpty(this.props.decks)){
            return <center><h3>No decks available</h3></center>;
        }

        content = this.props.decks.map( (deck, index) => {
            return (
                <div key={deck.deckID} className="ui vertical segment">
                    <div className="ui two column stackable grid container">
                        <div className="column">
                            <div className="ui header"><h3><a href={`/deck/${deck.deckID}`}>{deck.title}</a></h3></div>
                            <div className="meta">{deck.description}</div>
                        </div>

                        <div className="right aligned column">
                              <div>

                                { (index > 0) && 
                                    <button className="ui large basic icon button" data-tooltip={this.context.intl.formatMessage(this.messages.moveUp)} aria-label={this.context.intl.formatMessage(this.messages.moveUp)} onClick={this.handleMoveUp.bind(this, index)} >
                                      <i className="arrow up icon" name={'orderUp' + deck.deckID} ></i>
                                    </button>
                                }
                                { (index !== this.props.decks.length-1) &&
                                    <button className="ui large basic icon button" data-tooltip={this.context.intl.formatMessage(this.messages.moveDown)} aria-label={this.context.intl.formatMessage(this.messages.moveDown)} onClick={this.handleMoveDown.bind(this, index)} >
                                      <i className="arrow down icon" name={'orderDown' + deck.deckID} ></i>
                                    </button>
                                }
                                <button className="ui large basic icon button" data-tooltip={this.context.intl.formatMessage(this.messages.remove)} aria-label={this.context.intl.formatMessage(this.messages.remove)} onClick={this.handlRemove.bind(this, index)} >
                                    <i className="remove icon" name={'remove' + deck.deckID} ></i>
                                </button>
                              </div>
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div className="ui vertical segment">
                {content}
            </div>
        );
    }
}

CollectionDecksReorder.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired
};

CollectionDecksReorder = connectToStores(CollectionDecksReorder, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default CollectionDecksReorder;
