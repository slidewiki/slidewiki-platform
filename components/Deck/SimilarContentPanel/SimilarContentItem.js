import React from 'react';

class SimilarContentItem extends React.Component {
    render() {
        return (
            <div className="item">
              <a className="avatar inline-div padding5" href={'/deck/' + this.props.data.id}>
                  <img src={'/assets/images/thumbnails/' + this.props.data.id + '.jpg'} alt={'/deck/' + this.props.data.id} height="40" width="60"/>
              </a>
              <div className="content inline-div">
                <div className="description">
                 <a href={'/deck/' + this.props.data.id}>{this.props.data.title} </a>
                 </div>
                <div className="header">
                  <a  href={'/user/' + this.props.data.authorId}>{this.props.data.author}</a>
                </div>
                  <div className="description">
                  <i className="ui large thumbs outline up icon"></i> {this.props.data.liked}
                  <i className="ui large download icon"></i>  {this.props.data.downloaded}
                  </div>
              </div>

            </div>
        );
    }
}

export default SimilarContentItem;
