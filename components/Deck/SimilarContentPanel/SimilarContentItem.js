import React from 'react';
import slug from 'slug';
import {Microservices} from '../../../configs/microservices';
import {defineMessages} from 'react-intl';

class SimilarContentItem extends React.Component {
    constructor(props){
        super(props);
        this.messages = defineMessages({
            creator:{
                id: 'similarContentItem.creator',
                defaultMessage:'Creator'
            },
            likes:{
                id: 'similarContentItem.likes',
                defaultMessage:'Number of likes'
            },
            open_deck:{
                id: 'similarContentItem.open_deck',
                defaultMessage:'Open deck'

            },
            open_slideshow:{
                id:'similarContentItem.open_slideshow',
                defaultMessage:'Open slideshow in new tab'
            }

        });


    }
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
                    {this.context.intl.formatMessage(this.messages.creator)}:<a  href={'/user/' + this.props.data.authorId}> {this.props.data.author}</a>
                    <div className="right floated">
                       <i className="ui thumbs up icon" aria-label={this.context.intl.formatMessage(this.messages.likes)}></i> {this.props.data.liked}
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
                        <a href={'/deck' +(deck_slug ? '_' + deck_slug: '')+'/'+ this.props.data.deckId}
                          data-tooltip={this.context.intl.formatMessage(this.messages.open_deck)}
                          type="button" role="button" className="ui button"
                          aria-label={this.context.intl.formatMessage(this.messages.open_deck)}>
                            <i className="yellow open folder large icon" aria-hidden="true" ></i>
                        </a>
                        <a href={'/presentation' +(deck_slug ? '_' + deck_slug: '')+'/'+ this.props.data.deckId + '/' + this.props.data.deckId}
                            target="_blank" className="ui button" type="button"
                            role="button" aria-label={this.context.intl.formatMessage(this.messages.open_slideshow)}
                            data-tooltip={this.context.intl.formatMessage(this.messages.open_slideshow)}>
                            <i className="grey circle play large icon" aria-hidden="true" ></i>
                        </a>
                    </div>
                 </div>

              </div>

        );
    }
}
SimilarContentItem.contextTypes = {
    intl: React.PropTypes.object.isRequired
};
export default SimilarContentItem;
