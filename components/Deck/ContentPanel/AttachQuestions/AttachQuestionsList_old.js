import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachQuestionsModalStore from '../../../../stores/AttachQuestionsModalStore';
//import AttachDeckList from '../AttachSubdeck/AttachDeckList';
import {  Segment, Loader,Label, Image,Dimmer,Grid, Button,TextArea} from 'semantic-ui-react';
import {Microservices} from '../../../../configs/microservices';
import updateSelectedQuestions from '../../../../actions/attachQuestions/updateSelectedQuestions';

const KEY_CODE = {
    LEFT:   37,
    UP:     38,
    RIGHT:  39,
    DOWN:   40,
    TAB: 9,
    ENTER: 13
};

/*nikki does this want to change to mimic the attachdecklist? */
class AttachQuestionsList extends React.Component{

    constructor(props){
        super(props);
        //this.numColumns = props.numColumns?props.numColumns:4; //if numColumns is not provided, 4 is used as default
        this.state = {

            userDecks:this.props.AttachQuestionsModalStore.userDecks,
            selectedDeckTitle:  this.props.AttachQuestionsModalStore.selectedDeckTitle,
            selectedDeckId: this.props.AttachQuestionsModalStore.selectedDeckId,
            //deckSlides: this.props.AttachQuestionsModalStore.deckSlides,
            deckQuestions:this.props.AttachQuestionsModalStore.deckQuestions,
            selectedQuestions:this.props.AttachQuestionsModalStore.selectedQuestions,
            selectedQuestionsLabel: this.props.AttachQuestionsModalStore.selectedQuestions.length +' of ' + this.props.AttachQuestionsModalStore.deckQuestions.length,
            firstTime:true

        };

        this.handleAllQuestions = this.handleAllQuestions.bind(this);
        this.handleNone = this.handleNone.bind(this);

    }
    componentWillReceiveProps(nextProps){

        this.setState({
            userDecks: nextProps.AttachQuestionsModalStore.userDecks,
            selectedDeckId: nextProps.AttachQuestionsModalStore.selectedDeckId,
           //*nikki  */ deckSlides: nextProps.AttachQuestionsModalStore.deckSlides,
            deckQuestions: nextProps.AttachQuestionsModalStore.deckQuestions, //new variable for the questions of that deck
            selectedQuestions:nextProps.AttachQuestionsModalStore.selectedQuestions,
            selectedDeckTitle:nextProps.AttachQuestionsModalStore.selectedDeckTitle,
            selectedQuestionsLabel: nextProps.AttachQuestionsModalStore.selectedQuestions.length +' of ' + this.props.AttachQuestionsModalStore.deckQuestions.length

        });

    }
    componentDidUpdate(){
        if((this.state.deckQuestions.length !== 0) && this.state.firstTime){ //We have the questions rendered
            $('#selectedDeckTitleId').focus(); /*nikki need to change this line */
            this.setState({
                firstTime:false
            });
        } else if (this.state.deckQuestions.length === this.state.selectedQuestions.length) {
            //all all questions are selected...moves focus to the attachButton
            $('#attachAttachModal').focus();
        }
    }


    checkNoEmpty(element){
        return (element.toString().length>0);
    }

    handleOnclick(selectedQuestion){
      /*This method:
       - adds the selectedQuestion into the selectedQuestions list if it was not selectedQuestion
       - removes the selectedQuestion from the selectedQuestions list if it was already selected
      */
        let questions = this.state.selectedQuestions;
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

    }
    handleAllQuestions(){/*nikki need to check this - how does it change for questions */
        /*nikki was this just putting the ids into the selectedslides array? */
        let selectedIds = this.state.deckQuestions.map((question,index) => {
            return question.id+'-'+index;
        });
        this.setState({
            selectedQuestions:selectedIds,
        });
        this.context.executeAction(updateSelectedQuestions,{selectedQuestions:selectedIds},null);

    }

    handleNone(){
        this.setState({
            selectedQuestions: [],
        });

        this.context.executeAction(updateSelectedQuestions,{selectedQuestions:[]},null);

    }

    handleKeyPress(selectedQuestion,event){
        if(event.key === 'Enter'){
            event.preventDefault();
            this.handleOnclick(selectedQuestion);
        }
    }

