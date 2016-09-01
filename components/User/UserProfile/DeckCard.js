import React from 'react';
import { NavLink } from 'fluxible-router';

class DeckCard extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return (
            <div className="card">
                <NavLink className="ui medium centered image" href={'/deck/' + this.props.cardContent.deckID}>
                    <img src={ this.props.cardContent.picture }/>
                </NavLink>
                <div className="content">
                    <div className="header">{this.props.cardContent.title}}</div>
                    <div className="meta">
                        <span className="date">Last updated {this.props.cardContent.updated} ago</span>
                    </div>
                    <div className="description">
                        {this.props.cardContent.description}
                    </div>
                </div>
                <div className="extra content">
                    <NavLink href="/"><i className="thumbs up icon"/>53</NavLink>
                    <NavLink href="/" className="right floated"><i className="fork icon"/>53</NavLink><br/>
                    <NavLink href="/"><i className="comment icon"/>53</NavLink>
                    <NavLink href="/" className="right floated"><i className="download icon"/>53</NavLink>
                </div>
            </div>
        );
    }
}

DeckCard.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DeckCard;
