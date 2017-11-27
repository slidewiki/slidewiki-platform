import React from 'react';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import CustomDate from '../../util/CustomDate';
import { Segment,Item,Icon,Label,Image, TextArea} from 'semantic-ui-react';
import ISO6391 from 'iso-639-1';
import {Microservices} from '../../../../configs/microservices';
import updateSelectedDeck  from '../../../../actions/attachSubdeck/updateSelectedDeck';


const KEY_CODE = {
    LEFT:   37,
    UP:     38,
    RIGHT:  39,
    DOWN:   40,
    TAB: 9,
    ENTER: 13
};

class AttachDeckList extends React.Component {
    constructor(props){
        /* Receives:
          user: user info
          decks: array with the decks to showSlides
          selectedDeckId: initial selected deck...if it was previosly selected, -1 in other case
          destinationDeckId: deck in which data will be appended.
          actionButtonId: buttonId which receives the focus. It was not possible to use ref to do that.


        */
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

//        $(this.props.actionButtonId).focus();


    }
    handleKeyPress(selectedDeck,event){

        if(event.key === 'Enter'){
            this.handleOnclick(selectedDeck);
        }
    }

    getNextPos(pos,numItems,eventKeyCode){
        /*******************************************
            Returns next position in a liat, taking into account
            the arrow key pressed and the number of items of the list
        ********************************************/
        let nextPos = parseInt(pos); //In case of overflow, we stayed in the same position. Force working with integers
                                    //right and left arrows: same position
        switch (eventKeyCode) {
            case KEY_CODE.UP:
                if(nextPos !== 0)
                    nextPos -- ;
                break;
            case KEY_CODE.DOWN:
                if(nextPos !== (numItems-1))
                    nextPos ++ ;
                break;
        }
        return nextPos;

    }
    handleKeyDown(pos,numItems,event){

        if(event.keyCode === KEY_CODE.UP ||
           event.keyCode === KEY_CODE.DOWN ){
           //the user wants to navigate through the list
            event.preventDefault();
            let nextPos = this.getNextPos(pos,numItems,event.keyCode);  //get next item
             //get the id of the cell
            $('#deckItemList'+nextPos).focus(); //move to the cell
        } else if(event.keyCode === KEY_CODE.TAB){ //exit list and go to button
            event.preventDefault();
            if(this.state.selectedDeckId !==-1 ){
                $(this.props.actionButtonId).focus();
            } else { // deck is not selected
                $('#cancelAttachModal').focus();
            }
        }

    }

    render() {

        let decks_ordered = this.props.decks;
        let decks_to_show;
        let deck_list;
        let activeItemStyle = {
            backgroundColor:'#f8ffff',
            color:'#2185d0'

        };
       //Order decks by updated data
        decks_ordered = decks_ordered.sort((a,b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
        //filter the list, removing the same deck or revisions of theme
        decks_to_show = [];
        let destDeckId = this.props.destinationDeckId.toString().split('-');
        for(let i=0;i<decks_ordered.length;i++ ){
            if(parseInt(destDeckId[0]) !== decks_ordered[i].deckID){
                decks_to_show.push(decks_ordered[i]);
            }
        }

        if (decks_to_show.length){
            deck_list = decks_to_show.map((deck, index) => {
                    //From deck users, data is in props.user. From slideWiki, data is in the deck
                let deckCreatorid = deck.deckCreatorid === undefined ? this.props.user.userId : deck.deckCreatorid;
                let deckCreator = deck.deckCreator === undefined ? this.props.user.username:deck.deckCreator;
                let deckDate = CustomDate.format(deck.creationDate, 'Do MMMM YYYY');
                let deckLanguageCode = deck.language === undefined ? 'en' : deck.language;
                let deckLanguage = deckLanguageCode === undefined ? '' : ISO6391.getName(deckLanguageCode);
                // default English
                deckLanguage = (deckLanguage === '' ? 'English' : deckLanguage);
                //let countryFlag = deckLanguageCode === 'en' ? 'gb' : deckLanguageCode;
                let deckTheme = deck.theme || 'default';
                let selectedDeck = {
                    selectedDeckTitle:deck.title,
                    selectedDeckId: deck.deckID+'-'+deck.countRevisions
                };
                return (
                       <Item key={index}
                              id={'deckItemList'+index}
                              onClick={this.handleOnclick.bind(this,selectedDeck)}
                              onKeyPress={this.handleKeyPress.bind(this,selectedDeck)}
                              onKeyDown={this.handleKeyDown.bind(this,index,decks_to_show.length)}
                              style ={this.state.selectedDeckId === selectedDeck.selectedDeckId ?activeItemStyle:{}}
                              role="listitem"
                              aria-selected ={this.state.selectedDeckId === selectedDeck.selectedDeckId}
                              tabIndex="0">
                            <Item.Image src={Microservices.file.uri + '/thumbnail/slide/' +deck.firstSlide+'/'+deckTheme} alt={deck.title} size="small"/>
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
              //    }
            });
        }

        return (
          <Item.Group divided relaxed style={{maxHeight:this.props.maxHeight,minHeight:'320px',overflowY:'auto'}}
             role="listbox" aria-expanded="true"  aria-describedby="listInstructions">
             <TextArea className="sr-only" id="listInstructions" value="Use up and down arrow keys to navigate through the list and then enter to select a deck. Use tab to go out the list." tabIndex ='-1'/>

                {deck_list}
          </Item.Group>
        );
    }
}

AttachDeckList.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default AttachDeckList;
