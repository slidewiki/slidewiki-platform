import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore'; 
import AttachQuestionsModalStore from '../../../../stores/AttachQuestionsModalStore';
import AttachDeckList from './AttachDeckList';
import {  Segment, Loader,Label, Image,Dimmer} from 'semantic-ui-react';

class AttachMyDecks extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            userDecks:this.props.AttachSubdeckModalStore.userDecks,
            selectedDeckTitle: this.props.AttachQuestionsModalStore.selectedDeckTitle,
            selectedDeckId: this.props.AttachQuestionsModalStore.selectedDeckId
        };
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            userDecks: nextProps.AttachSubdeckModalStore.userDecks,
            selectedDeckId: nextProps.AttachQuestionsModalStore.selectedDeckId,
            selectedDeckTitle: nextProps.AttachQuestionsModalStore.selectedDeckTitle,
        });

    }
    render(){

        let userInfo ={
            userId: this.props.UserProfileStore.userid,
            username: this.props.UserProfileStore.username
        };

        let myDecksContent;
        if(this.state.userDecks.length === 0){
            myDecksContent = <Segment id="panelMyDecksContent">
                                <Dimmer active inverted>
                                    <Loader inverted>Loading</Loader>
                                </Dimmer>
                                <Image src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                              </Segment>;
        }else{
            myDecksContent = <Segment id="panelMyDecksContent">
                                <Label htmlFor="selectedDeckTitleId" as="label"  color="blue" pointing="right">Selected Deck</Label>
                                <Label  id="selectedDeckTitleId" content={this.props.AttachQuestionsModalStore.selectedDeckTitle} role='alert' aria-live='polite' basic />
                                <AttachDeckList user={userInfo} decks={this.state.userDecks} selectedDeckId={this.state.selectedDeckId} destinationDeckId={this.props.destinationDeckId} actionButtonId={this.props.actionButtonId} maxHeight='400px'/>
                              </Segment>;
        }

        return myDecksContent;
    }


}
AttachMyDecks = connectToStores(AttachMyDecks,[UserProfileStore,AttachSubdeckModalStore,AttachQuestionsModalStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        AttachSubdeckModalStore: context.getStore(AttachSubdeckModalStore).getState(),
        AttachQuestionsModalStore: context.getStore(AttachQuestionsModalStore).getState()
    };
});
export default AttachMyDecks;
