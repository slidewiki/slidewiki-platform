import React from 'react';
import UserPicture from '../../common/UserPicture';
import { isEmpty } from '../../../common.js';

class PublicUserData extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return (
            <div>
                <UserPicture picture={ this.props.user.picture } username={ this.props.user.uname } link={ false } private={ false } width={ 150 } centered={ false } size={ 'small' }/>
                <h2>{ this.props.user.fname } { this.props.user.lname }</h2>
                <h3>{ this.props.user.uname }</h3>
                { !isEmpty(this.props.user.description) ? <p>{ this.props.user.description }</p> : '' }
                <div className = "ui divider" />
                { !isEmpty(this.props.user.organization) ? <div><i className="ui users icon"/> { this.props.user.organization }<br/><br/></div> : '' }
                { !isEmpty(this.props.user.country) ? <div><i className="ui marker icon"/> { this.props.user.country }<br/><br/></div> : '' }
                { !isEmpty(this.props.user.website) ? <div><i className="ui globe icon"/> { this.props.user.website }<br/><br/></div> : '' }
                { !isEmpty(this.props.user.joined) ? <div><i className="ui clock icon"/> { this.props.user.joined }<br/><br/></div> : '' }
                <div className = "ui divider" />
            </div>
        );
    }
}

PublicUserData.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default PublicUserData;
