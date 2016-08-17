import React from 'react';
import DeckListItem from './DeckListItem';

class PublicUserDecks extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return (
            <div className="ui segments">
                <div className="ui secondary segment">
                    <strong>{ this.props.title }</strong>
                </div>
                <div className="ui segment">
                    <div className="ui relaxed divided list">
                        <DeckListItem private={ false } deckID={ 1 } title='Semantic-Org/Semantic-UI' picture='http://semantic-ui.com/images/wireframe/image.png' updated='10'/>
                        <DeckListItem private={ false } deckID={ 1 } title='Semantic-Org/Semantic-UI-Docs' picture='http://semantic-ui.com/images/wireframe/image.png' updated='22'/>
                        <DeckListItem private={ false } deckID={ 1 } title='Semantic-Org/Semantic-UI-Meteor' picture='http://semantic-ui.com/images/wireframe/image.png' updated='34'/>
                        <DeckListItem private={ false } deckID={ 1 } title='Semantic-Org/Semantic-UI-Meteor' picture='http://semantic-ui.com/images/wireframe/image.png' updated='34'/>
                    </div>
                </div>
            </div>
        );
    }
}

PublicUserDecks.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default PublicUserDecks;
