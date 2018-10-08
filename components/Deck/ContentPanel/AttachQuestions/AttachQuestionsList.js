import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames/bind'; /*nikki what does this do?? */
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../../../stores/UserProfileStore'; /*nikki is this needed? */
import AttachQuestionsModalStore from '../../../../stores/AttachQuestionsModalStore';
//import CustomDate from '../../util/CustomDate';
import { Segment,Item,Grid,Icon,Label,Image,Dimmer, Loader, Button,TextArea} from 'semantic-ui-react';
import {getLanguageName, getLanguageNativeName} from '../../../../common';
import {Microservices} from '../../../../configs/microservices';
import updateSelectedQuestions  from '../../../../actions/attachQuestions/updateSelectedQuestions';
import AttachQuestionsItem from './AttachQuestionsItem';

const KEY_CODE = {
   // LEFT:   37,
    UP:     38,
   // RIGHT:  39,
    DOWN:   40,
    TAB: 9,
    ENTER: 13
}; /*nikki do I need left and right?? */

class AttachQuestionsList extends React.Component {
    constructor(props){
        /*nikki what does this receive now it's been moved? */
        /* Receives:
          user: user info
          deckQuestions: all questions for the deck
          selectedDeckId: the current deckID
          actionButtonId: buttonId which receives the focus. It was not possible to use ref to do that.
          max height of 400px...
          */
        super(props);

        this.state = {
            //selectedQuestionId: this.props.selectedQuestionId, //does it have ids?
            deckQuestions: this.props.AttachQuestionsModalStore.deckQuestions, /*nikki this.props.deckQuestions is this already passed down through props? is this overwriting the deckQuestions?*/
            selectedQuestions:this.props.AttachQuestionsModalStore.selectedQuestions,
            selectedDeckTitle: this.props.AttachQuestionsModalStore.selectedDeckTitle,
            selectedQuestionsLabel: this.props.AttachQuestionsModalStore.selectedQuestions.length +' of ' + this.props.AttachQuestionsModalStore.deckQuestions.length,
            firstTime:true //*nikki is this needed? */

        };
        this.handleAllQuestions = this.handleAllQuestions.bind(this);
        this.handleNone = this.handleNone.bind(this);

    }
    /*nikki does this need componentWillReceiveProps? */
    componentWillReceiveProps(nextProps){

        this.setState({
            //userDecks: nextProps.AttachQuestionsModalStore.userDecks,
            selectedDeckId: nextProps.AttachQuestionsModalStore.selectedDeckId, /*nikki does it actually need this if it is already given the questions? */
           //*nikki  */ deckSlides: nextProps.AttachQuestionsModalStore.deckSlides,
            deckQuestions: nextProps.AttachQuestionsModalStore.deckQuestions, //new variable for the questions of that deck
            selectedQuestions:nextProps.AttachQuestionsModalStore.selectedQuestions,
            selectedDeckTitle:nextProps.AttachQuestionsModalStore.selectedDeckTitle,
            selectedQuestionsLabel: nextProps.AttachQuestionsModalStore.selectedQuestions.length +' of ' + this.props.AttachQuestionsModalStore.deckQuestions.length

        });

    }

    /*nikki componentDidUpdate? */
    componentDidUpdate(){
        if((this.state.deckQuestions.length !== 0) && this.state.firstTime){ //We have the questions rendered
            //$('#selectedDeckTitleId').focus(); /*nikki need to change this line */
            this.setState({
                firstTime:false
            });
        } else if (this.state.deckQuestions.length === this.state.selectedQuestions.length) {
            //all questions are selected...moves focus to the attachButton
            $('#attachAttachModal').focus(); /*nikki change button id? should be a next button now */
        }
        this.refreshAccordion();    
    }

    //acccordion functions

    componentDidMount() {
        this.enableAccordion();
    }

    enableAccordion(status) {
        let accordionDIV = this.refs.contentquestionsList;
        $(accordionDIV).find('.ui.accordion').accordion({
            exclusive: false
        });
    }

    refreshAccordion(status) {
        let accordionDIV = this.refs.contentquestionsList;
        $(accordionDIV).find('.ui.accordion').accordion('refresh');
    }

    /*checkNoEmpty(element){
        return (element.toString().length>0);
    }*/

    //handleOnclick(selectedQuestion){
        /*This method:
       - adds the selectedQuestion into the selectedQuestions list if it was not selectedQuestion
       - removes the selectedQuestion from the selectedQuestions list if it was already selected
      */
     /*nikki this method isn't used atm?? */
        //console.log(this);
        //console.log(`handleonclick`);
        //console.log(this.state.selectedQuestions);
    /*    let questions = this.state.selectedQuestions;
        let index = questions.indexOf(selectedQuestion);
        if(index === -1){//It was not selected
            questions.push(selectedQuestion);
        } else { //It was selected...remove from it
            questions[index]='';
            questions = questions.filter(this.checkNoEmpty);
        };

        this.setState({
            selectedQuestions: questions
        });

        this.context.executeAction(updateSelectedQuestions,{selectedQuestions:questions},null);
    }*/


