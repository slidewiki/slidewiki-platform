import React from 'react';

//import Thumbnail from 'react-thumbnail';

class ThumbnailUrl extends React.Component{
    render(){
        return(
      //    <Thumbnail width={40} height={60} page="http://www.gti-ia.upv.es/" />
        <img src={'/assets/images/thumbnails/' + this.props.id + '.jpg'} alt={'/deck/' + this.props.id} height={this.props.height}  width={this.props.width}/>
      );
    }

}
export default ThumbnailUrl;
