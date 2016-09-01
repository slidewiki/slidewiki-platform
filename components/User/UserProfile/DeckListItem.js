import React from 'react';
import { NavLink } from 'fluxible-router';
import loadActivities from '../../../actions/activityfeed/loadActivities';

class DeckListItem extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return (
            <div className="item">
                <div className="right floated content">
                    <NavLink href="/"><i className="thumbs up icon"/>53 Likes</NavLink><br/>
                    <NavLink href="/"><i className="fork icon"/>53 Forks</NavLink><br/>
                    <NavLink href="/"><i className="comment icon"/>53 Comments</NavLink><br/>
                    <NavLink href="/"><i className="download icon"/>53 Downloads</NavLink><br/>
                </div>
                <NavLink className="ui tiny middle aligned centered image" href={'/deck/' + this.props.content.deckID}>
                    <img src={ this.props.content.picture }/>
                </NavLink>
                <div className="content">
                    <NavLink className="header" href={'/deck/' + this.props.content.deckID}>{ this.props.content.title }</NavLink>
                    <div className="meta">
                        Updated { this.props.content.updated } mins ago
                    </div>
                    <br/>
                    <div className="description">
                        {this.props.content.description}
                    </div>
                </div>
            </div>
        );
    }
}

DeckListItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DeckListItem;
