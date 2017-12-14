import React from 'react';
import DeckCard from '../../User/UserProfile/DeckCard';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import { isEmpty } from '../../../common';

class ColletionDecksReorder extends React.Component {
    handleMoveUp(index){
        this.props.moveUp(index);
    }
    handleMoveDown(index){
        this.props.moveDown(index);
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
                                    <button className="ui large basic icon button" data-tooltip="Move Up" aria-label="Move Up" onClick={this.handleMoveUp.bind(this, index)} >
                                      <i className="arrow up icon" name={'orderUp' + deck.deckID} ></i>
                                    </button>
                                }
                                { (index !== this.props.decks.length-1) &&
                                    <button className="ui large basic icon button" data-tooltip="Move Down" aria-label="Move Down" onClick={this.handleMoveDown.bind(this, index)} >
                                      <i className="arrow down icon" name={'orderDown' + deck.deckID} ></i>
                                    </button>
                                } 
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

ColletionDecksReorder.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ColletionDecksReorder = connectToStores(ColletionDecksReorder, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default ColletionDecksReorder;
