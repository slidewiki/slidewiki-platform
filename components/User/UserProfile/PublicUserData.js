import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'fluxible-router';
import UserPicture from '../../common/UserPicture';
import { isEmpty } from '../../../common.js';
import {defineMessages} from 'react-intl';

class PublicUserData extends React.Component {

    constructor(props){
        super(props);
        this.messages = this.getIntlMessages();
    }

    getIntlMessages(){
        return defineMessages({
            stats: {
                id: 'UserMenu.stats',
                defaultMessage: 'User Stats'
            },
        });
    }
    render() {
        let content1 = <UserPicture picture={ this.props.user.picture } username={ this.props.user.uname } link={ false } private={ false } width={ 150 } centered={ false } size={ 'small' } aria-hidden={ 'true' } />;
        let content2 = <div><h2>{ this.props.user.displayName }</h2>
        <div className="ui item">
            <div className="item">
                <div className="content">
                    <div className="header">
                        <i className="icon user" aria-label="users name"></i>
                        { this.props.user.uname }
                        {(this.props.user.uname === this.props.loggedinuser) ? (
                            <NavLink href={ '/user/' + this.props.user.uname + '/settings/profile' } role="button" aria-label="open my settings" className="ui right floated basic icon button">
                                <i className="setting icon"/>
                            </NavLink>
                        ) : ''}
                    </div>
                    <div className="description">
                        { !isEmpty(this.props.user.description) ? <p>{ this.props.user.description }</p> : '' }
                    </div>
                </div>
            </div>
        </div>
        <div className = "ui divider" />
        <div className="ui list attached">
            { !isEmpty(this.props.user.organization) ?
                <div className="item">
                    <i className="user circle outline icon" aria-label="organisation"/> { this.props.user.organization }
                </div>
                : '' }
            { !isEmpty(this.props.user.country) ?
                <div className="item">
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
        </div>;

        return (
            <div className="ui two column grid">
                <div className="ui sixteen wide column computer tablet only">
                    {content1}
                    {content2}
                </div>
                <div className="ui column mobile only">
                    {content1}
                </div>
                <div className="ui column mobile only">
                    {content2}
                </div>
                <div className="ui sixteen wide column">
                    <div className = "ui divider" />
                </div>
            </div>
        );
    }
}

PublicUserData.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default PublicUserData;
