import React from 'react';
import { isEmpty } from '../../../common';
import DeckCard from './DeckCard';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import { fetchUserDecks } from '../../../actions/user/userprofile/fetchUserDecks';

class PublicUserDecks extends React.Component {
    componentDidMount() {
        context.executeAction(fetchUserDecks, {params: {username: this.props.UserProfileStore.user.uname}});
    }

    componentDidUpdate() {}

    render() {
        let content = this.props.UserProfileStore.userDecks;
        let size = 0;
        if (content !== undefined && content.length !== 0 && this.props.size === 0)
            size = content.length;
        else if (content !== undefined && content.length !== 0 && this.props.size !== 0)
            size = this.props.size;
        let divs = '';
        if(size > 0) {
            divs = (<div className="ui three doubling cards">
                {[...Array(size).keys()].map( (i) => <DeckCard key={i} cardContent={content[i]}/>)}
            </div>);
        } else{
            divs = <h3>No decks available</h3>;
        }
        return (
            <div>
                {divs}
            </div>
        );
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
