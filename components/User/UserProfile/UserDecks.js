import React from 'react';
import DeckListItem from './DeckListItem';
import ActivityFeedPanel from '../../Deck/ActivityFeedPanel/ActivityFeedPanel';

class UserDecks extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        let content = {
            picture: 'https://cdn1.iconfinder.com/data/icons/iconnice-vector-icon/31/Vector-icons_23-256.png',
            title: 'Deck 53',
            description: 'Example Deck about example Decks',
            updated: '53 mins',
            deckID: 53,
        };
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
                                <DeckListItem content={content}/>
                                <DeckListItem content={content}/>
                                <DeckListItem content={content}/>
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
                                <DeckListItem content={content}/>
                                <DeckListItem content={content}/>
                                <DeckListItem content={content}/>
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
