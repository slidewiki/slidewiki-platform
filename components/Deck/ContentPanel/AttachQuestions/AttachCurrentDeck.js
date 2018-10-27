import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import AttachQuestionsModalStore from '../../../../stores/AttachQuestionsModalStore';
//import {  Segment, Loader,Label, Image,Dimmer} from 'semantic-ui-react';
import AttachQuestionsList from './AttachQuestionsList';

class AttachCurrentDeck extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            selectedDeckTitle:  this.props.AttachQuestionsModalStore.selectedDeckTitle,
            selectedDeckId: this.props.currentDeckID
        };

    }
    componentWillReceiveProps(nextProps){

        this.setState({
            selectedDeckId: nextProps.currentDeckID,
            selectedDeckTitle:nextProps.AttachQuestionsModalStore.selectedDeckTitle,
        });

    }
    render(){

        let currentDeckContent;
        if(this.props.questionsCount === 0){
            currentDeckContent = <div>There are no questions in this deck. Either select another deck to insert questions from or create some questions within this deck.</div>;
        }else {
            currentDeckContent = (
                <AttachQuestionsList activeItem={'currentDeck'} selectedDeckId={this.props.currentDeckID} maxHeight='350px'/>
            ); 
        }
        
        return currentDeckContent;

    }
}

AttachCurrentDeck = connectToStores(AttachCurrentDeck,[AttachQuestionsModalStore],(context,props) => {
    return {
        AttachQuestionsModalStore: context.getStore(AttachQuestionsModalStore).getState()
    };
});
export default AttachCurrentDeck;
