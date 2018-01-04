import React from 'react';
import { NavLink } from 'fluxible-router';
import UserPicture from '../../common/UserPicture';
import { isEmpty } from '../../../common.js';

class PublicUserData extends React.Component {

    render() {
        return (
            <div>
                <UserPicture picture={ this.props.user.picture } username={ this.props.user.uname } link={ false } private={ false } width={ 150 } centered={ false } size={ 'small' }/>
                <h2>{ this.props.user.fname } { this.props.user.lname }</h2>
                <div className="ui medium header">
                    <i className="icon user" aira-label="user name"></i>
                    { this.props.user.uname }
                    <strong>     </strong>
                    {(this.props.user.uname === this.props.loggedinuser) ? (
                      <NavLink className="basic ui icon button" href={ '/user/' + this.props.user.uname + '/settings/profile' } role="button" aria-label="open my settings">
                        <i className="setting icon" aria-hidden="true"/>
                      </NavLink>
                      ) : ''}
                </div>
                { !isEmpty(this.props.user.description) ? <p>{ this.props.user.description }</p> : '' }
                <div className = "ui divider" />
                { !isEmpty(this.props.user.organization) ? <div><i className="user circle outline icon" aria-label="organisation"/> { this.props.user.organization }<br/><br/></div> : '' }
                { !isEmpty(this.props.user.country) ? <div><i className="marker icon" aria-label="country"/> { this.props.user.country }<br/><br/></div> : '' }
                { !isEmpty(this.props.user.website) ? <div><i className="globe icon" aria-label="website"/> { this.props.user.website }<br/><br/></div> : '' }
                { !isEmpty(this.props.user.joined) ? <div><i className="clock icon" aria-label="user since"/> { this.props.user.joined }<br/><br/></div> : '' }
                <div className = "ui divider" />
            </div>
        );
    }
}

PublicUserData.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default PublicUserData;
