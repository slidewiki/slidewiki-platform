import React from 'react';
import Thumbnail from './Thumbnail/Thumbnail';

//  <img src={'/assets/images/thumbnails/' + this.props.id + '.jpg'} width={this.props.width} height={this.props.height} alt={'/deck/' + this.props.id}/>
class ThumbnailUrl extends React.Component{
    render(){
        return(
          <Thumbnail width={250}  height={250}  page="git-ia.dsic.upv.es"  keepAspectRatio="height" scale={4} />
        );
    }

}
export default ThumbnailUrl;
