import React from 'react';;
import { NavLink } from 'fluxible-router';
import { Grid, Divider, Button, Header, Image, Icon, Item, Label, Menu, Segment, Container } from 'semantic-ui-react';

import { connectToStores } from 'fluxible-addons-react';
import DeckPageStore from '../../stores/DeckPageStore';
import DeckListStore from '../../stores/DeckListStore';
import DeckViewStore from '../../stores/DeckViewStore';
import ContentLikeStore from '../../stores/ContentLikeStore';
import ContentModulesStore from '../../stores/ContentModulesStore';
import TranslationStore from '../../stores/TranslationStore';

import CustomDate from './util/CustomDate';
import {getLanguageDisplayName, getLanguageName, isEmpty} from '../../common';
import { flagForLocale } from '../../configs/locales';
import { Microservices } from '../../configs/microservices';

import CCBYSA from '../common/CC-BY-SA';
import ReportModal from '../Report/ReportModal';
import TagList from './ContentModulesPanel/TagsPanel/TagList';
import PresentationsPanel from './InfoPanel/PresentationsPanel';
import ActivityFeedPanel from './ActivityFeedPanel/ActivityFeedPanel';

import { getEducationLevel } from '../../lib/isced';
import lodash from 'lodash';

class DeckLandingPage extends React.Component {

    getPresentationHref() {
        let selector = this.props.DeckPageStore.selector;
        let presentationUrlParts = ['/presentation', selector.id, this.props.DeckPageStore.deckSlug || '_'];

        if (selector.spath.search(';') !== -1) {
            // if a subdeck is selected - use its selector
            presentationUrlParts.push(selector.spath.substring(0, selector.spath.search(';')));
        } else {
            // if it is the main/root deck - use that id
            presentationUrlParts.push(selector.id);
        }

        if (selector.stype === 'slide'){
            // if it is a slide, also add ID of slide
            presentationUrlParts.push(selector.sid);
        }

        let presLocation = presentationUrlParts.join('/');

        if (this.props.TranslationStore.currentLang) {
            presLocation += '?language=' + (this.props.TranslationStore.currentLang);
        }

        return presLocation;
    }

