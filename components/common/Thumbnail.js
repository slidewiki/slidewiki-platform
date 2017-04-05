import React from 'react';

/* Read https://slidewiki.atlassian.net/wiki/display/SWIK/How+To+Use+Slide+Thumbnail to know the details */
class Thumbnail extends React.Component {
    render() {
        const altText = this.props.slideId === undefined ? '' : this.props.slideId;
        return (
          <span>
              <img src={this.props.url}
                  alt={altText} />
          </span>
        );
    }
}

export default Thumbnail;
