import React from 'react';
import Thumbnail from 'react-thumbnail';

class ThumbnailUrl extends React.Component{
    render(){
        return(
          <Thumbnail width={40} height={60} page="http://www.gti-ia.upv.es/" />
      );
    }

}
export default ThumbnailUrl;
