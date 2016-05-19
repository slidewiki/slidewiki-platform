import React from 'react';
import Thumbnail from './Thumbnail/thumbnail';
//import Thumbnail from 'react-thumbnail';

const styles = {
    containerFlex: {
        display: 'flex',
        margin: '0 auto',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'stretch',
        flexWrap: 'wrap',
        fontFamily: 'sans-serif',
    },
    itemFlex: {
        background: 'lightgray',
        padding: 5,
        margin: 5,
    },
    itemThumbnail: {
        margin: '0 auto',
        border: '1px solid black'
    }
};

//  <img src={'/assets/images/thumbnails/' + this.props.id + '.jpg'} width={this.props.width} height={this.props.height} alt={'/deck/' + this.props.id}/>
class ThumbnailUrl extends React.Component{
    render(){
        return(
          <Thumbnail style={ styles.itemThumbnail } width={250}  height={250}  page="git-ia.dsic.upv.es"  keepAspectRatio="height" scale={4} />
        );
    }

}
export default ThumbnailUrl;
