import React from 'react';
import { List, Segment, Checkbox, Header } from 'semantic-ui-react';

import PublicUserData from '../PublicUserData';
import UserDecks from './UserDecks';
import UserCollections from '../../../DeckCollection/UserCollections';
import UserMenu from './UserMenu';

import { fetchUserDecks } from '../../../../actions/user/userprofile/fetchUserDecks';

class PrivatePublicUserProfile extends React.Component {
    constructor(props){
        super(props);
    }

    showUserDecks(){
        return <UserDecks decks={this.props.decks} decksMeta={this.props.decksMeta} deckListType={this.props.categoryItem} loadMoreLoading={this.props.loadMoreLoading} loadMoreError={this.props.loadMoreError} user={this.props.user} loggedinuser={this.props.loggedinuser} />;
    }

    showUserCollections(){
        return <UserCollections user={this.props.user} loggedinuser={this.props.loggedinuser} loggedinUserId={this.props.loggedinUserId} />;
    }

    chooseView(){
        switch(this.props.category){
            case 'playlists':
                return this.showUserCollections();
            case 'deck':
            default: 
                return this.showUserDecks();        
        }
    }

    handleFilterChange(event, { value }) {
        this.context.executeAction(fetchUserDecks, {
            deckListType: this.props.categoryItem,
            params: {
                username: this.props.user.uname, 
                sort: this.props.decksMeta.sort,
                status: value,
            }
        });
    }

    render() {
        let meta = this.props.decksMeta;
        return (
          <div className = "ui vertically padded stackable grid container" >
              <div className = "four wide column" >
                  <PublicUserData user={ this.props.user } loggedinuser={ this.props.loggedinuser } />
                  <UserMenu user={ this.props.user } loggedinuser={this.props.loggedinuser} choice={ this.props.category } />
                  { this.props.user.uname === this.props.loggedinuser && this.props.category !== 'playlists' &&
                    <Segment>
                        <Header size='small' dividing >Publication status</Header>
                        <List>
                            <List.Item>
                                <Checkbox slider type='radio' name='published_status' value='public' label='Published'
                                    checked={meta.status === 'public'} onChange={this.handleFilterChange.bind(this)} />
                            </List.Item>
                            <List.Item>
                                <Checkbox slider type='radio' name='published_status' value='hidden' label='Not published'
                                    checked={meta.status === 'hidden'} onChange={this.handleFilterChange.bind(this)} />
                            </List.Item>
                            <List.Item>
                                <Checkbox slider type='radio' name='published_status' value='any' label='All'
                                    checked={meta.status === 'any'} onChange={this.handleFilterChange.bind(this)} />
                            </List.Item>
                        </List>
                    </Segment>
                  }
              </div>
              <div className = "twelve wide column" >
                  {this.chooseView()}
              </div>
              <div className="ui tab" data-tab="activity"></div>
          </div>
        );
    }
}

PrivatePublicUserProfile.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default PrivatePublicUserProfile;
