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
                <div className="ui item">
                    <div className="item">
                        <div className="content">
                            <div className="header">
                                <i className="icon user" aira-label="user name"></i>
                                { this.props.user.uname }
                            </div>
                            <div className="description">
                                { !isEmpty(this.props.user.description) ? <p>{ this.props.user.description }</p> : '' }
                            </div>
                            <div className="extra">
                                {(this.props.user.uname === this.props.loggedinuser) ? (
                                    <div className="ui right floated basic setting icon button">
                                        <i className="setting icon" aria-hidden="true"/>
                                        <NavLink href={ '/user/' + this.props.user.uname + '/settings/profile' } role="button" aria-label="open my settings">
                                        </NavLink>
                                    </div>
                                ) : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div className = "ui divider" />
                <div className="ui list">
                    { !isEmpty(this.props.user.organization) ? 
                        <div className="item">
                            <i className="user circle outline icon" aria-label="organisation"/> { this.props.user.organization }</div> 
                        : '' }
                    { !isEmpty(this.props.user.country) ? 
                        <div classname="item">
                            <i className="marker icon" aria-label="country"/> { this.props.user.country }
                        </div> 
                        : '' }
                    { !isEmpty(this.props.user.website) ? 
                        <div className="item">
                            <i className="globe icon" aria-label="website"/> { this.props.user.website }
                        </div> 
                        : '' }
                    { !isEmpty(this.props.user.joined) ? <div className="item">
                        <i className="clock icon" aria-label="user since"/> { this.props.user.joined }
                    </div> 
                    : '' }
                </div>
                <div className = "ui divider" />
            </div>
        );
    }
}

PublicUserData.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default PublicUserData;
