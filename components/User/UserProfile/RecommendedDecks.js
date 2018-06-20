import React from 'react';
import DeckCard from './DeckCard';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import { isEmpty } from './../../../common';

class RecommendedDecks extends React.Component {

    render() {
        let content = this.props.decks;
        if(!isEmpty(content)){
            let size = content.length;
            switch(this.props.sort){
                case '1':
                    content = content.sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
                    break;
                case '0':
                    content = content.sort((a,b) => (b.title.toUpperCase() < a.title.toUpperCase()) ? 1 : -1 );
                    break;
                case '2':
                    content = content.sort((a,b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
                    break;
                case '3':
                default:
                    content = content.sort((a,b) => b.recommendationWeight - a.recommendationWeight);
                    break;
            }

            return (<div className="ui three doubling cards">
                {[...Array(size).keys()].map( (i) => <DeckCard userid={this.props.UserProfileStore.user.id} key={i} cardContent={content[i]} newTab={this.props.newTab}/>)}
                    </div>);
        } else {
            return <h3>No recommendations available</h3>;
        }
    }
}

RecommendedDecks.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
RecommendedDecks = connectToStores(RecommendedDecks, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default RecommendedDecks;
