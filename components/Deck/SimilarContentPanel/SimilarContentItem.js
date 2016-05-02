import React from 'react';

class SimilarContentItem extends React.Component {
    render() {
        return (
            <div className="item">
                  <a href={'/deck/' + this.props.data.id}>
				    <div className="thumbnail"> 
					    <img src={'/assets/images/thumbnails/' + this.props.data.id + '.jpg'} height="40" width="60"/>
					</div>
				     <div className="thumbnailtitle">{this.props.data.title}</div>
				  </a>
            </div>
        );
    }
}

export default SimilarContentItem;
