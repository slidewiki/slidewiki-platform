import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import CustomDate from '../../util/CustomDate';
import { Segment,Item,Icon,Label,Image} from 'semantic-ui-react';
import ISO6391 from 'iso-639-1';
import {Microservices} from '../../../../configs/microservices';
import updateSelectedDeck  from '../../../../actions/attachSubdeck/updateSelectedDeck';



class AttachDeckList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedDeckId: this.props.selectedDeckId,

        };
    }

    handleOnclick(selectedDeck){

        this.setState({
            selectedItem:selectedDeck.keyIndex,
            selectedDeckId:selectedDeck.selectedDeckId
        });
        let payload ={
            selectedDeckId:selectedDeck.selectedDeckId,
            selectedDeckTitle:selectedDeck.selectedDeckTitle
        };
        this.context.executeAction(updateSelectedDeck,payload,null);

    }
    handleKeyPress(event,selectedDeck){

        if(event.key === 'Enter'){
            event.preventDefault();
            this.handleOnclick(selectedDeck);
        }
    }

    render() {

        let decks_to_show = this.props.decks;
        let deck_list;
        let activeItemStyle = {
            backgroundColor:'#f8ffff',
            color:'#2185d0'

        };
       //Order decks by updated data
        decks_to_show = decks_to_show.sort((a,b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());


        if (decks_to_show.length){
            deck_list =
                decks_to_show.map((deck, index) => {
                    //From deck users, data is in props.user. From slideWiki, data is in the deck
                    let deckCreatorid = deck.deckCreatorid === undefined ? this.props.user.userId : deck.deckCreatorid;
                    let deckCreator = deck.deckCreator === undefined ? this.props.user.username:deck.deckCreator;

                    let deckDate = CustomDate.format(deck.creationDate, 'Do MMMM YYYY');
                    let deckLanguageCode = deck.language === undefined ? 'en' : deck.language;
                    let deckLanguage = deckLanguageCode === undefined ? '' : ISO6391.getName(deckLanguageCode);
                    // default English
                    deckLanguage = (deckLanguage === '' ? 'English' : deckLanguage);
                    //let countryFlag = deckLanguageCode === 'en' ? 'gb' : deckLanguageCode;
                    let deckTheme = deck.theme === undefined ? 'Simple' : deck.theme;
                    let selectedDeck = {

                        selectedDeckTitle:deck.title,
                        selectedDeckId: deck.deckID+'-'+deck.countRevisions
                    };
                    return (
                           <Item key={index}
                                  onClick={this.handleOnclick.bind(this,selectedDeck)}
                                  onKeyPress={(e) => { this.handleKeyPress(e,selectedDeck);}}
                                  style ={this.state.selectedDeckId === selectedDeck.selectedDeckId ?activeItemStyle:{}}
                                  role="listitem"
                                  tabIndex="0">
                                <Item.Image src={Microservices.file.uri + '/slideThumbnail/' +deck.firstSlide+'.jpeg'} size="small"/>
                                <Item.Content verticalAlign="middle" >
                                  <Item.Header style ={this.state.selectedDeckId === selectedDeck.selectedDeckId ?activeItemStyle:{}}>
                                      {deck.title}
                                  </Item.Header>

                                  <Item.Meta>
                                    <span className='meta'>Creator: {deckCreator}</span>
                                    <br/>
                                    <span className='meta'>Date: {deckDate}</span>
                                  </Item.Meta>


                                 <Item.Extra>
                                   <Label  size="small">
                                      <Icon name="comments outline" aria-label="Language"/>
                                      {deckLanguage}
                                    </Label>
                                    <Label size="small">
                                       <Icon name="fork" aria-label="Number of versions"/>
                                       {deck.countRevisions}
                                     </Label>

                                 </Item.Extra>
                                </Item.Content>
                            </Item>

                    );
                });
        }

        return (
          <Item.Group divided relaxed style={{maxHeight:this.props.maxHeight,minHeight:'320px',overflowY:'auto'}}
             role="listbox" aria-expanded="true">

                {deck_list}
          </Item.Group>
        );
    }
}

AttachDeckList.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default AttachDeckList;
