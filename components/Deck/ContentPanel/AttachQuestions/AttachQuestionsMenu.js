import PropTypes from 'prop-types';
import React from 'react';
import { Menu} from 'semantic-ui-react';
import updateActiveItem  from '../../../../actions/attachQuestions/updateActiveItem';
import loadQuestions from '../../../../actions/attachQuestions/loadQuestions';
import updateSelectedQuestions from '../../../../actions/attachQuestions/updateSelectedQuestions';
import updateSelectedDeck from '../../../../actions/attachQuestions/updateSelectedDeck';



class AttachMenu extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            activeItem: props.activeItem,
        };
        this.handleMyDecksClick = this.handleMyDecksClick.bind(this);
        this.handleSlideWikiClick = this.handleSlideWikiClick.bind(this);
        this.handleCurrentDeckClick = this.handleCurrentDeckClick.bind(this);

    }

    handleCurrentDeckClick(){
        this.context.executeAction(loadQuestions, {params:this.props.selector});
        this.setState({
            activeItem:'CurrentDeck',
            showQuestions: true 
        });
        let payload ={
            activeItem:'CurrentDeck',
            showQuestions: true 
        };
        this.context.executeAction(updateActiveItem,payload,null);
        this.context.executeAction(updateSelectedQuestions,{selectedQuestions:[]});
        let payload2  = {
            selectedDeckId: -1,
            selectedDeckTitle: 'Click the deck you wish to select'
        };
        this.context.executeAction(updateSelectedDeck,payload2);
        
    }

    handleMyDecksClick(){
        this.setState({
            activeItem:'MyDecks',
            showQuestions: false
        });
        let payload ={
            activeItem:'MyDecks',
            showQuestions: false
        };

        this.context.executeAction(updateActiveItem,payload,null);
        this.context.executeAction(updateSelectedQuestions,{selectedQuestions:[]});

        let payload2  = {
            selectedDeckId: -1,
            selectedDeckTitle: 'Click the deck you wish to select'
        };
        this.context.executeAction(updateSelectedDeck,payload2);
    }

    handleSlideWikiClick(){
        this.setState({
            activeItem:'SlideWiki',
            showQuestions: false
        });
        let payload ={
            activeItem:'SlideWiki',
            showQuestions: false
        };
  
        this.context.executeAction(updateActiveItem,payload,null);
        this.context.executeAction(updateSelectedQuestions,{selectedQuestions:[]});

        let payload2  = {
            selectedDeckId: -1,
            selectedDeckTitle: 'Click the deck you wish to select'
        };
        this.context.executeAction(updateSelectedDeck,payload2);
    }

    render(){
        return(
          <Menu attached='top' tabular role="tablist">
                <Menu.Item as="button" name="From Current Deck" id="tabCurrentDeckId" active={this.state.activeItem === 'CurrentDeck'} aria-selected={this.state.activeItem === 'CurrentDeck'} onClick={this.handleCurrentDeckClick.bind(this.props.selector)}
                            role="tab" tabIndex="0" />
               <Menu.Item as="button" name="From My Decks" id="tabMyDecksId" active={this.state.activeItem === 'MyDecks'} aria-selected={this.state.activeItem === 'MyDecks'} onClick={this.handleMyDecksClick}
                            role="tab" tabIndex="0" />
               <Menu.Item as="button" name="From SlideWiki" id="tabFromSlideWikiId" active={this.state.activeItem === 'SlideWiki'} aria-selected={this.state.activeItem === 'SlideWiki'}
                            onClick={this.handleSlideWikiClick} role="tab" tabIndex="0" />
         </Menu>
        );
    }
}
AttachMenu.contextTypes = {
    executeAction: PropTypes.func.isRequired
};


export default AttachMenu;
