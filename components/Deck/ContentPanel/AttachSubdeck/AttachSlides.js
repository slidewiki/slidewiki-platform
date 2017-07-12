import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore';
import AttachDeckList from './AttachDeckList';
import {  Segment, Loader,Label, Image,Dimmer,Grid, Button,TextArea} from 'semantic-ui-react';
import {Microservices} from '../../../../configs/microservices';
import updateSelectedSlides  from '../../../../actions/attachSubdeck/updateSelectedSlides';

const KEY_CODE = {
    LEFT:   37,
    UP:     38,
    RIGHT:  39,
    DOWN:   40
};

class AttachSlides extends React.Component{

    constructor(props){
        super(props);
        this.numColumns = props.numColumns?props.numColumns:4; //if numColumns is not provided, 4 is used as default
        this.state = {

            userDecks:this.props.AttachSubdeckModalStore.userDecks,
            selectedDeckTitle:  this.props.AttachSubdeckModalStore.selectedDeckTitle,
            selectedDeckId: this.props.AttachSubdeckModalStore.selectedDeckId,
            deckSlides: this.props.AttachSubdeckModalStore.deckSlides,
            selectedSlides:this.props.AttachSubdeckModalStore.selectedSlides,
            deckSlidesTitles:this.props.AttachSubdeckModalStore.deckSlidesTitles,
            selectedSlidesLabel: this.props.AttachSubdeckModalStore.selectedSlides.length +' of ' + this.props.AttachSubdeckModalStore.deckSlides.length,
            firstTime:true

        };

        this.handleAllSlides = this.handleAllSlides.bind(this);
        this.handleNone = this.handleNone.bind(this);

    }
    componentWillReceiveProps(nextProps){

        this.setState({
            userDecks: nextProps.AttachSubdeckModalStore.userDecks,
            selectedDeckId: nextProps.AttachSubdeckModalStore.selectedDeckId,
            deckSlides: nextProps.AttachSubdeckModalStore.deckSlides,
            selectedSlides:nextProps.AttachSubdeckModalStore.selectedSlides,
            selectedDeckTitle:nextProps.AttachSubdeckModalStore.selectedDeckTitle,
            deckSlidesTitles:nextProps.AttachSubdeckModalStore.deckSlidesTitles,
            selectedSlidesLabel: nextProps.AttachSubdeckModalStore.selectedSlides.length +' of ' + this.props.AttachSubdeckModalStore.deckSlides.length

        });

    }
    componentDidUpdate(){
        if((this.state.deckSlides.length !== 0) && this.state.firstTime){ //We have the slides rendered
            $('#selectedDeckTitleId').focus();
            this.setState({
                firstTime:false
            });
        } else if (this.state.deckSlides.length === this.state.selectedSlides.length) {
            //all slides selected...move to the attachButton
            $('#attachAttachModal').focus();
        }

            //$('#attachAllSlidesButtonId').focus();
    }


    checkNoEmpty(element){
        return (element.toString().length>0);
    }

    handleOnclick(selectedSlide){
      /*This method:
       - adds the selectedSlide into the selectedSlides list if it was not selectedSlide
       - removes the selectedSlide from the selectedSlides list if it was
      */
        let slides = this.state.selectedSlides;
        let index = slides.indexOf(selectedSlide);
        if(index === -1){//It was not selected
            slides.push(selectedSlide);
        } else { //It was selected...remove from it
            slides[index]='';
            slides = slides.filter(this.checkNoEmpty);
        };

        this.setState({
            selectedSlides: slides
        });

        this.context.executeAction(updateSelectedSlides,{selectedSlides:slides},null);

    }
    handleAllSlides(){

        let selectedIds = this.state.deckSlides.map((slideId,index) => {
            return slideId+'-'+index;

        });
        this.setState({
            selectedSlides:selectedIds,
        });
        this.context.executeAction(updateSelectedSlides,{selectedSlides:selectedIds},null);

    }

    handleNone(){
        this.setState({
            selectedSlides: [],
        });

        this.context.executeAction(updateSelectedSlides,{selectedSlides:[]},null);

    }

    handleKeyPress(selectedSlide,event){
        if(event.key === 'Enter'){
            event.preventDefault();
            this.handleOnclick(selectedSlide);
        }
    }

