import React from 'react';
import DeckCard from './DeckCard';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import { isEmpty } from './../../../common';

class PublicUserDecks extends React.Component {

    render() {
        let size = 0;
        let content = this.props.decks;
        if(!isEmpty(content)){
            switch(this.props.sort){
                case '1':
                    content = content.sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
                    break;
                case '2':
                    content = content.sort((a,b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
                    break;
                case '0':
                default:
                    content = content.sort((a,b) => (b.title.toUpperCase() < a.title.toUpperCase()) ? 1 : -1 );
            }
            if (this.props.size === 0)
                size = content.length;
            else
                size = content.length < 3 ? content.length : this.props.size;
            return (<div className="ui three doubling cards">
                {[...Array(size).keys()].map( (i) => <DeckCard userid={this.props.UserProfileStore.user.id} key={i} cardContent={content[i]}/>)}
                    </div>);
        } else {
            return <h3>No decks available</h3>;
        }
    }
}

PublicUserDecks.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
PublicUserDecks = connectToStores(PublicUserDecks, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default PublicUserDecks;
