import PropTypes from 'prop-types';
import React from 'react';
import FocusTrap from 'focus-trap-react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Label, Icon, TextArea, Image, Grid, Button, Loader, Dimmer } from 'semantic-ui-react';
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
        this.activeStyle = {
            backgroundColor: '#f8ffff',
            color: '#2185d0'
        };
    }
    getIntlMessages(){
        return defineMessages({
            loadingText: {
                id: 'DecksList.loading',
                defaultMessage: 'Loading'                
            },
            errorMsg: {
                id: 'DecksList.error',
                defaultMessage: 'An unexpected error occurred while fetching more decks'                  
            }
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
    getLoadMoreDiv(meta, listLength){
        let itemsCount = listLength;

        let loadMoreDiv = '';
        if (meta && meta.links && meta.links.next) {
            let loadMoreContent = <Button as='button' aria-label='Load more decks' onClick={this.loadMore.bind(this, meta.links.next)}>Load More</Button>;
            if(this.props.loadMoreLoading){
                loadMoreContent = <Dimmer active inverted>
                    <Loader inverted>{this.context.intl.formatMessage(this.messages.loadingText)}</Loader>
                </Dimmer>;
            }
            if(this.props.loadMoreError){
                loadMoreContent = this.context.intl.formatMessage(this.messages.errorMsg);
            }
            loadMoreDiv = <Grid.Row className="center aligned" key="loadMoreDiv" id={`deckItemList${itemsCount}`} tabIndex="0">
                <Grid.Column width={16}>
                    { loadMoreContent }
                </Grid.Column>
            </Grid.Row>;

            // add an extra list item to show load more button
            // this is needed to properly select load more with arrows up/down
            itemsCount++;
        }
        return { loadMoreDiv, itemsCount };
    }
    loadMore(nextLink){
        this.props.loadMore(nextLink);
    }
    render() {
        if (this.props.loading) {
            return (
                <div>
                    <Dimmer active inverted>
                        <Loader inverted>Loading</Loader>
                    </Dimmer>
                    <Image src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                </div>
            );
        }

        let editorUsername = this.props.loggedInDisplayName;
        let selectedIds = this.props.selectedDecks.map( (deck) => deck.deckID);

        let { loadMoreDiv, itemsCount } = this.getLoadMoreDiv(this.props.meta, this.props.decks.length);

        let list = this.props.decks.map( (deck, index) => {
            let deckId = deck.deckID; 
            let deckTheme = deck.theme || 'default';
            let date = CustomDate.format(deck.creationDate, 'Do MMMM YYYY');

            let languageCode = deck.language;
            let language = languageCode === undefined ? '' : getLanguageName(languageCode);
            language = (language === '' ? 'English' : language);

            let isSelected = selectedIds.includes(deck.deckID);
            let itemStyle = (isSelected) ? this.activeStyle : {};
            return (
                <Grid.Row
                    key={index}
                    id={'deckItemList' + index}
                    onClick={this.handleOnDeckClick.bind(this, deck)}
                    onKeyPress={this.handleKeyPress.bind(this, deck)}
                    onKeyDown={this.handleKeyDown.bind(this, index, itemsCount)}
                    style ={ itemStyle }
                    role="listitem"
                    className="item"
                    aria-selected = { isSelected }
                    tabIndex="0">

                    <Grid.Column width={4}>
                        <Image src={`${Microservices.file.uri}/thumbnail/slide/${deck.firstSlide}/${deckTheme}`} alt={deck.title} size="small"/>
                    </Grid.Column>

                    <Grid.Column width={10}>
                        <div className="ui header" style={ itemStyle }>{ deck.title }</div>
                        <div className="meta"><strong>Creator:&nbsp;</strong>{ deck.username || editorUsername }</div>
                        <div className="meta"><strong>Creation Date:&nbsp;</strong>{ date }</div>
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
                    </Grid.Column>

                    <Grid.Column width={2}>
                        { (isSelected) && 
                            <Button circular as='button' size="mini" color='green' icon='check' aria-label="selected deck" />
                        }
                        { (!isSelected) && 
                            <Button circular as='button' size="mini" icon='plus' aria-label="unselected deck" />
                        }
                    </Grid.Column>
                </Grid.Row>            
            );
        });
        return (
            <Grid divided="vertically" verticalAlign="middle" className="items" style={{maxHeight: '600px', minHeight:'320px', overflowY:'auto'}} role="listbox" aria-expanded="true" aria-describedby="listInstructions">
                <TextArea className="sr-only" id="listInstructions" value="Use up and down arrow keys to navigate through the list and then enter to select a deck. Use tab to go out of the list." tabIndex ='-1'/>
                { list }
                { loadMoreDiv }
            </Grid>
        );
    }
}

DecksList.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired
};

export default DecksList;