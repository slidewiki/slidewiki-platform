import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import AttachQuestionsModalStore from '../../../../stores/AttachQuestionsModalStore';
//import {  Segment, Loader,Label, Image,Dimmer} from 'semantic-ui-react';
import AttachQuestionsList from './AttachQuestionsList';

class AttachSelectedDeck extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            selectedDeckId: this.props.AttachQuestionsModalStore.selectedDeckId,
        };

    }
    componentWillReceiveProps(nextProps){

        this.setState({
            selectedDeckId: nextProps.AttachQuestionsModalStore.selectedDeckId,
        });

    }
    render(){

        let attachSelectedDeck;
        if(this.props.AttachQuestionsModalStore.deckQuestions.length === 0){
            attachSelectedDeck = <div>There are no questions in the selected deck. Either select another deck to insert questions from or create some questions within that deck.</div>;
        }else {
            attachSelectedDeck = (
                <AttachQuestionsList selectedDeckId={this.state.currentDeckID} maxHeight='350px'/>
            ); 
        }
        
        return attachSelectedDeck;

    }
}

AttachSelectedDeck = connectToStores(AttachSelectedDeck,[AttachQuestionsModalStore],(context,props) => {
    return {
        AttachQuestionsModalStore: context.getStore(AttachQuestionsModalStore).getState()
    };
});
export default AttachSelectedDeck;
