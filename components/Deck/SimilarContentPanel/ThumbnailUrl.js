import React from 'react';

class ThumbnailUrl extends React.Component{
    render(){
        return(
          <img src={'/assets/images/thumbnails/' + this.props.id + '.jpg'} width={this.props.width} height={this.props.height} alt={'/deck/' + this.props.id}/>
        );
    }

}
export default ThumbnailUrl;
