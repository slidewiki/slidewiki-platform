import React from 'react';

class ThumbnailUrl extends React.Component{
    render(){
        return(
            <img src={'/assets/images/thumbnails/' + this.props.id + '.jpg'} alt={'/deck/' + this.props.id} height={this.props.height}  width={this.props.width}/>
        );
    }

}
export default ThumbnailUrl;
