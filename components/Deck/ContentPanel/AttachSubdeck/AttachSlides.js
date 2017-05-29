import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../../../stores/UserProfileStore';
import AttachSubdeckModalStore from '../../../../stores/AttachSubdeckModalStore';
import AttachDeckList from './AttachDeckList';
import {  Segment, Loader,Label, Image,Dimmer,Grid, Button} from 'semantic-ui-react';

class AttachSlides extends React.Component{
    constructor(props){
        super(props);
        this.state = {

            userDecks:this.props.AttachSubdeckModalStore.userDecks,
            selectedDeckTitle:  this.props.AttachSubdeckModalStore.selectedDeckTitle,
            selectedDeckId: this.props.AttachSubdeckModalStore.selectedDeckId,
            deckSlides: this.props.AttachSubdeckModalStore.deckSlides

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

        let slidesContent;
        console.log(this.state.deckSlides);
        if(this.state.deckSlides.length === 0){ //ojo que hay que controlar...que tenemos las slides
            slidesContent = <Segment id="panelSlidesContent">
                                <Dimmer active inverted>
                                  <Loader inverted>Loading</Loader>
                                </Dimmer>
                                <Image src="http://semantic-ui.com/images/wireframe/paragraph.png" />
                              </Segment>;
        }else{
            slidesContent = <Segment id="panelSlidesContent">
                              <Grid  >
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
                              </Grid>
                              <Grid columns={4} style={{maxHeight:'400px',minHeight:'320px',overflowY:'auto'}}>
                                <Grid.Row>
                                  <Grid.Column>
                                    <Image src='http://react.semantic-ui.com/assets/images/wireframe/image.png' size='small' onClick={console.log('click')} />
                                  </Grid.Column>
                                  <Grid.Column>
                                    <Image src='http://react.semantic-ui.com/assets/images/wireframe/image.png' size='small' />
                                  </Grid.Column>
                                  <Grid.Column>
                                    <Image src='http://react.semantic-ui.com/assets/images/wireframe/image.png' size='small' />
                                  </Grid.Column>
                                  <Grid.Column>
                                    <Image src='http://react.semantic-ui.com/assets/images/wireframe/image.png' size='small' />
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                <Grid.Column>
                                  <Image src='http://react.semantic-ui.com/assets/images/wireframe/image.png' size='small' />
                                </Grid.Column>
                                  <Grid.Column>
                                    <Image src='http://react.semantic-ui.com/assets/images/wireframe/image.png' size='small'/>
                                  </Grid.Column>
                                  <Grid.Column>
                                    <Image src='http://react.semantic-ui.com/assets/images/wireframe/image.png' size='small'/>
                                  </Grid.Column>
                                  <Grid.Column>
                                    <Image src='http://react.semantic-ui.com/assets/images/wireframe/image.png' size='small'/>
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                <Grid.Column>
                                  <Image src='http://react.semantic-ui.com/assets/images/wireframe/image.png' size='small' />
                                </Grid.Column>
                                  <Grid.Column>
                                    <Image src='http://react.semantic-ui.com/assets/images/wireframe/image.png' size='small' />
                                  </Grid.Column>
                                  <Grid.Column>
                                    <Image src='http://react.semantic-ui.com/assets/images/wireframe/image.png' size='small'/>
                                  </Grid.Column>
                                  <Grid.Column>
                                    <Image src='http://react.semantic-ui.com/assets/images/wireframe/image.png' size='small' />
                                  </Grid.Column>
                                </Grid.Row>
                                </Grid>

                              </Segment>;
        }

        return slidesContent;


    }


}
AttachSlides = connectToStores(AttachSlides,[UserProfileStore,AttachSubdeckModalStore],(context,props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        AttachSubdeckModalStore: context.getStore(AttachSubdeckModalStore).getState()
    };
});
export default AttachSlides;