    getNextPos(pos,numQuestions,eventKeyCode){
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
                if(nextPos !== (numQuestions-1))
                    nextPos ++ ;
                break;
        }
        return nextPos;

    }
    handleKeyDown(pos,numQuestions,event){
        if(event.keyCode === KEY_CODE.UP ||
            event.keyCode === KEY_CODE.DOWN ){
            //the user wants to navigate through the grid
            event.preventDefault();
            let nextPos = this.getNextPos(pos,numQuestions,event.keyCode);  //get next item
            //get the id of the cell
            $('#question'+nextPos).focus(); //move to the cell
        } else if(event.keyCode === KEY_CODE.TAB){ //exit list and go to button
            event.preventDefault();
            if(this.state.selectedQuestions.length > 0){
                $(this.props.actionButtonId).focus();
            } else { // deck is not selected
                $('#previousAttachModal').focus();
            }
        }
    }
        //    let nextPos = this.getNextPos(pos,this.state.deckQuestions.length,event.keyCode);  //get next cell

 /*   loadQuestionsGrid()
        let activeItemStyle = {
            backgroundColor:'#f8ffff',
            border:'2px solid #2185d0'

        };


        let numRows = Math.ceil(this.state.deckQuestions.length/this.numColumns);
        let rowCount=0;
        let columnCount=0;
        let questionsShowed=0;
        let columnsContent=[];
        let singleColumn;
        let singleRow;
        let rowsContent=[];
        let questionId;

        for(let i=0;i<numRows;i++){
            while((columnCount<this.numColumns) && (questionsShowed < this.state.deckQuestions.length)){
                questionId =this.state.deckQuestions[questionsShowed].id+'-'+questionsShowed; //we include the position. the same slideid can be more than one time
                //let thumbnailURL = `${Microservices.file.uri}/thumbnail/question/${this.state.deckQuestions[questionsShowed].id}`;
                //if (this.state.deckQuestions[questionsShowed].theme) {
                //    thumbnailURL += '/' + this.state.deckQuestions[questionsShowed].theme;
                //}
                singleColumn =  <Grid.Column key={questionsShowed}
                                    id={'question'+questionsShowed}
                                    onClick={this.handleOnclick.bind(this,questionId)}
                                    onKeyPress={this.handleKeyPress.bind(this,questionId)}
                                    onKeyDown={this.handleKeyDown.bind(this,questionsShowed)}
                                    style={this.state.selectedQuestions.includes(questionId)?activeItemStyle:{}}
                                    role="gridcell"
                                    aria-selected ={this.state.selectedQuestions.includes(questionId)}
                                    tabIndex="0">
                                    Question here 
                                {/*nikki    <Image src={thumbnailURL}
                                 alt={'Question '+ (questionsShowed+1)+'. '+this.state.deckQuestions[questionsShowed].title} bordered size='medium' />
           
                                  </Grid.Column>;
                columnsContent[columnCount] = singleColumn;
                columnCount ++;
                questionsShowed ++;
            }

            singleRow = <Grid.Row  key={i.toString()}>
                          {columnsContent}
                        </Grid.Row>;
            rowsContent[i]=singleRow;
            columnCount = 0;
            columnsContent=[];
        }
        rowCount=0;
        columnCount=0;
        questionsShowed=0;
        return rowsContent;

    }
    */

    render(){
        /*let userInfo = {
            userId: this.props.UserProfileStore.userid,
            username: this.props.UserProfileStore.username
        }; */

        let questionsContent;

        if(this.state.deckQuestions.length === 0){ //No questions loaded
            questionsContent = <Segment id="panelQuestionsContent">
                                <Dimmer active inverted>
                                  <Loader inverted>Loading... maybe</Loader>
                                </Dimmer>
                                <Image src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                              </Segment>;
            /*nikki should this be changed? so that a message comes up? */
        }else{

            let headerContent =  <Grid  aria-describedby="attachQuestionsDescription2">
                                    <Grid.Row columns={1}>
                                      <Grid.Column>
                                        <Label htmlFor="selectedDeckTitleId" as="label"  color="blue" pointing="right" content='Selected Deck'/>
                                        <Label  id="selectedDeckTitleId" content={this.state.selectedDeckTitle} basic tabIndex="0"/>
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
            let rowsContent=this.loadQuestionsGrid();
            questionsContent = <Segment id="panelQuestionsContent">
                               {headerContent}
                               <Grid columns={this.numColumns}
                                 style={{maxHeight:'400px',minHeight:'320px',overflowY:'auto'}}
                                 role="grid"
                                 aria-expanded="true"
                                  aria-describedby="gridInstructions">
                                 <TextArea className="sr-only" id="gridInstructions" value="Use arrow keys to navigate through the grid and then enter to select a question. You can select more than one question." tabIndex ='-1'/>
                                {rowsContent}
                               </Grid>
                            </Segment>;
        }

        return questionsContent;


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