    getNextPos(pos,numSlides,numColumns,numRows,eventKeyCode){
        /*******************************************
            Returns next position in a grid, taking into account
            the arrow key pressed and the number of rows and columns
            of the grid
        ********************************************/
        let currentRow = Math.floor(pos/numColumns);

        let lastPos = numSlides-1;
        let nextPos = parseInt(pos); //In case of overflow, we stayed in the same position. Force working with integers
        switch (eventKeyCode) {
            case KEY_CODE.RIGHT:
                if(pos !== lastPos) //No overflow by right direction
                    nextPos ++;
                break;
            case KEY_CODE.LEFT:
                if(pos !== 0)
                    nextPos --;
                break;
            case KEY_CODE.UP:
                if(currentRow !== 0)
                    nextPos = nextPos - parseInt(numColumns);
                break;
            case KEY_CODE.DOWN:
                if(currentRow !== (numRows-1))
                    nextPos = nextPos + parseInt(numColumns);
                break;

        }
        return nextPos;

    }
    handleKeyDown(pos,event){

        if(event.keyCode === KEY_CODE.RIGHT ||
           event.keyCode === KEY_CODE.LEFT ||
           event.keyCode === KEY_CODE.UP ||
           event.keyCode === KEY_CODE.DOWN ){
           //the user wants to navigate through the grid
            let numRows = Math.ceil(this.state.deckSlides.length/this.numColumns);
            let nextPos = this.getNextPos(pos,this.state.deckSlides.length,this.numColumns,numRows,event.keyCode);  //get next cell
             //get the id of the cell
            $('#slide'+nextPos).focus(); //move to the cell
        }

    }
    loadSlidesGrid(){
        let activeItemStyle = {
            backgroundColor:'#f8ffff',
            border:'2px solid #2185d0'

        };


        let numRows = Math.ceil(this.state.deckSlides.length/this.numColumns);
        let rowCount=0;
        let columnCount=0;
        let slidesShowed=0;
        let columnsContent=[];
        let singleColumn;
        let singleRow;
        let rowsContent=[];
        let slideId;

        for(let i=0;i<numRows;i++){
            while((columnCount<this.numColumns) && (slidesShowed < this.state.deckSlides.length)){
                slideId =this.state.deckSlides[slidesShowed]+'-'+slidesShowed; //we include the position. the same slideid can be more than one time
                singleColumn =  <Grid.Column key={slidesShowed}
                                    id={'slide'+slidesShowed}
                                    onClick={this.handleOnclick.bind(this,slideId)}
                                    onKeyPress={this.handleKeyPress.bind(this,slideId)}
                                    onKeyDown={this.handleKeyDown.bind(this,slidesShowed)}
                                    style={this.state.selectedSlides.includes(slideId)?activeItemStyle:{}}
                                    role="gridcell"
                                    aria-selected ={this.state.selectedSlides.includes(slideId)}
                                    tabIndex="0">
                                    <Image src={Microservices.file.uri + '/slideThumbnail/' +this.state.deckSlides[slidesShowed]+'.jpeg'}
                                        alt={'Slide '+ (slidesShowed+1)+'. '+this.state.deckSlidesTitles[slidesShowed]} bordered size='medium' />
                                  </Grid.Column>;
                columnsContent[columnCount] = singleColumn;
                columnCount ++;
                slidesShowed ++;
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
        slidesShowed=0;
        return rowsContent;

    }

    render(){
        let userInfo = {
            userId: this.props.UserProfileStore.userid,
            username: this.props.UserProfileStore.username

        };

        let slidesContent;

        if(this.state.deckSlides.length === 0){ //No slides loaded
            slidesContent = <Segment id="panelSlidesContent">
                                <Dimmer active inverted>
                                  <Loader inverted>Loading</Loader>
                                </Dimmer>
                                <Image src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                              </Segment>;
        }else{

            let headerContent =  <Grid  aria-describedby="attachSlidesDescription2">
                                    <Grid.Row columns={1}>
                                      <Grid.Column>
                                        <Label htmlFor="selectedDeckTitleId" as="label"  color="blue" pointing="right" content='Selected Deck'/>
                                        <Label  id="selectedDeckTitleId" content={this.state.selectedDeckTitle} basic color="blue" tabIndex="0"/>
                                        <TextArea className="sr-only" id="attachSlidesDescription2" value="Select slides to attach" tabIndex ='-1'/>
                                      </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={2}>
                                      <Grid.Column textAlign="left">
                                      <Label htmlFor="slidesContentId"  color='blue'  pointing="right"  content="Selected slides:"/>
                                      <Label  id="slidesContentId" content={this.state.selectedSlidesLabel} basic color="blue"/>

                                      </Grid.Column>
                                      <Grid.Column textAlign="right" >
                                        <Button type="button"
                                           id="attachAllSlidesButtonId"
                                           color="blue"
                                           aria-label="Select All"
                                           data-tooltip="Select All"
                                           onClick={this.handleAllSlides} >Select All</Button>
                                        <Button type="button"
                                            color="blue"
                                            aria-label="Clear Selection"
                                            data-tooltip="Clear Selection"
                                            onClick={this.handleNone}>Clear Selection</Button>

                                      </Grid.Column>
                                    </Grid.Row>
                                  </Grid>;
            let rowsContent=this.loadSlidesGrid();
            slidesContent = <Segment id="panelSlidesContent">
                               {headerContent}
                               <Grid columns={this.numColumns}
                                 style={{maxHeight:'400px',minHeight:'320px',overflowY:'auto'}}
                                 role="grid"
                                 aria-expanded="true"
                                  aria-describedby="gridInstructions">
                                 <TextArea className="sr-only" id="gridInstructions" value="Use arrow keys to navigate through the grid and then enter to select a slide. You can select more than one slide." tabIndex ='-1'/>
                                {rowsContent}
                               </Grid>
                            </Segment>;
        }

        return slidesContent;


    }


}

AttachSlides.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
AttachSlides = connectToStores(AttachSlides,[UserProfileStore,AttachSubdeckModalStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        AttachSubdeckModalStore: context.getStore(AttachSubdeckModalStore).getState()
    };
});
export default AttachSlides;
