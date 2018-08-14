import PropTypes from 'prop-types';
import React from 'react';
import FocusTrap from 'focus-trap-react';
import {FormattedMessage, defineMessages} from 'react-intl';
import { Label, Icon, TextArea, Image, Grid, Divider } from 'semantic-ui-react';
import { getLanguageName }  from '../../../../common';
import CustomDate from '../../../Deck/util/CustomDate';
import { Microservices } from '../../../../configs/microservices';

const KEY_CODE = {
    LEFT:   37,
    UP:     38,
    RIGHT:  39,
    DOWN:   40,
    TAB: 9,
    ENTER: 13
};

class DecksList extends React.Component {
    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
    }
    getIntlMessages(){
        return defineMessages({
            modalTitle: {
                id: 'DecksList.title',
                defaultMessage: 'Add decks to playlist'
            }, 

        });
    }
    handleOnDeckClick(deck){
        this.props.handleOnDeckClick(deck);
    }
    handleKeyPress(deck, event){
        if(event.key === 'Enter'){
            this.handleOnDeckClick(deck);
        }
    }
    handleKeyDown(pos, numItems, event){

        if(event.keyCode === KEY_CODE.UP || event.keyCode === KEY_CODE.DOWN ){

            // user wants to navigate through the list
            event.preventDefault();
            let nextPos = this.getNextPos(pos, numItems, event.keyCode);  //get next item

             //get the id of the cell
            $('#deckItemList'+nextPos).focus(); //move to the cell
        } else if(event.keyCode === KEY_CODE.TAB){ //exit list and go to button

            // TODO: check if a deck is selected, else disable add button
            $('#addDecksButton').focus();
        }

    }
    getNextPos(pos, numItems, eventKeyCode){
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
    render() {
        let editorUsername = this.props.loggedInDisplayName;
        let selectedIds = this.props.selectedDecks.map( (deck) => deck.deckID);

        let list = this.props.decks.map( (deck, index) => {
            let deckId = deck.deckID; 
            let deckTheme = deck.theme || 'default';
            let date = CustomDate.format(deck.creationDate, 'Do MMMM YYYY');

            let languageCode = deck.language;
            let language = languageCode === undefined ? '' : getLanguageName(languageCode);
            language = (language === '' ? 'English' : language);
                // <Item.Content verticalAlign="middle" >

                //   <Item.Header style ={/*this.state.selectedDeckId === selectedDeck.selectedDeckId ?activeItemStyle:*/{}}>
                //       {deck.title}
                //   </Item.Header>

                //   <Item.Meta>
                //     <span className='meta'>Creator: { editorUsername }</span>
                //     <br/>
                //     <span className='meta'>Date: { date }</span>
                //   </Item.Meta>
                //    <Item.Extra>
                //    <Label  size="small">
                //       <Icon name="comments outline" aria-label="Language"/>
                //       { language }
                //     </Label>
                //     <Label size="small">
                //        <Icon name="fork" aria-label="Number of versions"/>
                //        { deck.countRevisions }
                //      </Label>
                //    </Item.Extra>
                //  </Item.Content>
            let isSelected = selectedIds.includes(deck.deckID);
            let selectedIcon = (isSelected) ? <Icon color="green" name="check circle" aria-label="selected deck"/> : <Icon color="grey" name="circle outline" aria-label="unselected deck"/>;

            return (
                <Grid.Row
                    key={index}
                    id={'deckItemList' + index}
                    onClick={this.handleOnDeckClick.bind(this, deck)}
                    onKeyPress={this.handleKeyPress.bind(this, deck)}
                    onKeyDown={this.handleKeyDown.bind(this, index, this.props.decks.length)}
                    // style ={this.state.selectedDeckId === selectedDeck.selectedDeckId ?activeItemStyle:{}}
                    role="listitem"
                    // aria-selected ={this.state.selectedDeckId === selectedDeck.selectedDeckId}
                    tabIndex="0">

                    <Grid.Column width={4}>
                        <Image src={`${Microservices.file.uri}/thumbnail/slide/${deck.firstSlide}/${deckTheme}`} alt={deck.title} size="small"/>
                    </Grid.Column>

                    <div className="ten wide column content">
                                <h2 className="ui header">{ deck.title }</h2>
                                <div className="meta"><strong>Creator:&nbsp;</strong>{ editorUsername }</div>
                                <div className="meta"><strong>Last Modified:&nbsp;</strong>{ date }</div>
                                <div className="extra"> 
                                    <Label  size="small">
                                      <Icon name="comments outline" aria-label="Language"/>
                                      { language }
                                    </Label>
                                    <Label size="small">
                                       <Icon name="fork" aria-label="Number of versions"/>
                                       { deck.countRevisions }
                                     </Label>
                                </div>
                        </div>

                        
                    <Grid.Column width={2}>
                        { selectedIcon }

                    </Grid.Column>
                </Grid.Row>            
            );
        });
        return (
            <Grid divided='vertically' style={{maxHeight: '600px', minHeight:'320px', overflowY:'auto'}} role="listbox" aria-expanded="true"  aria-describedby="listInstructions">
                <TextArea className="sr-only" id="listInstructions" value="Use up and down arrow keys to navigate through the list and then enter to select a deck. Use tab to go out of the list." tabIndex ='-1'/>
                { list }
            </Grid>

        );
    }
}

DecksList.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired
};

export default DecksList;