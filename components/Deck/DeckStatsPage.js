import React from 'react';
import { NavLink } from 'fluxible-router';
import { Grid, Divider, Button, Header, Image, Icon, Item, Label, Menu, Segment, Container } from 'semantic-ui-react';

import { connectToStores } from 'fluxible-addons-react';
import DeckPageStore from '../../stores/DeckPageStore';
import DeckViewStore from '../../stores/DeckViewStore';
import DeckStatsStore from '../../stores/DeckStatsStore';

import { Microservices } from '../../configs/microservices';
import CustomDate from './util/CustomDate';

import DeckStats from './DeckStats';

class DeckStatsPage extends React.Component {

    render() {
        let deckData = this.props.DeckViewStore.deckData;

        let firstSlide = (this.props.DeckViewStore.slidesData && this.props.DeckViewStore.slidesData.children && this.props.DeckViewStore.slidesData.children[0]);

        let deckThumbURL = firstSlide && `${Microservices.file.uri}/thumbnail/slide/${firstSlide.id}`;
        if (deckThumbURL && firstSlide.theme) {
            deckThumbURL += '/' + firstSlide.theme;
        }
        let deckThumbAlt = firstSlide && (firstSlide.title ? firstSlide.title + ' | ' + firstSlide.id : firstSlide.id);

        let deckSlug = this.props.DeckPageStore.deckSlug || '_';
        let selector = this.props.DeckPageStore.selector;
        let viewDeckUrl = ['', 'deck', selector.id , deckSlug].join('/');

        let creator = this.props.DeckViewStore.creatorData;

        let originInfo = null;
        let originCreator = this.props.DeckViewStore.originCreatorData;
        if (deckData.origin) {
            if (deckData.origin.id) {
                originInfo = (
                    <div className="meta" tabIndex="0">
                        <strong>Origin: </strong>
                        <NavLink href={['/deck', deckData.origin.id + '-' + deckData.origin.revision, deckData.origin.slug].join('/')}>{deckData.origin.title}</NavLink>
                        {originCreator ? ' by ' : ''}
                        {originCreator && <NavLink href={'/user/' + originCreator.username}>{originCreator.displayName || originCreator.username}</NavLink>}
                        {/* TODO check if this URL is working with languages! */}
                    </div>
                );
            } else {
                originInfo = (
                    <div className="meta" tabIndex="0">
                        <strong>Origin: </strong>
                        {deckData.origin.title}
                    </div>
                );
            }
        }

        let summaryElement = (
            <div>
                <NavLink href={viewDeckUrl} tabIndex={-1} >
                    <Button aria-label="Return to Deck Info" data-tooltip="Return to Deck Info" role="button">
                        <Icon name="arrow alternate circle left" />Return to Deck Info
                    </Button>
                </NavLink>

                <Segment>
                    <NavLink className="image" aria-hidden tabIndex='-1' href={viewDeckUrl}>
                        <Image src={deckThumbURL} alt={deckThumbAlt}
                               fluid bordered />
                    </NavLink>

                    <Header as="h1">
                        <div className="sr-only">Deck title: </div>
                        <NavLink href={viewDeckUrl}>{deckData.title}</NavLink>
                        <div className="sr-only">Deck status: </div>
                        {(!deckData.hidden) ? <Label color='green'>Published</Label> : <Label color='pink'>Unlisted</Label>}
                    </Header>

                    <div className="item">
                        <div className="meta"><strong>Creator:</strong> <NavLink href={'/user/' + creator.username}>{creator.displayName || creator.username}</NavLink></div>
                        {originInfo}
                        <div className="meta"><strong>Last Modified:&nbsp;</strong>{CustomDate.format(deckData.lastUpdate, 'Do MMMM YYYY')}</div>
                    </div>

                    { deckData.description && <div className="item">
                        <div className="meta"><strong>Description:</strong>
                            <div className="description" >{deckData.description}</div>
                        </div>
                    </div> }

                </Segment>

            </div>
        );

        let statsElement = <DeckStats deckId={selector.id} deckStats={this.props.DeckStatsStore} />;

        return (
            <Grid padded="vertically" stackable>
                <Grid.Column only="tablet computer" tablet={1} computer={2}>
                </Grid.Column>

                <Grid.Column only="tablet computer" tablet={4} computer={3}>
                    {summaryElement}
                </Grid.Column>

                <Grid.Column only="tablet computer" tablet={10} computer={9}>
                    {statsElement}
                </Grid.Column>

                <Grid.Column only="tablet computer" tablet={1} computer={2}>
                </Grid.Column>
            </Grid>
        );

    }
}

DeckStatsPage = connectToStores(DeckStatsPage, [DeckPageStore, DeckViewStore, DeckStatsStore], (context, props) => {
    return {
        DeckPageStore: context.getStore(DeckPageStore).getState(),
        DeckViewStore: context.getStore(DeckViewStore).getState(),
        DeckStatsStore: context.getStore(DeckStatsStore).getState(),
    };
});

export default DeckStatsPage;
