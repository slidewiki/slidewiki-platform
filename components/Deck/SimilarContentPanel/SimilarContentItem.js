import React from 'react';

class SimilarContentItem extends React.Component {

    render() {
        return (
            <div className="item">
              <div className="ui card">
                <a className="image" href={'/deck/' + this.props.data.id}>
                    <img src={this.props.data.imgSrc} alt={'/deck/' + this.props.data.id} width="60px" height="40px"/>
                </a>

                <div className="content">
                  <div className="header">
                    <a href={'/deck/' + this.props.data.id}>{this.props.data.title} </a>
                  </div>
                  <div className="description">
                    Creator:<a  href={'/user/' + this.props.data.authorId}> {this.props.data.author}</a>
                  </div>
                  <div className="meta">
                    <span className="date">
                    {this.props.data.date}
                    </span>
                  </div>
                </div>
                <div className="extra content">
                   <div className="left floated">
                      <i className="ui large thumbs outline up icon"></i> {this.props.data.liked}
                    </div>
                    <div className="right floated">
                      <i className="ui large download icon"></i>  {this.props.data.downloaded}
                    </div>
                </div>
              </div>
            </div>
        );
    }
}

export default SimilarContentItem;
