import React from 'react';
import Thumbnail from '../../common/Thumbnail';
import { NavLink } from 'fluxible-router';
import { timeSince } from '../../../common';
import { Microservices } from '../../../configs/microservices';
import slug from 'slug';

class DeckCard extends React.Component {


    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        // console.log('DeckCard: cardContent', this.props);

        let thumbnailURL = `${Microservices.file.uri}/thumbnail/slide/`;
        if (this.props.cardContent.firstSlide) {
            thumbnailURL += this.props.cardContent.firstSlide;
            if (this.props.cardContent.theme) {
                thumbnailURL += '/' + this.props.cardContent.theme;
            }
        } else {
            thumbnailURL = this.props.cardContent.picture;
        }
        let deck_slug = this.props.cardContent.title? slug(this.props.cardContent.title) : '';
        let description = (this.props.cardContent.description && this.props.cardContent.description.length > 100) ? this.props.cardContent.description.slice(0,99) + '...' : this.props.cardContent.description;

        let thumbnailAlt= this.props.cardContent.title + ' | ' + this.props.cardContent.deckID;
        return (
            <div className='card'>
                {this.props.newTab === true ? (
                    <a className="ui medium centered spaced image" aria-hidden={'true'} tabIndex={'-1'} href={'/deck/' + this.props.cardContent.deckID} target='_blank'>
                        <Thumbnail url={thumbnailURL}
                           alt={ thumbnailAlt } />
                    </a>
                ) : (
                    <NavLink className="ui medium centered spaced image" aria-hidden={'true'}  tabIndex={'-1'} href={'/deck/' + this.props.cardContent.deckID}>
                        <Thumbnail url={thumbnailURL}
                           alt={ thumbnailAlt } />
                    </NavLink>
                )}

                <div className="content">
                    <div className="header">
                        {this.props.newTab === true ? (
                            this.props.cardContent.title.length > 25 ? (
                                <a href={'/deck' +(deck_slug ? '_' + deck_slug: '')+'/'+ this.props.cardContent.deckID} data-tooltip={this.props.cardContent.title} aria-label={'Deck: ' + this.props.cardContent.title + '. Last updated ' + timeSince((new Date(this.props.cardContent.updated))) + 'ago'} target='_blank'>{this.props.cardContent.title.slice(0,24) + '...'}</a>
                            ) : (
                                <a href={'/deck' +(deck_slug ? '_' + deck_slug: '')+'/'+ this.props.cardContent.deckID} data-tooltip={this.props.cardContent.title} aria-label={'Deck: ' + this.props.cardContent.title + '. Last updated ' + timeSince((new Date(this.props.cardContent.updated))) + 'ago'} target='_blank' >{this.props.cardContent.title}</a>
                            )
                        ) : (
                            this.props.cardContent.title.length > 25 ? (
                                <a href={'/deck' +(deck_slug ? '_' + deck_slug: '')+'/'+ this.props.cardContent.deckID} data-tooltip={this.props.cardContent.title} aria-label={'Deck: ' + this.props.cardContent.title + '. Last updated ' + timeSince((new Date(this.props.cardContent.updated))) + 'ago'}  >{this.props.cardContent.title.slice(0,24) + '...'}</a>
                            ) : (
                                <a href={'/deck' +(deck_slug ? '_' + deck_slug: '')+'/'+ this.props.cardContent.deckID} data-tooltip={this.props.cardContent.title} aria-label={'Deck: ' + this.props.cardContent.title + '. Last updated ' + timeSince((new Date(this.props.cardContent.updated))) + 'ago'} >{this.props.cardContent.title}</a>
                            )
                        )}
                    </div>
                    <div className="extra content">
                        <span className="right floated">
                            <i className="thumbs up icon" aria-label="Number of likes"></i>{' ' + this.props.cardContent.noOfLikes}
                        </span>
                        <span aria-label="Last updated">{timeSince((new Date(this.props.cardContent.updated)))}</span>
                    </div>
                </div>
                <div className="ui menu top attached">
                    <div className="ui fluid basic buttons">
                        <a href={'/deck' +(deck_slug ? '_' + deck_slug: '')+'/'+ this.props.cardContent.deckID} data-tooltip="Open deck" type="button" role="button" className="ui button" aria-label="Open deck">
                            <i className="yellow open folder large icon" aria-hidden="true" ></i>
                        </a>
                        <a href={'/presentation' +(deck_slug ? '_' + deck_slug: '')+'/'+ this.props.cardContent.deckID + '/' + this.props.cardContent.deckID} target="_blank" className="ui button" type="button" role="button" aria-label="Open slideshow in new tab" data-tooltip="Open slideshow in new tab">
                            <i className="grey circle play large icon" aria-hidden="true" ></i>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

DeckCard.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DeckCard;
