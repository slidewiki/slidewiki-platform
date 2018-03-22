import React from 'react';
import slug from 'slug';
import {Microservices} from '../../../configs/microservices';

class SimilarContentItem extends React.Component {
    render() {
        let deck_slug = this.props.data.title? slug(this.props.data.title) : '';
        return (

            <div className="ui card">
                <a className="image" href={'/deck/' + this.props.data.deckId}>
                    <img src={Microservices.file.uri + '/thumbnail/slide/' + this.props.data.firstSlideId} alt={this.props.data.title} size="small"/>

                </a>

                <div className="content">
                  <div className="header">
                    <a href={'/deck/' + this.props.data.deckId}>{this.props.data.title} </a>
                  </div>
                  <div className="description">
                    Creator:<a  href={'/user/' + this.props.data.authorId}> {this.props.data.author}</a>
                    <div className="right floated">
                       <i className="ui thumbs up icon" aria-label="Number of Likes"></i> {this.props.data.liked}
                     </div>

                  </div>
                  <div className="meta">
                    <span className="date">
                    {this.props.data.date}
                    </span>
                  </div>
                </div>

                 <div className="ui menu top attached">
                    <div className="ui fluid basic buttons">
                        <a href={'/deck' +(deck_slug ? '_' + deck_slug: '')+'/'+ this.props.data.deckId} data-tooltip="Open deck" type="button" role="button" className="ui button" aria-label="Open deck">
                            <i className="yellow open folder large icon" aria-hidden="true" ></i>
                        </a>
                        <a href={'/presentation' +(deck_slug ? '_' + deck_slug: '')+'/'+ this.props.data.deckId + '/' + this.props.data.deckId} target="_blank" className="ui button" type="button" role="button" aria-label="Open slideshow in new tab" data-tooltip="Open slideshow in new tab">
                            <i className="grey circle play large icon" aria-hidden="true" ></i>
                        </a>
                    </div>
                 </div>

              </div>

        );
    }
}

export default SimilarContentItem;
