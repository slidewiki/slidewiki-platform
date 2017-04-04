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
            selectedItem :-1
        };


    }

    handleOnclick(selectedDeck){

        this.setState({
            selectedItem:selectedDeck.keyIndex
        });
        let payload ={
            selectedDeckId:selectedDeck.selectedDeckId,
            selectedDeckTitle:selectedDeck.selectedDeckTitle
        };
        this.context.executeAction(updateSelectedDeck,payload,null);

    }

    render() {

        let decks_to_show = this.props.decks;
        let deck_list;
        let activeItemStyle = {
            backgroundColor:'#f8ffff',
            color:'#2185d0'
        };
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
                           <Item key={index} onClick={this.handleOnclick.bind(this,{keyIndex:index,selectedDeckTitle:deck.title,selectedDeckId: deck.deckID+'-'+deck.countRevisions})} style ={this.state.selectedItem === index ?activeItemStyle:{}} tabIndex="0">
                                <Item.Image src={Microservices.file.uri + '/slideThumbnail/' +deck.firstSlide+'.jpeg'} size="tiny" />
                                <Item.Content verticalAlign="top" >
                                  <Item.Header style ={this.state.selectedItem === index ?activeItemStyle:{}}>
                                    {/*<h3 className="ui header"><a href={'./' + deck.deckID+'-'+deck.countRevisions}>{deck.title}</a></h3>*/}
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
          <Item.Group divided>
                {deck_list}
          </Item.Group>

        );
    }
}

AttachDeckList.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default AttachDeckList;
