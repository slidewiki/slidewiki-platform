import React from 'react';
import DeckCard from '../../User/UserProfile/DeckCard';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import { isEmpty } from '../../../common';

class CollectionDecks extends React.Component {

    render() {
        let size = 0;
        let content = this.props.decks;
        if(!isEmpty(content)){
            switch(this.props.sort){
                case 'date':
                    content = content.sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
                    break;
                case 'title':
                    content = content.sort((a,b) => (b.title.toUpperCase() < a.title.toUpperCase()) ? 1 : -1 );
                    break;
                case 'lastUpdated':
                    content = content.sort((a,b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
                    break;

                // use the natural order of the array
                case 'order':
                default:
                    break;
            }
            if (this.props.size === 0)
                size = content.length;
            else
                size = content.length < 3 ? content.length : this.props.size;
            return (<div className="ui three doubling cards">
                {[...Array(size).keys()].map( (i) => <DeckCard userid={this.props.UserProfileStore.user.id} key={i} cardContent={content[i]} newTab={this.props.newTab}/>)}
                    </div>);
        } else {
            return <center><h3>No decks available</h3></center>;
        }
    }
}

CollectionDecks.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
CollectionDecks = connectToStores(CollectionDecks, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default CollectionDecks;
