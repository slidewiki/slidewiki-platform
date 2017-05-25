import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore';
import AttachDeckList from './AttachDeckList';
import {  Segment, Loader,Label, Image,Dimmer} from 'semantic-ui-react';

class AttachMyDecks extends React.Component{
    constructor(props){
        super(props);
        this.state = {

            userDecks:this.props.AttachSubdeckModalStore.userDecks,
            selectedDeckTitle:  this.props.AttachSubdeckModalStore.selectedDeckTitle,
            selectedDeckId: this.props.AttachSubdeckModalStore.selectedDeckId

        };

    }
    componentWillReceiveProps(nextProps){

        this.setState({
            userDecks: nextProps.AttachSubdeckModalStore.userDecks,
            selectedDeckId: nextProps.AttachSubdeckModalStore.selectedDeckId,
            selectedDeckTitle:nextProps.AttachSubdeckModalStore.selectedDeckTitle,
        });

    }
    render(){
        let userInfo ={
            userId: this.props.UserProfileStore.userid,
            username: this.props.UserProfileStore.username

        };

        let myDecksContent;
        if(this.state.userDecks ===[]){
            myDecksContent = <Segment id="panelMyDecksContent">
                                <Dimmer active inverted>
                                  <Loader inverted>Loading</Loader>
                                </Dimmer>
                                <Image src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                              </Segment>;
        }else{
            myDecksContent = <Segment id="panelMyDecksContent">
                                <Label htmlFor="selectedDeckTitleId" as="label"  color="blue" pointing="right">Selected Deck</Label>
                                <Label  id="selectedDeckTitleId" content={this.state.selectedDeckTitle} basic color="blue"/>

                                <AttachDeckList user={userInfo} decks={this.state.userDecks} selectedDeckId={this.state.selectedDeckId} maxHeight='400px'/>
                              </Segment>;
        }

        return myDecksContent;


    }


}
AttachMyDecks = connectToStores(AttachMyDecks,[UserProfileStore,AttachSubdeckModalStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        AttachSubdeckModalStore: context.getStore(AttachSubdeckModalStore).getState()
    };
});
export default AttachMyDecks;
