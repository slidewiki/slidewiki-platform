import React from 'react';;
import { NavLink } from 'fluxible-router';
import { Grid, Divider, Button, Image, Icon, Item, Label, Flag, Menu, Segment, Container } from 'semantic-ui-react';

import { connectToStores } from 'fluxible-addons-react';
import DeckListStore from '../../stores/DeckListStore';
import DeckViewStore from '../../stores/DeckViewStore';
import ContentLikeStore from '../../stores/ContentLikeStore';
import ContentModulesStore from '../../stores/ContentModulesStore';

import CustomDate from './util/CustomDate';
import { getLanguageName, isEmpty } from '../../common';
import { flagForLocale } from '../../configs/locales';
import { Microservices } from '../../configs/microservices';

import CCBYSA from '../common/CC-BY-SA';
import ReportModal from '../Report/ReportModal';
import TagList from './ContentModulesPanel/TagsPanel/TagList';
import PresentationPanel from './InfoPanel/PresentationsPanel';
import ActivityFeedPanel from './ActivityFeedPanel/ActivityFeedPanel';


class DeckLandingPage extends React.Component {

    render() {
        const deckData = this.props.DeckViewStore.deckData;
        console.log(deckData);
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

                        <Image src={`${Microservices.file.uri}/thumbnail/slide/${deckData.firstSlide}`} bordered size='medium' spaced as='a' href={'/deck/' + deckData._id + '-' + deckData.revision + '/view'} aria-hidden='true'/>
                      </Grid.Column>
                      <Grid.Column width={6}>
                        <Item>
                          <Item.Content>
                            <Item.Header as="h2">{deckData.title + ' '} {(!deckData.hidden) ? <Label color='green'>Published</Label> : <Label inverted color='lightGrey'>Unlisted</Label>}</Item.Header>
                             <Item.Description>{deckData.description}</Item.Description>
                          <Divider hidden/>
                            <Item.Meta><strong>Creator:</strong> <NavLink href={'/user/' + owner.username}>{owner.displayName || owner.username}</NavLink></Item.Meta>
                            <Item.Meta><strong>Original Author:</strong> <NavLink href={'/user/' + creator.username}>{creator.displayName || creator.username}</NavLink></Item.Meta>
                            <Item.Meta><strong>Last modified:</strong> {CustomDate.format(deckData.lastUpdate, 'Do MMMM YYYY')}</Item.Meta>
                                <Divider hidden/>
                           </Item.Content>
                        </Item>
                      </Grid.Column>
                            <Grid.Column width={5}>
                                <Divider hidden />
                                <div className="ui right aligned container">
                                <div className="ui orange labels">
                                        <div className="ui label" tabIndex="0">
                                            <i className="fork icon" aria-label="Number of forks"></i>**</div>
                                        <div className="ui label" tabIndex="0">
                                            <i className="thumbs up icon" aria-label="Number of likes"></i>{this.props.ContentLikeStore.usersWhoLikedDeck.length}</div>
                                        <div className="ui label" tabIndex="0">
                                            <i className="share alternate icon" aria-label="Number of shares"></i>{deckData.shareCount}</div>
                                        <div className="ui label" tabIndex="0">
                                            <i className="download icon" aria-label="Number of downloads"></i>{deckData.downloadCount}</div>
                                    </div>
                                </div>
                              </Grid.Column>
                            </Grid>
                          </Segment>
                    </Grid.Row>

                    <Grid.Row>
                        <div className="ui bottom attached tabular menu" style={{'background': '#DCDDDE'}}>
                        <div className="right menu">
                        <div className="ui icon buttons huge right floated">
                          <Button icon large aria-label='open deck' data-tooltip='open deck' role='button' >
                            <Icon name='open folder' color='yellow' />
                          </Button>
                          <Button icon large aria-label='open slideshow' data-tooltip='open slideshow' role='button' >
                            <Icon name='play circle' color='grey' />
                          </Button>
                          <Button icon large aria-label='start live presentation' data-tooltip='start live presentation' role='button'>
                            <Icon name='record' color='blue' />
                          </Button>
                            </div>
                            </div>
                        </div>
                      {/*<Menu vertical fluid>
                      <Menu.Item as={() => {return <NavLink href={'/deck/' + deckData._id + '-' + deckData.revision}><Button fluid basic color='blue' size='large' ><Icon name='folder large open' color='yellow'/>
                                Open Deck</Button></NavLink>;}}/>
                      <Menu.Item as={() => {return <a href={'/presentation/' + deckData._id + '-' + deckData.revision} target="_blank"><Button fluid basic color='blue' size='large' ><Icon name='play large circle' color='grey'/>Play SlideShow</Button></a>;}}/>
                      <Menu.Item as={() => {return <PresentationPanel deckPage={true}/>;}}/>
                    </Menu>
                    {/*<NavLink href='#'><Button basic fluid icon labelPosition='left' color='blue'><Icon name='th' color='blue'/>Add to Playlist ???</Button></NavLink><br/>*/}
                    
                  </Grid.Row>
      {/*}              <Grid.Column mobile={16} tablet={1} computer={2}>
                </Grid.Column>
  */}
                 
                   <Divider hidden />
                <Grid.Row>
                    <Grid divided='vertically' stackable>
                <Grid.Column mobile={16} tablet={10} computer={13}>
                    <Grid.Row>
                    <h4>Available in the following languages:</h4>
                    {<span><NavLink href={'/deck/' + deckData._id + '-' + deckData.revision + '?language=' + deckData.language}>{getLanguageName(deckData.language)} <Flag name={flagForLocale(deckData.language)}/></NavLink>{(deckData.variants.length > 0) ? ', ' : ''}</span>}
                    {deckData.variants.map((variant, key) => {
                        return <span key={key}><NavLink href={'/deck/' + deckData._id + '-' + deckData.revision + '?language=' + variant.language}>{getLanguageName(variant.language)} <Flag name={flagForLocale(variant.language)}/></NavLink>{(deckData.variants.length - 1 !== key) ? ', ' : ''}</span>;
                    })}
                  </Grid.Row>
                  <br/>
                  <Grid.Row>
                    <h4>Marked with tags:</h4>
                    {(deckData.tags.length === 0) ? <div>There are no tags assigned to this deck.</div> : <TagList items={deckData.tags} editable={false}/>}
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <h4>You may also be interested in:</h4>
                    {interestedInDecks}
                    {/*<Icon name='chevron circle right' size='huge' link/>*/}
                  </Grid.Row>
                        </Grid.Column>
                    <Grid.Column mobile={16} tablet={1} computer={3}>
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

DeckLandingPage = connectToStores(DeckLandingPage, [ContentLikeStore, DeckViewStore, ContentModulesStore, DeckListStore], (context, props) => {
    return {
        ContentLikeStore: context.getStore(ContentLikeStore).getState(),
        DeckViewStore: context.getStore(DeckViewStore).getState(),
        ContentModulesStore: context.getStore(ContentModulesStore).getState(),
        DeckListStore : context.getStore(DeckListStore).getState(),
    };
});

export default DeckLandingPage;
