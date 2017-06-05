import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore';
import AttachDeckList from './AttachDeckList';
import {  Segment, Loader,Label, Image,Dimmer,Grid, Button} from 'semantic-ui-react';
import {Microservices} from '../../../../configs/microservices';
import updateSelectedSlides  from '../../../../actions/attachSubdeck/updateSelectedSlides';

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
            selectedSlidesLabel: this.props.AttachSubdeckModalStore.selectedSlides.length +' of ' + this.props.AttachSubdeckModalStore.deckSlides.length

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
        this.setState({
            selectedSlides:this.state.deckSlides,
        });
        this.context.executeAction(updateSelectedSlides,{selectedSlides:this.state.deckSlides},null);
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
    loadSlidesGrid(){
        let activeItemStyle = {
            backgroundColor:'#f8ffff',
            border:'2px solid #2185d0'

        };
        //style ={this.state.selectedDeckId === selectedDeck.selectedDeckId ?activeItemStyle:{}}

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
                slideId =this.state.deckSlides[slidesShowed];
                singleColumn =  <Grid.Column key={slidesShowed}
                                    onClick={this.handleOnclick.bind(this,slideId)}
                                    onKeyPress={this.handleKeyPress.bind(this,slideId)}
                                    style={this.state.selectedSlides.includes(slideId)?activeItemStyle:{}}
                                    role="gridcell"
                                    aria-selected ={this.state.selectedSlides.includes(slideId)}
                                    tabIndex="0">
                                    <Image src={Microservices.file.uri + '/slideThumbnail/' +slideId+'.jpeg'}
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

        return rowsContent;

    }

    render(){
        let userInfo = {
            userId: this.props.UserProfileStore.userid,
            username: this.props.UserProfileStore.username

        };

        let slidesContent;

        if(this.state.deckSlides.length === 0){ //ojo que hay que controlar...que tenemos las slides
            slidesContent = <Segment id="panelSlidesContent">
                                <Dimmer active inverted>
                                  <Loader inverted>Loading</Loader>
                                </Dimmer>
                                <Image src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                              </Segment>;
        }else{

            let headerContent =  <Grid>
                                    <Grid.Row columns={1}>
                                      <Grid.Column>
                                        <Label htmlFor="selectedDeckTitleId" as="label"  color="blue" pointing="right" content='Selected Deck'/>
                                        <Label  id="selectedDeckTitleId" content={this.state.selectedDeckTitle} basic color="blue"/>
                                      </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={2}>
                                      <Grid.Column textAlign="left">
                                      <Label htmlFor="slidesContentId"  color='blue'  pointing="right"  content="Selected slides:"/>
                                      <Label  id="slidesContentId" content={this.state.selectedSlidesLabel} basic color="blue"/>

                                      </Grid.Column>
                                      <Grid.Column textAlign="right" >
                                        <Button type="button"
                                           aria-label="All Slides"
                                           data-tooltip="All Slides"
                                           onClick={this.handleAllSlides}>All Slides</Button>
                                        <Button type="button"
                                            aria-label="None"
                                            data-tooltip="None"
                                            onClick={this.handleNone}>None</Button>
                                      </Grid.Column>
                                    </Grid.Row>
                                  </Grid>;
            let rowsContent=this.loadSlidesGrid();
            slidesContent = <Segment id="panelSlidesContent">
                               {headerContent}
                               <Grid columns={this.numColumns}
                                 style={{maxHeight:'400px',minHeight:'320px',overflowY:'auto'}}
                                 role="grid"
                                 aria-expanded="true">
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
