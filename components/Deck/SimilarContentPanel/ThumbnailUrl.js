import React from 'react';
import Thumbnail from './Thumbnail/Thumbnail';

class ThumbnailUrl extends React.Component{
    render(){
        return(
          <Thumbnail width={250} height={250} page="http//gti-ia.dsic.upv.es" scale={4}/>
      );
    }

}
export default ThumbnailUrl;
