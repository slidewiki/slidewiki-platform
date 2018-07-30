import React from 'react';
import { Grid, Divider, Button, Label, Image, Icon } from 'semantic-ui-react';
import { NavLink } from 'fluxible-router';
import ActivityFeedPanel from './ActivityFeedPanel/ActivityFeedPanel';
import {connectToStores} from 'fluxible-addons-react';
import DeckPageStore from '../../stores/DeckPageStore';

class DeckLandingPage extends React.Component {

    render() {

        return (
            <div className="ui fluid container">
              <Divider hidden/>
              <Grid divided='vertically' stackable>
                <Grid.Column mobile={16} tablet={1} computer={3}>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={10} computer={8}>
                  <Grid.Row>
                    <Image src='https://fileservice.experimental.slidewiki.org/thumbnail/slide/37-8' bordered floated='left' size='medium' spaced as='a' href='/deck/3971'/>
                    <span>
                      <h2>SlideWiki Quick Start Guide</h2>
                      <strong>Owner:</strong> <NavLink href='/user/abijames1'>Abi James</NavLink><br/>
                      <strong>Original Author:</strong> <NavLink href='/user/abijames1'>Edna MC (in deck)</NavLink><br/>
                      <strong>Last modified:</strong> 1st January 2018<br/>
                      <strong>Description:</strong> This deck takes you through the basic features of SlideWiki.<br/>
                      <strong>Language:</strong> English<br/>
                      <strong>Topic:</strong> <NavLink href='#'>Software</NavLink> / <NavLink href='#'>Guide</NavLink><br/>
                    </span>
                    <Divider hidden/>
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <h4>More Information</h4>
                    <strong>Aduience:</strong> <NavLink href='#'>School</NavLink><br/>
                    <strong>Created:</strong> 1st January 2016<br/>
                    <strong>Accessibility Information:</strong> <Icon name='star'/>
                      <Icon name='star'/>
                      <Icon name='star half'/>
                      <Icon name='star outline'/>
                      <Icon name='star outline'/>
                      <br/>
                    <strong>Other languages available:</strong> <NavLink href='#'>German</NavLink> (63%), <NavLink href='#'>Spanish</NavLink> (45%)<br/>
                    <strong>Resource Type:</strong> presentation<br/>
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <h4>Contains:</h4>
                    3 contributors<br/>
                    38 slides<br/>
                    5 sources<br/>
                    16 questions<br/>
                    23 comments<br/>
                    <NavLink href='#'><h4>Other versions available</h4></NavLink>
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <Label as='a' tag>nadp17</Label>
                    <Label as='a' tag>open source</Label>
                    <Label as='a' tag>swguide</Label>
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <h4>You may also be interested in:</h4>
                    <Image src='https://fileservice.experimental.slidewiki.org/thumbnail/slide/37-8' bordered floated='left' size='small' spaced as='a' href='/deck/3971'/>
                    <Image src='https://fileservice.experimental.slidewiki.org/thumbnail/slide/37-8' bordered floated='left' size='small' spaced as='a' href='/deck/3971'/>
                    <Image src='https://fileservice.experimental.slidewiki.org/thumbnail/slide/37-8' bordered floated='left' size='small' spaced as='a' href='/deck/3971'/>
                    <Icon name='chevron circle right' size='huge' link/>
                  </Grid.Row>
                </Grid.Column>

                <Grid.Column mobile={16} tablet={4} computer={2}>
                  <Grid.Row>
                    <NavLink href='/deck/294'><Button basic fluid icon labelPosition='left' color='blue'><Icon name='folder open' color='yellow'/>Open Deck</Button></NavLink><br/>
                    <NavLink href='/presentation/294'><Button basic fluid icon labelPosition='left' color='blue'><Icon name='play circle' color='grey'/>Play SlideShow</Button></NavLink><br/>
                    <NavLink href='#'><Button basic fluid icon labelPosition='left' color='blue'><Icon name='th' color='blue'/>Add to Playlist</Button></NavLink><br/>
                    <NavLink href='#'><Button basic fluid icon labelPosition='left' color='blue'><Icon name='sitemap' color='grey'/>Live Session</Button></NavLink><br/>
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <Button compact color='grey' disabled><Icon name='thumbs up' /> 0</Button>
                    <Button compact color='grey' disabled><Icon name='share alternate' /> 0</Button>
                    <Button compact color='grey' disabled><Icon name='download' /> 0</Button>
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <ActivityFeedPanel />
                  </Grid.Row>
                  <Divider />
                  <Grid.Row>
                    <Button basic fluid icon labelPosition='left' color='blue'><Icon name='exclamation circle' color='black'/>Report Issue</Button>
                  </Grid.Row>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={1} computer={3}>
                </Grid.Column>
              </Grid>
            </div>
        );
    }
}

DeckLandingPage = connectToStores(DeckLandingPage, [DeckPageStore], (context, props) => {
    return {
        DeckPageStore: context.getStore(DeckPageStore).getState()
    };
});

export default DeckLandingPage;