    render() {
        let deckData = this.props.DeckViewStore.deckData;

        let firstSlide = (this.props.DeckViewStore.slidesData && this.props.DeckViewStore.slidesData.children && this.props.DeckViewStore.slidesData.children[0]);
        const totalSlides = lodash.get(this.props.DeckViewStore.slidesData, 'children.length', undefined);

        let deckThumbURL = firstSlide && `${Microservices.file.uri}/thumbnail/slide/${firstSlide.id}`;
        if (deckThumbURL && firstSlide.theme) {
            deckThumbURL += '/' + firstSlide.theme;
        }
        let deckThumbAlt = firstSlide && (firstSlide.title ? firstSlide.title + ' | ' + firstSlide.id : firstSlide.id);

        let deckSlug = this.props.DeckPageStore.deckSlug || '_';
        let selector = this.props.DeckPageStore.selector;
        let openDeckUrl = ['', 'deck', selector.id , deckSlug, 'deck', selector.id].join('/');
        let presentationUrl = this.getPresentationHref();

        let deckTags = deckData.tags || [];
        let deckTopics = deckData.topics || [];

        if(!deckData.variants)
            deckData.variants = [];

        let deckLanguages = [this.props.TranslationStore.treeLanguage, ...this.props.TranslationStore.treeTranslations];
        
        let owner = this.props.DeckViewStore.ownerData;
        let creator = this.props.DeckViewStore.creatorData;
        let originInfo = deckData.origin != null ? <div className="meta" tabIndex="0"><strong>Origin:&nbsp;</strong>
            <NavLink href={['/deck', deckData.origin.id + '-' + deckData.origin.revision, deckData.origin.slug].join('/')}>{deckData.origin.title}</NavLink> by <a href={'/user/' + originCreator}>{originCreator}</a>{/* TODO check if this URL is working with languages! */}
        </div> : '';

        const ColPadding = {
            paddingLeft: '0px'
        };

        let interestedInDecks = 'No decks to show';
        if(this.props.DeckListStore.featured && this.props.DeckListStore.featured.length >= 1)
            interestedInDecks =  this.props.DeckListStore.featured.map((deck, i) => {
                return <Grid.Column key={i} width={5}><NavLink href={`/deck/${deck._id}`}><Image src={`${Microservices.file.uri}/thumbnail/slide/${deck.firstSlide}`} bordered /><h3>{deck.title}</h3></NavLink></Grid.Column>;
            });
        interestedInDecks = <Grid stackable> {interestedInDecks} </Grid>;

        return (
            <div>
            <Container fluid>
              <Divider hidden/>
              <Grid divided='vertically' stackable>
                <Grid.Column mobile={0} tablet={1} computer={2}>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={14} computer={12}>
                  <Grid.Row>
                      <Segment>
                          <Grid stackable>
                              <Grid.Column width={4}>
                                  <NavLink className="image" aria-hidden tabIndex='-1' href={openDeckUrl}>
                                      <Image src={deckThumbURL} alt={deckThumbAlt}
                                             size='large' bordered spaced />
                                  </NavLink>
                              </Grid.Column>
                              <Grid.Column width={12}>
                                  <div className="row">
                                      <Header as="h1">{deckData.title + ' '} {(!deckData.hidden) ? <Label color='green'>Published</Label> : <Label color='red'>Unlisted</Label>}</Header>
                                  </div>
                                  <Divider hidden />
                                  <div className="ui stackable grid container">
                                      <div className="two column row">
                                          <div className="column" style={ColPadding}>
                                              <div className="item">
                                                  <div className="meta"><strong>Creator:</strong> <NavLink href={'/user/' + owner.username}>{owner.displayName || owner.username}</NavLink></div>
                                                  {originInfo}
                                                  <div className="meta"><strong>Last Modified:&nbsp;</strong>{CustomDate.format(deckData.lastUpdate, 'Do MMMM YYYY')}</div>
                                              </div>
                                          </div>
                                          {/* <strong>Original Author:</strong> <NavLink href={'/user/' + creator.username}>{creator.displayName || creator.username}</NavLink></Item.Met>
                                    //      <Item.Meta><strong>Last modified:</strong> {CustomDate.format(deckData.lastUpdate, 'Do MMMM YYYY')}</Item.Meta>
                                          <Item.Meta><strong>Description</strong></Item.Meta>
                                  <Item.Description>{deckData.description}</Item.Description>
                            <Divider hidden/>
                            <Item.Meta><strong>Creator:</strong> <NavLink href={'/user/' + owner.username}>{owner.displayName || owner.username}</NavLink></Item.Meta>
                            <Item.Meta><strong>Original Author:</strong> <NavLink href={'/user/' + creator.username}>{creator.displayName || creator.username}</NavLink></Item.Meta>
                            <Item.Meta><strong>Last modified:</strong> {CustomDate.format(deckData.lastUpdate, 'Do MMMM YYYY')}</Item.Meta>
                             */}
                                          <div className="column">
                                              <h2 className="sr-only">"Deck metadata"</h2>
                                              <div className="row">
                                                  <div className="ui medium labels" >
                                                      <div className="ui label" >
                                                          <i className="comments icon" aria-label="Default language"></i>{getLanguageDisplayName(deckData.language)}
                                                      </div>
                                                      <div className="ui label" >
                                                          <i className="block layout icon" aria-label="Number of slides"></i>{totalSlides}
                                                      </div>
                                                      { deckData.educationLevel &&
                                                      <div className="ui label" >
                                                          <i className="university icon" aria-label="Education Level"></i>{getEducationLevel(deckData.educationLevel)}
                                                      </div>
                                                      }
                                                  </div>
                                              </div>
                                              <div className="row">
                                                  <div className="ui medium labels">
                                                      <div className="ui label" >
                                                          <i className="fork icon" aria-label="Number of forks"></i>{deckData.forkCount}</div>
                                                      <div className="ui label" >
                                                          <i className="thumbs up icon" aria-label="Number of likes"></i>{this.props.ContentLikeStore.usersWhoLikedDeck.length}</div>
                                                      <div className="ui label" >
                                                          <i className="share alternate icon" aria-label="Number of shares"></i>{deckData.shareCount}</div>
                                                      <div className="ui label" >
                                                          <i className="download icon" aria-label="Number of downloads"></i>{deckData.downloadCount}</div>
                                                  </div>

                                                  {/*<div className="ui orange labels">
                                        { deckData.educationLevel &&
                                            <div className="ui label" >
                                                <i className="university icon" aria-label="Education Level"></i>{getEducationLevel(deckData.educationLevel)}
                                            </div>
                                        }
                                        <div className="ui label" tabIndex="0">
                                            <i className="fork icon" aria-label="Number of forks"></i>{deckData.forkCount}</div>
                                        <div className="ui label" tabIndex="0">
                                            <i className="thumbs up icon" aria-label="Number of likes"></i>{this.props.ContentLikeStore.usersWhoLikedDeck.length}</div>
                                        <div className="ui label" tabIndex="0">
                                            <i className="share alternate icon" aria-label="Number of shares"></i>{deckData.shareCount}</div>
                                        <div className="ui label" tabIndex="0">
                                            <i className="download icon" aria-label="Number of downloads"></i>{deckData.downloadCount}</div>
                                    </div> */}
                                              </div>
                                          </div>
                                      </div>
                                      <div className="row" >
                                          <div className="item">
                                              <div className="meta"><strong>Description:</strong>
                                                  <div className="description" >{deckData.description}</div>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="row" >
                                          { deckTopics.length > 0 &&
                                          <div className="item">
                                              <div className="meta"><strong>Subject:&nbsp;</strong></div>
                                              <div className="description">{ deckTopics.map((t, i) =>
                                                  <span key={i}>
                                                              { !!i && ',\xa0' }
                                                      <a target="_blank" href={`/deckfamily/${t.tagName}`}>{t.defaultName || t.tagName}</a>
                                                          </span>
                                              ) }
                                              </div>
                                          </div>
                                          }
                                      </div>
                                  </div>
                              </Grid.Column>
                          </Grid>
                      </Segment>
                  </Grid.Row>
                     <Grid.Row>
                        <div className="ui bottom attached tabular secondary menu" style={{'background': '#DCDDDE'}}>
                        <div className="right menu">
                            <div className="ui icon buttons huge attached">
                            <NavLink href={openDeckUrl} tabIndex={-1} >
                                <Button icon large aria-label='open deck' data-tooltip='open deck' role='button'>
                                    <Icon name='open folder' color='yellow' />
                                </Button>
                            </NavLink>
                            <a target="_blank" href={presentationUrl} tabIndex={-1} >
                                <Button icon large aria-label='open slideshow' data-tooltip='open slideshow' role='button' >
                                    <Icon name='play circle' color='grey' />
                                </Button>
                            </a>
                            <PresentationsPanel deckPage={true} />
                          {/*<Button icon large aria-label='start live presentation' data-tooltip='start live presentation' role='button'>
                            <Icon name='record' color='blue' />
                          </Button>*/}
                            </div>
                            </div>
                        </div>
                      {/*<Menu vertical fluid>
                      <Menu.Item as={() => {return <NavLink href={'/deck/' + deckData._id + '-' + deckData.revision}><Button fluid basic color='blue' size='large' ><Icon name='folder large open' color='yellow'/>
                                Open Deck</Button></NavLink>;}}/>
                      <Menu.Item as={() => {return <a href={'/presentation/' + deckData._id + '-' + deckData.revision} target="_blank"><Button fluid basic color='blue' size='large' ><Icon name='play large circle' color='grey'/>Play SlideShow</Button></a>;}}/>
                      <Menu.Item as={() => {return <PresentationsPanel deckPage={true}/>;}}/>
                    </Menu>
                    {/*<NavLink href='#'><Button basic fluid icon labelPosition='left' color='blue'><Icon name='th' color='blue'/>Add to Playlist ???</Button></NavLink><br/>*/}

                  </Grid.Row>
      {/*}              <Grid.Column mobile={16} tablet={1} computer={2}>
                </Grid.Column>
  */}
                 
                   <Divider hidden />
                <Grid.Row>
                    <Grid divided='vertically' stackable>
                <Grid.Column mobile={16} tablet={10} computer={12}>
                    <Grid.Row>
                        <h4>Available in the following languages:</h4>
                        { deckLanguages.map((lang, i) =>
                            <span key={i}>
                                {!!i && ',\xa0'}
                                <NavLink href={'/deck/' + deckData._id + '-' + deckData.revision + '?language=' + lang}>
                                    <i className={ (flagForLocale(lang) || 'icon') + ' flag' }/>
                                    { getLanguageDisplayName(lang) }
                                </NavLink>
                            </span>
                        ) }
                    </Grid.Row>
                    <Divider />
                    {/* <Grid.Row>
                        <h4>Subjects:</h4>
                        { (deckTopics.length === 0) ?
                            <div>There are no subjects assigned to this deck.</div> :
                            <div>{ deckTopics.map((t, i) => 
                                <span key={i}>
                                    { !!i && ',\xa0' }
                                    <a target="_blank" href={`/deckfamily/${t.tagName}`}>{t.defaultName || t.tagName}</a>
                                </span>
                            ) }</div>
                        }
                    </Grid.Row>
                    */}
                    <Divider />
                    <Grid.Row>
                        <h5>Tags:</h5>
                        {(deckTags.length === 0) ? <div>There are no tags assigned to this deck.</div> : <TagList items={deckTags} editable={false}/>}
                    </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <h2>You may also be interested in:</h2>
                    {interestedInDecks}
                    {/*<Icon name='chevron circle right' size='huge' link/>*/}
                  </Grid.Row>
                        </Grid.Column>
                    <Grid.Column mobile={16} tablet={1} computer={4}>
                        <Grid.Row>
                            <Segment>
                    <ActivityFeedPanel /></Segment>
                    <Segment attached='bottom'>
                    <a href='https://creativecommons.org/licenses/by-sa/4.0/' target='_blank'>
                      <CCBYSA size='small' />
                    </a>
                    This work is licensed under <a href='https://creativecommons.org/licenses/by-sa/4.0/' target='_blank'>Creative Commons Attribution-ShareAlike 4.0 International License</a>
                        </Segment>
                  </Grid.Row>
                </Grid.Column>
                    </Grid>
                    </Grid.Row>
{/*<Grid.Row>
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
                        deckLanguages.map((variant, key) => {
                            return <span key={key}><NavLink href={'/deck/' + deckData._id + '-' + deckData.revision + '?language=' + language}>{getLanguageDisplayName(language)}</NavLink> (???%),</span>;
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
*/}
                  <Divider />
                  
                       </Grid.Column>
 
<Grid.Column mobile={0} tablet={1} computer={2}>
                </Grid.Column>
                  
              {/*  <Grid.Column mobile={16} tablet={4} computer={2}>
                  
                  <Divider />
                  <Grid.Row>
                    <Button compact color='secondary' disabled><Icon name='thumbs up' /> {this.props.ContentLikeStore.usersWhoLikedDeck.length}</Button>
                    <Button compact color='secondary' disabled><Icon name='share alternate' /> {deckData.shareCount}</Button>
                    <Button compact color='secondary' disabled><Icon name='download' /> {deckData.downloadCount}</Button>
                  </Grid.Row>
                  <Divider />
                  
                </Grid.Column> 
                
                <Grid.Column mobile={16} tablet={1} computer={2}>
                </Grid.Column>
                */}
              </Grid>
            </Container>  
            </div>
        );
    }
}

DeckLandingPage = connectToStores(DeckLandingPage, [ContentLikeStore, DeckPageStore, DeckViewStore, TranslationStore, ContentModulesStore, DeckListStore], (context, props) => {
    return {
        ContentLikeStore: context.getStore(ContentLikeStore).getState(),
        DeckPageStore: context.getStore(DeckPageStore).getState(),
        DeckViewStore: context.getStore(DeckViewStore).getState(),
        TranslationStore: context.getStore(TranslationStore).getState(),
        ContentModulesStore: context.getStore(ContentModulesStore).getState(),
        DeckListStore : context.getStore(DeckListStore).getState(),
    };
});

export default DeckLandingPage;
