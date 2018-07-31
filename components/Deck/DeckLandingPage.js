import React from 'react';;
import { NavLink } from 'fluxible-router';
import { Grid, Divider, Button, Image, Icon } from 'semantic-ui-react';

import { connectToStores } from 'fluxible-addons-react';
import DeckListStore from '../../stores/DeckListStore';
import DeckViewStore from '../../stores/DeckViewStore';
import ContentLikeStore from '../../stores/ContentLikeStore';
import ContentModulesStore from '../../stores/ContentModulesStore';

import CustomDate from './util/CustomDate';
import { getLanguageName, isEmpty } from '../../common';
import { Microservices } from '../../configs/microservices';

import ReportModal from '../Report/ReportModal';
import TagList from './ContentModulesPanel/TagsPanel/TagList';
import PresentationPanel from './InfoPanel/PresentationsPanel';
import ActivityFeedPanel from './ActivityFeedPanel/ActivityFeedPanel';

class DeckLandingPage extends React.Component {

    render() {
        const deckData = this.props.DeckViewStore.deckData;
        if(!deckData.variants)
            deckData.variants = [];

        const owner = this.props.DeckViewStore.ownerData;
        const creator = this.props.DeckViewStore.creatorData;

        let interestedInDecks = 'No decks to show';
        if(this.props.DeckListStore.featured && this.props.DeckListStore.featured.length >= 1)
            interestedInDecks =  this.props.DeckListStore.featured.map((deck, i) => {
                return <Grid.Column key={i} width={5}><NavLink href={`/deck/${deck._id}`}><Image src={`${Microservices.file.uri}/thumbnail/slide/${deck.firstSlide}`} bordered /><h3>{deck.title}</h3></NavLink></Grid.Column>;
            });
        interestedInDecks = <Grid stackable> {interestedInDecks} </Grid>;

        return (
            <div className="ui fluid container">
              <Divider hidden/>
              <Grid divided='vertically' stackable>
                <Grid.Column mobile={16} tablet={1} computer={2}>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={10} computer={9}>
                  <Grid.Row>
                  <Grid stackable>
                    <Grid.Column width={5}>
                      <Image src={`${Microservices.file.uri}/thumbnail/slide/${deckData.firstSlide}`} bordered size='medium' spaced as='a' href={'/deck/' + deckData._id + '-' + deckData.revision}/>
                    </Grid.Column>
                    <Grid.Column width={11}>
                      <span>
                        <h2>{deckData.title}</h2>
                        <strong>Owner:</strong> <NavLink href={'/user/' + owner.username}>{owner.displayName || owner.username}</NavLink><br/>
                        <strong>Original Author:</strong> <NavLink href={'/user/' + creator.username}>{creator.displayName || creator.username}</NavLink> (in ???)<br/>
                        <strong>Last modified:</strong> {CustomDate.format(deckData.lastUpdate, 'Do MMMM YYYY')}<br/>
                        <strong>Description:</strong> {deckData.description}<br/>
                        <strong>Language:</strong> {getLanguageName(deckData.language)}<br/>
                        <strong>Topic:</strong> <NavLink href='#'>???</NavLink> / <NavLink href='#'>???</NavLink><br/>
                      </span>
                    </Grid.Column>
                  </Grid>
                  <Divider hidden/>
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <Grid stackable divided>
                      <Grid.Column width={8}>
                      <h4>More Information</h4>
                      <strong>Audience:</strong> <NavLink href='#'>???</NavLink><br/>
                      <strong>Resource Type:</strong> ???<br/>
                      <strong>Created:</strong> {CustomDate.format(deckData.timestamp, 'Do MMMM YYYY')}<br/>
                      <strong>Accessibility Information:</strong>
                        <Icon name='star'/>
                        <Icon name='star'/>
                        <Icon name='star half'/>
                        <Icon name='star outline'/>
                        <Icon name='star outline'/> ???
                        <br/>
                      <strong>Other languages available:</strong> {
                        deckData.variants.map((variant, key) => {
                            return <span key={key}><NavLink href={'/deck/' + deckData._id + '-' + deckData.revision + '?language=' + variant.language}>{getLanguageName(variant.language)}</NavLink> (???%),</span>;
                        })
                      }<br/>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <h4>Contains</h4>
                        Slides: {this.props.DeckViewStore.slidesData.children.length} <br/>
                        Sources: {this.props.ContentModulesStore.moduleCount.datasource} <br/>
                        Questions: {this.props.ContentModulesStore.moduleCount.questions} <br/>
                        Comments: {this.props.ContentModulesStore.moduleCount.comments} <br/>
                        Contributors: {deckData.contributors.length - 1} <br/>
                        <NavLink href='#'><h4>Other versions available ???</h4></NavLink>
                      </Grid.Column>
                    </Grid>
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <h4>Tags:</h4>
                    {(deckData.tags.length === 0) ? <div>There are currently no tags.</div> : <TagList items={deckData.tags} editable={false}/>}
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <h4>You may also be interested in:</h4>
                    {interestedInDecks}
                    {/*<Icon name='chevron circle right' size='huge' link/>*/}
                  </Grid.Row>
                </Grid.Column>

                <Grid.Column mobile={16} tablet={4} computer={3}>
                  <Grid.Row>
                    <NavLink href={'/deck/' + deckData._id + '-' + deckData.revision}><Button basic fluid icon labelPosition='left' color='grey'><Icon name='folder open' color='yellow'/>Open Deck</Button></NavLink><br/>
                    <a href={'/presentation/' + deckData._id + '-' + deckData.revision} target="_blank"><Button basic fluid icon labelPosition='left' color='grey'><Icon name='play circle' color='grey'/>Play SlideShow</Button></a><br/>
                    {/*<NavLink href='#'><Button basic fluid icon labelPosition='left' color='blue'><Icon name='th' color='blue'/>Add to Playlist ???</Button></NavLink><br/>*/}
                    <PresentationPanel deckPage={true}/><b/>
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <Button compact color='grey' disabled><Icon name='thumbs up' /> {this.props.ContentLikeStore.usersWhoLikedDeck.length}</Button>
                    <Button compact color='grey' disabled><Icon name='share alternate' /> {deckData.shareCount}</Button>
                    <Button compact color='grey' disabled><Icon name='download' /> {deckData.downloadCount}</Button>
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <ActivityFeedPanel />
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <ReportModal id="reportModal" deckpage={true}/>
                  </Grid.Row>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={1} computer={2}>
                </Grid.Column>
              </Grid>
            </div>
        );
    }
}

DeckLandingPage = connectToStores(DeckLandingPage, [ContentLikeStore, DeckViewStore, ContentModulesStore, DeckListStore], (context, props) => {
    return {
        ContentLikeStore: context.getStore(ContentLikeStore).getState(),
        DeckViewStore: context.getStore(DeckViewStore).getState(),
        ContentModulesStore: context.getStore(ContentModulesStore).getState(),
        DeckListStore : context.getStore(DeckListStore).getState(),
    };
});

export default DeckLandingPage;
