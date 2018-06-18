import React from 'react';
import Thumbnail from '../../common/Thumbnail';
import { NavLink } from 'fluxible-router';
import { timeSince } from '../../../common';
import { Microservices } from '../../../configs/microservices';

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
        let viewUrl = ['/deck', this.props.cardContent.deckID, this.props.cardContent.slug].join('/');
        let presentationUrl = ['/presentation', this.props.cardContent.deckID, this.props.cardContent.slug, this.props.cardContent.deckID].join('/');

        let cardTitle = this.props.cardContent.title;
        if (cardTitle.length > 25) cardTitle = cardTitle.slice(0,24) + '…';

        let description = (this.props.cardContent.description && this.props.cardContent.description.length > 100) ? this.props.cardContent.description.slice(0,99) + '...' : this.props.cardContent.description;

        let ariaLabel = `Deck: ${this.props.cardContent.title}. Last updated ${timeSince((new Date(this.props.cardContent.updated)))} ago`;

        let hiddenRibbon = '';
        if (this.props.cardContent.hidden) {
            hiddenRibbon = <span className="ui red right ribbon label" tabIndex={-1}>Unlisted</span>;
            ariaLabel = `Unlisted ${ariaLabel}`;
        };
        let thumbnailAlt= this.props.cardContent.title + ' | ' + this.props.cardContent.deckID;
        return (
            <div className='ui card'>
                {this.props.newTab === true ? (
                    <a className="image" aria-hidden tabIndex='-1' href={viewUrl} target='_blank'>
                        <img src={thumbnailURL} alt={thumbnailAlt} />
                    </a>
                ) : (
                    <NavLink className="image" aria-hidden tabIndex='-1' href={viewUrl}>
                        <img src={thumbnailURL} alt={thumbnailAlt} />
                    </NavLink>
                )}

                <div className="content">
                    <div className="header">
                        {this.props.newTab === true ? (
                            <a href={viewUrl} data-tooltip={this.props.cardContent.title} aria-label={ariaLabel} target='_blank'>{cardTitle}</a>
                        ) : (
                            <NavLink href={viewUrl} data-tooltip={this.props.cardContent.title} aria-label={ariaLabel} >{cardTitle}</NavLink>
                        )}
                    </div>
                    {hiddenRibbon}
                    <div>
                        <span className="right floated">
                            <i className="thumbs up icon" aria-label="Number of likes"></i>{' ' + this.props.cardContent.noOfLikes}
                        </span>
                        <span aria-label="Last updated">{timeSince((new Date(this.props.cardContent.updated)))}</span>
                    </div>
                </div>
                <div className="bottom attached menu ui basic buttons">
                    <NavLink href={viewUrl} data-tooltip="Open deck" type="button" role="button" className="ui icon button" aria-label="Open deck">
                        <i className="yellow open folder large icon" aria-hidden="true" ></i>
                    </NavLink>
                    <a href={presentationUrl} target="_blank" className="ui icon button" type="button" role="button" aria-label="Open slideshow in new tab" data-tooltip="Open slideshow in new tab">
                        <i className="grey circle play large icon" aria-hidden="true" ></i>
                    </a>
                </div>
            </div>
        );
    }
}

DeckCard.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DeckCard;
