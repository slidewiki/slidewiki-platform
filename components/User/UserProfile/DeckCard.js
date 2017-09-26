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

        let thumbnailURL = Microservices.file.uri + '/slideThumbnail/';
        if (this.props.cardContent.firstSlide)
            thumbnailURL += this.props.cardContent.firstSlide + '.jpeg';
        else
            thumbnailURL = this.props.cardContent.picture;

        let description = (this.props.cardContent.description.length > 100) ? this.props.cardContent.description.slice(0,99) + '...' : this.props.cardContent.description;
        return (
            <div className='card'>
              {this.props.newTab === true ? (
                <a className="ui medium centered spaced image" href={'/deck/' + this.props.cardContent.deckID} target='_blank'>
                  <Thumbnail url={thumbnailURL}
                      slideId={this.props.cardContent.deckID} />
                </a>
              ) : (
                <NavLink className="ui medium centered spaced image" href={'/deck/' + this.props.cardContent.deckID}>
                  <Thumbnail url={thumbnailURL}
                      slideId={this.props.cardContent.deckID} />
                </NavLink>
              )}

                <div className="content">
                  <div className="header">
                    {this.props.newTab === true ? (
                      this.props.cardContent.title.length > 50 ? (
                        <a href={'/deck/' + this.props.cardContent.deckID} target='_blank' data-tooltip={this.props.cardContent.title}>{this.props.cardContent.title.slice(0,49) + '...'}</a>
                      ) : (
                        <a href={'/deck/' + this.props.cardContent.deckID} target='_blank'>{this.props.cardContent.title}</a>
                      )
                    ) : (
                      this.props.cardContent.title.length > 50 ? (
                        <NavLink href={'/deck/' + this.props.cardContent.deckID} data-tooltip={this.props.cardContent.title}>{this.props.cardContent.title.slice(0,49) + '...'}</NavLink>
                      ) : (
                        <NavLink href={'/deck/' + this.props.cardContent.deckID}>{this.props.cardContent.title}</NavLink>
                      )
                    )}
                  </div>

                  <div className="meta">
                      <span className="date">Last updated {timeSince((new Date(this.props.cardContent.updated)))} ago</span>
                  </div>
                  <div className="description">
                      {description}
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
