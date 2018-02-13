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

        let description = (this.props.cardContent.description && this.props.cardContent.description.length > 100) ? this.props.cardContent.description.slice(0,99) + '...' : this.props.cardContent.description;
        return (
            <div className='card'>
                {this.props.newTab === true ? (
                    <a className="ui medium centered spaced image" aria-hidden={'true'} tabIndex={'-1'} href={'/deck/' + this.props.cardContent.deckID} target='_blank'>
                        <Thumbnail url={thumbnailURL} alt={''}
                            slideId={this.props.cardContent.deckID} />
                    </a>
                ) : (
                    <NavLink className="ui medium centered spaced image" aria-hidden={'true'}  tabIndex={'-1'} href={'/deck/' + this.props.cardContent.deckID}>
                        <Thumbnail url={thumbnailURL} alt={''}
                            slideId={this.props.cardContent.deckID} />
                    </NavLink>
                )}

                <div className="content">
                    <h3 className="header">
                        {this.props.newTab === true ? (
                            this.props.cardContent.title.length > 25 ? (
                                <a href={'/deck/' + this.props.cardContent.deckID} target='_blank' data-tooltip={this.props.cardContent.title}>{this.props.cardContent.title.slice(0,24) + '...'}</a>
                            ) : (
                                <a href={'/deck/' + this.props.cardContent.deckID} target='_blank'>{this.props.cardContent.title}</a>
                            )
                        ) : (
                            this.props.cardContent.title.length > 25 ? (
                                <NavLink href={'/deck/' + this.props.cardContent.deckID} data-tooltip={this.props.cardContent.title}>{this.props.cardContent.title.slice(0,24) + '...'}</NavLink>
                            ) : (
                                <NavLink href={'/deck/' + this.props.cardContent.deckID}>{this.props.cardContent.title}</NavLink>
                            )
                        )}
                    </h3>
                    <div className="meta">
                        <span className="right floated meta">
                            <i className="thumbs up icon" aria-label="Number of likes"></i>6
                        </span>
                        <i className="edit icon" aria-label="Last updated">{timeSince((new Date(this.props.cardContent.updated)))}</i>
                        
                    </div>
                    <div className="ui menu">
                        <div className="ui fluid basic buttons">
                            <NavLink href={'/deck/' + this.props.cardContent.deckID} target='_blank' data-tooltip="open deck" type="button" role="button" className="ui button" aria-label="Open deck">
                                <i className="yellow open folder large icon"></i>
                            </NavLink>
                            <NavLink href={'/presentation/' + this.props.cardContent.deckID + '/' + this.props.cardContent.deckID} target="_blank" className="ui button" type="button" type="button" role="button" aria-label="Open slideshow in new tab" data-tooltip="Open slideshow in new tab">
                                <i className="grey circle play large icon"></i>
                            </NavLink>

                        </div>
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
