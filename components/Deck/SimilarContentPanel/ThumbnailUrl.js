import React from 'react';
<<<<<<< HEAD
import Thumbnail from './Thumbnail/Thumbnail';
=======

//import Thumbnail from 'react-thumbnail';
>>>>>>> ec46d2721878fe8290aad46250910b380e1a75a0

class ThumbnailUrl extends React.Component{
    render(){
        return(
<<<<<<< HEAD
          <Thumbnail width={250} height={250} page="http//gti-ia.dsic.upv.es" scale={4}/>
=======
      //    <Thumbnail width={40} height={60} page="http://www.gti-ia.upv.es/" />
        <img src={'/assets/images/thumbnails/' + this.props.id + '.jpg'} alt={'/deck/' + this.props.id} height={this.props.height}  width={this.props.width}/>
>>>>>>> ec46d2721878fe8290aad46250910b380e1a75a0
      );
    }

}
export default ThumbnailUrl;
