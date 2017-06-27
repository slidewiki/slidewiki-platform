import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore';
import AttachDeckList from './AttachDeckList';
import {  Segment, Loader,Label, Image,Dimmer, Header} from 'semantic-ui-react';

class AttachSlideWiki extends React.Component{
    constructor(props){
        super(props);
        this.state = {

            recentDecks:this.props.AttachSubdeckModalStore.recentDecks,
            searchDecks:this.props.AttachSubdeckModalStore.searchDecks,
            selectedDeckTitle:   this.props.AttachSubdeckModalStore.selectedDeckTitle,
            selectedDeckId: this.props.AttachSubdeckModalStore.selectedDeckId

        };

    }
    componentWillReceiveProps(nextProps){

        this.setState({

            recentDecks: nextProps.AttachSubdeckModalStore.recentDecks,
            selectedDeckId: nextProps.AttachSubdeckModalStore.selectedDeckId,
            selectedDeckTitle:nextProps.AttachSubdeckModalStore.selectedDeckTitle,
            searchDecks: nextProps.AttachSubdeckModalStore.searchDecks,
            showSearchResults: nextProps.AttachSubdeckModalStore.showSearchResults,

        });

    }

    render(){

        let slideWikiContent;

        let userInfo ={
            userId: this.props.UserProfileStore.userid,
            username: this.props.UserProfileStore.username

        };
        if(this.state.recentDecks.length === 0){
            slideWikiContent = <Segment id="panelMyDecksContent">
                              <Dimmer active inverted>
                                  <Loader inverted>Loading</Loader>
                              </Dimmer>
                              <Image src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                          </Segment>;
        }else{
            let slides_to_show;
            let fromDecksTitle;
            if(!this.state.showSearchResults){
                slides_to_show=this.state.recentDecks;
                fromDecksTitle='Recent decks';
            }else{
                slides_to_show=this.state.searchDecks;
                fromDecksTitle=slides_to_show.length>0 ? 'Found decks' : 'No results found';
            }
            slideWikiContent =  <Segment id="panelMyDecksContent">
                                <Header as="h3">{fromDecksTitle}</Header>
                                <Label htmlFor="selectedDeckTitleId" as="label"  color="blue" pointing="right">Selected Deck</Label>
                                <Label  id="selectedDeckTitleId" content={this.state.selectedDeckTitle} role='alert' aria-alert='polite' basic color="blue"/>
                                <AttachDeckList user={userInfo} decks={slides_to_show} selectedDeckId={this.state.selectedDeckId} destinationDeckId={this.props.destinationDeckId} actionButtonId={this.props.actionButtonId} maxHeight='320px'/>
                              </Segment>;

        }


        return slideWikiContent;

    }

}

AttachSlideWiki = connectToStores(AttachSlideWiki,[UserProfileStore,AttachSubdeckModalStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        AttachSubdeckModalStore: context.getStore(AttachSubdeckModalStore).getState()
    };
});
export default AttachSlideWiki;
