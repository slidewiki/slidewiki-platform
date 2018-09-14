import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachQuestionsModalStore from '../../../../stores/AttachQuestionsModalStore';
//import AttachDeckList from './AttachDeckList';
import {  Segment, Loader,Label, Image,Dimmer} from 'semantic-ui-react';
import AttachQuestionsList from './AttachQuestionsList';

class AttachCurrentDeck extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            /*nikki shouldn't set state, should use props from parent component and handlers also passed down */
            //userDecks:this.props.AttachQuestionsModalStore.userDecks,
            selectedDeckTitle:  this.props.AttachQuestionsModalStore.selectedDeckTitle,
            selectedDeckId: this.props.currentDeckID
        };

    }
    componentWillReceiveProps(nextProps){

        this.setState({
            //userDecks: nextProps.AttachQuestionsModalStore.userDecks,
            selectedDeckId: nextProps.currentDeckID,
            selectedDeckTitle:nextProps.AttachQuestionsModalStore.selectedDeckTitle,
        });

    }
    render(){

        /*let userInfo ={
            userId: this.props.UserProfileStore.userid,
            username: this.props.UserProfileStore.username

        };*/

        let currentDeckContent;
     if(this.props.questionsCount === 0){
           currentDeckContent = <div>There are no questions in this deck. Either select another deck to insert questions from or create some questions within this deck.</div> 
       }else {
           currentDeckContent = (
             <AttachQuestionsList deckQuestions={this.props.deckQuestions} selectedDeckId={this.props.currentDeckID} maxHeight='350px'/>
           ); /*nikki does it need all of these parameters? removed: user={userInfo} actionButtonId={this.props.actionButtonId}*/ 
       }
/*nikki removed segment */
 //<Segment id="panelCurrentDeckContent">
 //</Segment>
 { /*  <Label htmlFor="selectedDeckTitleId" as="label"  color="blue" pointing="right">Selected Deck</Label>
               <Label  id="selectedDeckTitleId" content={this.props.currentDeckID} role='alert' aria-live='polite' basic />*/}
    

    return currentDeckContent;

    }
}

AttachCurrentDeck = connectToStores(AttachCurrentDeck,[UserProfileStore,AttachQuestionsModalStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        AttachQuestionsModalStore: context.getStore(AttachQuestionsModalStore).getState()
    };
});
export default AttachCurrentDeck;
