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
        let header = '';
        if (this.props.cardContent.title.length > 50)
            header = <div className="header"><NavLink href={'/deck/' + this.props.cardContent.deckID} data-tooltip={this.props.cardContent.title}>{this.props.cardContent.title.slice(0,49) + '...'}</NavLink></div>;
        else
            header = <div className="header"><NavLink href={'/deck/' + this.props.cardContent.deckID}>{this.props.cardContent.title}</NavLink></div>;
        return (
            <div className='card'>
                <NavLink className="ui medium centered spaced image" href={'/deck/' + this.props.cardContent.deckID}>
                    <Thumbnail url={thumbnailURL}
                        slideId={this.props.cardContent.deckID} />
                </NavLink>
                <div className="content">
                    {header}
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
