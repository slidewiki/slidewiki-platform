import React from 'react';
import { Menu} from 'semantic-ui-react';
import updateActiveItem  from '../../../../actions/attachSubdeck/updateActiveItem';

class AttachMenu extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            activeItem: props.activeItem,
        };
        this.handleMyDecksClick = this.handleMyDecksClick.bind(this);
        this.handleSlideWikiClick = this.handleSlideWikiClick.bind(this);

    }
    handleMyDecksClick(){
        this.setState({
            activeItem:'MyDecks'
        });
        let payload ={
            activeItem:'MyDecks'
        };

        this.context.executeAction(updateActiveItem,payload,null);

    }

    handleSlideWikiClick(){
        this.setState({
            activeItem:'SlideWiki'
        });
        let payload ={
            activeItem:'SlideWiki'
        };
        console.log('handleSlideWikiClick'+payload);
        this.context.executeAction(updateActiveItem,payload,null);

    }

    render(){
        return(
          <Menu attached='top' tabular role="tablist">
               <Menu.Item as="button" name="From My Decks" id="tabMyDecksId" active={this.state.activeItem === 'MyDecks'} aria-selected={this.state.activeItem === 'MyDecks'} onClick={this.handleMyDecksClick}
                            role="tab" tabIndex="0" />
               <Menu.Item as="button" name="From SlideWiki" id="tabFromSlideWikiId" active={this.state.activeItem === 'SlideWiki'} aria-selected={this.state.activeItem === 'SlideWiki'}
                            onClick={this.handleSlideWikiClick} role="tab" tabIndex="0" />
         </Menu>
        );
    }
}
AttachMenu.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};


export default AttachMenu;
