import React from 'react';
import { List, Segment, Checkbox, Header } from 'semantic-ui-react';

import PublicUserData from '../PublicUserData';
import UserDecks from './UserDecks';
import UserCollections from '../../../DeckCollection/UserCollections';
import UserMenu from './UserMenu';
import UserRecommendations from '../UserRecommendations';
import classNames from 'classnames/bind';
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

    showUserRecommendactions(){
        return <UserRecommendations loggedinuser={this.props.loggedinuser} loggedinUserId={this.props.loggedinUserId} />;
    }

    showUserStats(){
        return (<div></div>);
    }

    chooseView(){
        switch(this.props.category){
            case 'playlists':
                return this.showUserCollections();
            case 'recommendations':
                return this.showUserRecommendactions();
            case 'stats':
                return this.showUserStats();
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
        let profileClasses = classNames({
            'tablet': this.props.loggedinuser && this.props.user.uname === this.props.loggedinuser,
            'computer': this.props.loggedinuser && this.props.user.uname === this.props.loggedinuser,
            'only': this.props.loggedinuser && this.props.user.uname === this.props.loggedinuser,
            'sixteen': true,
            'wide': true,
            'column': true
        });
        return (
          <div className = "ui vertically padded stackable grid container" >
              <div className = "four wide column" >
                <div className = "ui stackable grid ">
                  <div className = {profileClasses}>
                      <PublicUserData user={ this.props.user } loggedinuser={ this.props.loggedinuser } />
                  </div>
                  <div className = "sixteen wide column">
                      <UserMenu user={ this.props.user } loggedinuser={this.props.loggedinuser} choice={ this.props.category } />
                  { this.props.user.uname === this.props.loggedinuser && this.props.category !== 'playlists' && this.props.category !== 'recommendations' && this.props.category !== 'stats' &&
                    <Segment>
                        <Header size='small' dividing >Publication status</Header>
                        <List>
                            <List.Item>
                                <Checkbox radio name='published_status' value='public' disabled={!meta.status}
                                    aria-labelledby='published_public_label' label={<label id='published_public_label'>Published</label>}
                                    checked={meta.status === 'public'} onChange={this.handleFilterChange.bind(this)} />
                            </List.Item>
                            <List.Item>
                                <Checkbox radio name='published_status' value='hidden' disabled={!meta.status}
                                    aria-labelledby='published_hidden_label' label={<label id='published_hidden_label'>Unlisted</label>}
                                    checked={meta.status === 'hidden'} onChange={this.handleFilterChange.bind(this)} />
                            </List.Item>
                            <List.Item>
                                <Checkbox radio name='published_status' value='any' disabled={!meta.status}
                                    aria-labelledby='published_any_label' label={<label id='published_any_label'>All</label>}
                                    checked={meta.status === 'any'} onChange={this.handleFilterChange.bind(this)} />
                            </List.Item>
                        </List>
                    </Segment>
                  }
                  </div>
                </div>
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