    handleAllQuestions(){
        let allQuestions = this.props.AttachQuestionsModalStore.deckQuestions; //should this have another layer?
        console.log(allQuestions);

        this.setState({
            selectedQuestions:allQuestions,
        });
        this.context.executeAction(updateSelectedQuestions,{selectedQuestions:allQuestions},null);
    
    }

    handleNone(){
        this.setState({
            selectedQuestions: [],
        });

        this.context.executeAction(updateSelectedQuestions,{selectedQuestions:[]},null);
    }

    /*handleKeyPress(selectedQuestion,event){
        if(event.key === 'Enter'){
            event.preventDefault();
            this.handleOnclick(selectedQuestion);
        }
    }*/ //not being used? nikki

    getNextPos(pos,numItems,eventKeyCode){
        /*******************************************
            Returns next position in a list, taking into account
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
    handleKeyDown(pos,numItems,event){
        if(event.keyCode === KEY_CODE.UP ||
           event.keyCode === KEY_CODE.DOWN ){
           //the user wants to navigate through the list
            event.preventDefault();
            let nextPos = this.getNextPos(pos,numItems,event.keyCode);  //get next item
             //get the id of the cell
            $('#question'+nextPos).focus(); //move to the cell
        } else if(event.keyCode === KEY_CODE.TAB){ //exit list and go to button
            event.preventDefault();
            if(this.state.selectedQuestions.length > 0 ){
                $(this.props.actionButtonId).focus(); //move focus to the action button (next)
            } else { // no questions selected
                $('#cancelAttachModal').focus();
            }
        }
    }
    inSelectedQuestions(question){
        let questions = this.props.AttachQuestionsModalStore.selectedQuestions;
        let qindex = questions.indexOf(question);
        if(qindex === -1){
            return false;
        } else { 
            return true;
        };
        
    }


    render() {
        let deckQuestions = this.props.AttachQuestionsModalStore.deckQuestions; //nikki should this be changed from state?

        let questionsContent;
        if(deckQuestions.length === 0){ //No questions loaded
            questionsContent = <Segment id="panelQuestionsContent">
                                    <Dimmer active inverted>
                                        <Loader inverted>Questions Loading</Loader>
                                    </Dimmer>
                                    <Image src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                                </Segment>;
        }else{ //once the questions have loaded
            let headerContent =  <Grid  aria-describedby="attachQuestionsDescription2">
                                    <Grid.Row columns={1}>
                                      <Grid.Column>
                                        <Label htmlFor="selectedDeckTitleId" as="label"  color="blue" pointing="right" content='Selected Deck'/>
                                        <Label  id="selectedDeckTitleId" content={this.state.selectedDeckTitle} basic/>
                                        <TextArea className="sr-only" id="attachQuestionsDescription2" value="Select questions to insert" tabIndex ='-1'/>
                                      </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={2}>
                                      <Grid.Column textAlign="left">
                                      <Label htmlFor="questionsContentId"  color='blue'  pointing="right"  content="Selected questions:"/>
                                      <Label  id="questionsContentId" content={this.state.selectedQuestionsLabel} basic/>
                                      </Grid.Column>
                                      <Grid.Column textAlign="right" >
                                        <Button type="button"
                                           id="attachAllQuestionsButtonId"
                                           color="blue"
                                           aria-label="Select All"
                                           data-tooltip="Select All"
                                           onClick={this.handleAllQuestions} >Select All</Button>
                                        <Button type="button"
                                            id="clearQuestionsSelectionButtonId"
                                            color="blue"
                                            aria-label="Clear Selection"
                                            data-tooltip="Clear Selection"
                                            onClick={this.handleNone}>Clear Selection</Button>
                                      </Grid.Column>
                                    </Grid.Row>
                                  </Grid>;

            let questionListItems = deckQuestions.map((node, index) => {
                return (
                    <AttachQuestionsItem question={node} selectedQ={this.inSelectedQuestions(node)} key={index} questionIndex={index}/>
                );
            });
            
            questionsContent = <Segment id="panelQuestionsContent">
                                {headerContent}

                                	<Item.Group divided relaxed style={{maxHeight:this.props.maxHeight,minHeight:'320px',overflowY:'auto'}}
	                                role="listbox" aria-expanded="true" aria-describedby="listInstructions">
	                                    <TextArea className="sr-only" id="listInstructions" value="Use up and down arrow keys to navigate through the list and then enter to select a deck. Use tab to go out the list." tabIndex ='-1'/>
	                                    {questionListItems}
                                    </Item.Group>
                             </Segment>;

        }


        return (
            questionsContent
        );
    }
}

AttachQuestionsList.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
AttachQuestionsList = connectToStores(AttachQuestionsList,[UserProfileStore,AttachQuestionsModalStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        AttachQuestionsModalStore: context.getStore(AttachQuestionsModalStore).getState()
    };
});

export default AttachQuestionsList;
