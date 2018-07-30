import React from 'react';
import { Grid, Divider, Button, Label, Image, Icon } from 'semantic-ui-react';
import { NavLink } from 'fluxible-router';
import ActivityFeedPanel from './ActivityFeedPanel/ActivityFeedPanel';
import {connectToStores} from 'fluxible-addons-react';
import DeckPageStore from '../../stores/DeckPageStore';
import ContributorsStore from '../../stores/ContributorsStore';
import TranslationStore from '../../stores/TranslationStore';
import ContentLikeStore from '../../stores/ContentLikeStore';
import DeckViewStore from '../../stores/DeckViewStore';
import ContentModulesStore from '../../stores/ContentModulesStore';
import TagsStore from '../../stores/TagsStore';
import DeckListStore from '../../stores/DeckListStore';
import { getLanguageName } from '../../common';
import lodash from 'lodash';
import CustomDate from './util/CustomDate';
import {Microservices} from '../../configs/microservices';
import TagList from './ContentModulesPanel/TagsPanel/TagList';
import ReportModal from '../Report/ReportModal';
import PresentationPanel from './InfoPanel/PresentationsPanel';

class DeckLandingPage extends React.Component {

    render() {
        const creator = this.props.DeckViewStore.creatorData;
        const owner = this.props.DeckViewStore.ownerData;
        const contributors = this.props.ContributorsStore.contributors;
        const language = getLanguageName(this.props.TranslationStore.originLanguage);
        const translations = this.props.TranslationStore.translations;
        const totalSlides = lodash.get(this.props.DeckViewStore.slidesData, 'children.length', undefined);
        const deckCreator = this.props.DeckViewStore.creatorData;
        const deckOwner = this.props.DeckViewStore.ownerData;
        const deckData = this.props.DeckViewStore.deckData;
        const creationDate = CustomDate.format(deckData.timestamp, 'Do MMMM YYYY');
        const lastUpdateDate = CustomDate.format(deckData.lastUpdate, 'Do MMMM YYYY');
        const description = lodash.get(deckData, 'description', '');
        const shareCount = deckData.shareCount;
        const downloadCount = deckData.downloadCount;
        let slidesArr = [];
        if (this.props.DeckViewStore.slidesData && this.props.DeckViewStore.slidesData.children) {
            slidesArr = this.props.DeckViewStore.slidesData.children;
        }
        const deckPicture = (slidesArr.length >= 1) ? <Image src={`${Microservices.file.uri}/thumbnail/slide/${slidesArr[0].id}`} bordered size='medium' spaced as='a' href={'/deck/' + this.props.DeckPageStore.selector.id}/> : '';

        const listOfTags = (this.props.TagsStore.tags.length === 0) ? <div>There are currently no tags.</div> : <div><TagList items={this.props.TagsStore.tags} editable={false}/></div>;
        const featuredDecks = this.props.DeckListStore.featured;
        let interestedInDecks;
        if(featuredDecks.length >= 1) {
            interestedInDecks = <Grid stackable>
                <Grid.Column width={5}><NavLink href={`/deck/${featuredDecks[0]._id}`}><Image src={`${Microservices.file.uri}/thumbnail/slide/${featuredDecks[0].firstSlide}`} bordered /><h3>{featuredDecks[0].title}</h3></NavLink></Grid.Column>
                <Grid.Column width={5}><NavLink href={`/deck/${featuredDecks[1]._id}`}><Image src={`${Microservices.file.uri}/thumbnail/slide/${featuredDecks[1].firstSlide}`} bordered /><h3>{featuredDecks[1].title}</h3></NavLink></Grid.Column>
                <Grid.Column width={5}><NavLink href={`/deck/${featuredDecks[2]._id}`}><Image src={`${Microservices.file.uri}/thumbnail/slide/${featuredDecks[2].firstSlide}`} bordered /><h3>{featuredDecks[2].title}</h3></NavLink></Grid.Column>
                </Grid>;
        } else
            interestedInDecks = 'No decks to show';

        return (
            <div className="ui fluid container">
              <Divider hidden/>
              <Grid divided='vertically' stackable>
                <Grid.Column mobile={16} tablet={1} computer={3}>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={10} computer={8}>
                  <Grid.Row>
                  <Grid stackable>
                    <Grid.Column width={5}>
                      {deckPicture}
                    </Grid.Column>
                    <Grid.Column width={11}>
                      <span>
                        <h2>SlideWiki Quick Start Guide</h2>
                        <strong>Owner:</strong> <NavLink href={'/user/' + owner.username}>{owner.displayName || owner.username}</NavLink><br/>
                        <strong>Original Author:</strong> <NavLink href={'/user/' + creator.username}>{creator.displayName || creator.username}</NavLink> (in ???)<br/>
                        <strong>Last modified:</strong> {lastUpdateDate}<br/>
                        <strong>Description:</strong> {description}<br/>
                        <strong>Language:</strong> {language}<br/>
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
                      <strong>Aduience:</strong> <NavLink href='#'>???</NavLink><br/>
                      <strong>Created:</strong> {creationDate}<br/>
                      <strong>Accessibility Information:</strong> ???
                        {/*<Icon name='star'/>
                        <Icon name='star'/>
                        <Icon name='star half'/>
                        <Icon name='star outline'/>
                        <Icon name='star outline'/>*/}
                        <br/>
                      <strong>Other languages available:</strong> {
                        translations.map((lang, key) => {
                            return <span key={key}><NavLink href={'/deck/' + this.props.DeckPageStore.selector.id + '?language=' + lang}>{getLanguageName(lang)}</NavLink> (???%),</span>;
                        })
                      }<br/>
                      <strong>Resource Type:</strong> ???<br/>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <h4>Contains:</h4>
                        {contributors.length} contributors<br/>
                        {totalSlides} slides<br/>
                        {this.props.ContentModulesStore.moduleCount.datasource} sources<br/>
                        {this.props.ContentModulesStore.moduleCount.questions} questions<br/>
                        {this.props.ContentModulesStore.moduleCount.comments} comments<br/>
                        <NavLink href='#'><h4>Other versions available ???</h4></NavLink>
                      </Grid.Column>
                    </Grid>
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <h4>Tags:</h4>
                    {listOfTags}
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <h4>You may also be interested in:</h4>
                    {interestedInDecks}
                    {/*<Icon name='chevron circle right' size='huge' link/>*/}
                  </Grid.Row>
                </Grid.Column>

                <Grid.Column mobile={16} tablet={4} computer={2}>
                  <Grid.Row>
                    <NavLink href={'/deck/' + this.props.DeckPageStore.selector.id}><Button basic fluid icon labelPosition='left' color='blue'><Icon name='folder open' color='yellow'/>Open Deck</Button></NavLink><br/>
                    <NavLink href={'/presentation/' + this.props.DeckPageStore.selector.id}><Button basic fluid icon labelPosition='left' color='blue'><Icon name='play circle' color='grey'/>Play SlideShow</Button></NavLink><br/>
                    <NavLink href='#'><Button basic fluid icon labelPosition='left' color='blue'><Icon name='th' color='blue'/>Add to Playlist ???</Button></NavLink><br/>
                    <PresentationPanel deckPage={true}/><b/>
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <Button compact color='grey' disabled><Icon name='thumbs up' /> {this.props.ContentLikeStore.usersWhoLikedDeck.length}</Button>
                    <Button compact color='grey' disabled><Icon name='share alternate' /> {shareCount}</Button>
                    <Button compact color='grey' disabled><Icon name='download' /> {downloadCount}</Button>
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
                <Grid.Column mobile={16} tablet={1} computer={3}>
                </Grid.Column>
              </Grid>
            </div>
        );
    }
}

DeckLandingPage = connectToStores(DeckLandingPage, [DeckPageStore, ContributorsStore, TranslationStore, ContentLikeStore, DeckViewStore, ContentModulesStore, TagsStore, DeckListStore], (context, props) => {
    return {
        DeckPageStore: context.getStore(DeckPageStore).getState(),
        ContributorsStore: context.getStore(ContributorsStore).getState(),
        TranslationStore: context.getStore(TranslationStore).getState(),
        ContentLikeStore: context.getStore(ContentLikeStore).getState(),
        DeckViewStore: context.getStore(DeckViewStore).getState(),
        ContentModulesStore: context.getStore(ContentModulesStore).getState(),
        TagsStore: context.getStore(TagsStore).getState(),
        DeckListStore : context.getStore(DeckListStore).getState(),
    };
});

export default DeckLandingPage;
