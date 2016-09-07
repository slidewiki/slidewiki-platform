import React from 'react';
import DeckListItem from './DeckListItem';
import ActivityFeedPanel from '../../Deck/ActivityFeedPanel/ActivityFeedPanel';

class UserDecks extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return (
            <div className="ui stackable horitontally divided two column grid">
                <div className="column">
                    <h1 className="ui red">This view is currenty not working!</h1>
                    <div className="ui segments">
                        <div className="ui secondary segment">
                            <strong>My Decks</strong>
                        </div>
                        <div className="ui segment">
                            <div className="ui relaxed divided list">
                                <DeckListItem private={true} deckID={56} title='Semantic-Org/Semantic-UI' picture='http://semantic-ui.com/images/wireframe/image.png' updated='10'/>
                                <DeckListItem private={true} deckID={56} title='Semantic-Org/Semantic-UI-Docs' picture='http://semantic-ui.com/images/wireframe/image.png' updated='22'/>
                                <DeckListItem private={true} deckID={91} title='Semantic-Org/Semantic-UI-Meteor' picture='http://semantic-ui.com/images/wireframe/image.png' updated='34'/>
                            </div>
                        </div>
                    </div>
                    <div className="ui hidden divider" />
                    <div className="ui segments">
                        <div className="ui secondary segment">
                            <strong>Recently edited slides</strong>
                        </div>
                        <div className="ui segment">
                            <div className="ui relaxed divided list">
                                <DeckListItem private={true} deckID={56} title='Semantic-Org/Semantic-UI/Slide 4' picture='http://semantic-ui.com/images/wireframe/image.png' updated='10'/>
                                <DeckListItem private={true} deckID={91} title='Semantic-Org/Semantic-UI-Docs/Slide 20' picture='http://semantic-ui.com/images/wireframe/image.png' updated='22'/>
                                <DeckListItem private={true} deckID={91} title='Semantic-Org/Semantic-UI-Meteor/Slide 1' picture='http://semantic-ui.com/images/wireframe/image.png' updated='34'/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="column">
                    <div className="ui raised segment">

                    </div>
                    <div className="ui hidden divider" />
                    <ActivityFeedPanel mode="user"/>
                </div>
            </div>
        );
    }
}

UserDecks.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserDecks;
