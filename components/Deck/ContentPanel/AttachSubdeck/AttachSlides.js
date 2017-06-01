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
            selectedSlides:this.props.AttachSubdeckModalStore.selectedSlides


        };

    }
    componentWillReceiveProps(nextProps){

        this.setState({
            userDecks: nextProps.AttachSubdeckModalStore.userDecks,
            selectedDeckId: nextProps.AttachSubdeckModalStore.selectedDeckId,
            deckSlides: nextProps.AttachSubdeckModalStore.deckSlides,
            selectedDeckTitle:nextProps.AttachSubdeckModalStore.selectedDeckTitle
        });

    }
    handleOnclick(selectedSlide){
        let slides = this.state.selectedSlides;

        slides.push(selectedSlide);
        console.log('onclick');
        console.log(selectedSlide);
        this.setState({
            selectedSlides: slides
        });
        console.log(this.state.selectedSlides);
        this.context.executeAction(updateSelectedSlides,{selectedSlides:this.state.selectedSlides},null);

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
                                    role="listitem"
                                    aria-selected ={this.state.selectedSlides.includes(slideId)}
                                    tabIndex="0">
                                    <Image src={Microservices.file.uri + '/slideThumbnail/' +slideId+'.jpeg'} bordered size='medium' />
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
                                      <Label htmlFor="slidesContentId"  color='blue'  pointing="right"  content="Select slides:"/>
                                      </Grid.Column>
                                      <Grid.Column textAlign="right" >
                                        <Button >All Slides</Button>
                                        <Button >None</Button>
                                      </Grid.Column>
                                    </Grid.Row>
                                  </Grid>;
            let rowsContent=this.loadSlidesGrid();
            slidesContent = <Segment id="panelSlidesContent">
                               {headerContent}
                               <Grid columns={this.numColumns}
                                 style={{maxHeight:'400px',minHeight:'320px',overflowY:'auto'}}
                                 role="listbox"
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
