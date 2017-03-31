import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import CustomDate from '../../util/CustomDate';
import { Segment,Grid,Icon,Label} from 'semantic-ui-react';
import ISO6391 from 'iso-639-1';


class AttachDeckList extends React.Component {

    render() {

        let decks_to_show = this.props.decks;
        let deck_list;
        if (decks_to_show.length){
            deck_list =
                decks_to_show.map((deck, index) => {
                    let deckCreatorid = this.props.user.userId;
                    let deckCreator = this.props.user.username;

                    let deckDate = CustomDate.format(deck.creationDate, 'Do MMMM YYYY');
                    let deckLanguageCode = deck.language === undefined ? 'en' : deck.language;
                    let deckLanguage = deckLanguageCode === undefined ? '' : ISO6391.getName(deckLanguageCode);
                    // default English
                    deckLanguage = (deckLanguage === '' ? 'English' : deckLanguage);
                    //let countryFlag = deckLanguageCode === 'en' ? 'gb' : deckLanguageCode;
                    let deckTheme = deck.theme === undefined ? 'Simple' : deck.theme;

                    return (
                           <Grid.Row key={index}>
                                <Grid.Column>
                                    <h3 className="ui header"><a href={'./' + deck.deckID+'-'+deck.countRevisions}>{deck.title}</a></h3>
                                </Grid.Column>
                                <Grid.Column>
                                  <div>
                                    <div className="meta">Creator: <a href={'/user/' + deckCreatorid} >{deckCreator}</a></div>
                                    <div className="meta">Date: {deckDate}</div>
                                  </div>
                                </Grid.Column>
                                <Grid.Column>
                                  <div>
                                   <Label  size="small">
                                      <Icon name="comments outline"/>
                                      {deckLanguage}
                                    </Label>
                                    <Label size="small">
                                       <Icon name="fork"/>
                                       {deck.countRevisions}
                                     </Label>
                                  </div>
                                </Grid.Column>
                            </Grid.Row>

                    );
                });
        }

        return (
          <Grid columns={3} stackable stretched verticalAlign='top' divided>
                {deck_list}

          </Grid>

        );
    }
}

export default AttachDeckList;
