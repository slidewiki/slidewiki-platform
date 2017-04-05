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
        return (
            <div className='card'>
                <NavLink className="ui medium centered spaced image" href={'/deck/' + this.props.cardContent.deckID}>
                    <Thumbnail url={thumbnailURL}
                        slideId={this.props.cardContent.deckID} />
                </NavLink>
                <div className="content">
                    <div className="header"><NavLink href={'/deck/' + this.props.cardContent.deckID} >{this.props.cardContent.title}</NavLink></div>
                    <div className="meta">
                        <span className="date">Last updated {timeSince((new Date(this.props.cardContent.updated)))} ago</span>
                    </div>
                    <div className="description">
                        {this.props.cardContent.description}
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
