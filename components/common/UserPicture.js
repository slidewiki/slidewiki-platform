import React from 'react';
import Identicons from 'identicons-react';
import classNames from 'classnames';

/**
 * Properties:
 *   picture: either empty or a URL
 *   username: the username, the picture belongs to
 *   link:  true|false - link to the user profile
 *   private: true|false - used on a private page or not
 *   centered: true|false
 *   size: semantic-ui size classes, like mini, tiny, small, medium, large, big, huge, massive
 *   width: positive integer - width of the identicon
 */

class UserPicture extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        let classes = classNames({
            'ui': true,
            'mini': this.props.size === 'mini',
            'tiny': this.props.size === 'tiny',
            'small': this.props.size === 'small',
            'medium': this.props.size === 'medium',
            'large': this.props.size === 'large',
            'big': this.props.size === 'big',
            'huge': this.props.size === 'huge',
            'massive': this.props.size === 'massive',
            'centered': this.props.centered,
            'avatar': this.props.avatar,
            'rounded': true,
            'bordered': true,
            'image': true,
        });
        let picture = '';
        if (this.props.picture === '')
            picture = <div className={ classes }><Identicons id={ this.props.username } width={ this.props.width } size={ 5 }/></div>;
        else if (this.props.picture.includes('gravatar')) {
            if (this.props.private)
                picture = <div data-tooltip="Not your picture? Please use your gravatar email." data-position="top center" data-inverted=""><img src={ this.props.picture } className={ classes }/></div>;
            else
                picture = <img src={ this.props.picture } className={ classes }/>;
        } else
            picture = <img src={ this.props.picture } className={ classes }/>;
        return (
            <div > { this.props.link ? <a href={ '/user/' + username }>picture</a> : picture}</div>
        );
    }
}

UserPicture.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserPicture;
