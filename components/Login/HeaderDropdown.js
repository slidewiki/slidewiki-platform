import React from 'react';
import { NavLink, navigateAction } from 'fluxible-router';
import UserPicture from '../common/UserPicture';
import { connectToStores } from 'fluxible-addons-react';
import userSignOut from '../../actions/user/userSignOut';
import fetchUser from '../../actions/user/userprofile/fetchUser';

class HeaderDropdown extends React.Component {
    componentDidMount(){
        $(this.refs.userDropDown).dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false});
        if(this.props.userpicture === undefined)
            this.context.executeAction(fetchUser,{ params: {username: this.props.username}, onlyPicture: true});
    }

    componentDidUpdate() {
        $(this.refs.userDropDown).dropdown({action: this.onEnterAndClick.bind(this), selectOnKeydown: false});
        if(this.props.userpicture === undefined)
            this.context.executeAction(fetchUser, { params: {username: this.props.username}, onlyPicture: true});
    }

    onEnterAndClick(text, value) {
        if(value === 'logout')
            this.context.executeAction(userSignOut, {username: this.props.username});
        else
            this.context.executeAction(navigateAction, {url: value});
        $(this.refs.userDropDown).dropdown('hide');
        return false;
    }

    render() {
        let pic = (this.props.userpicture === undefined) ? '' : this.props.userpicture;
        return(
            <div className="ui top right pointing dropdown" ref="userDropDown" role="button" aria-haspopup="true" aria-label="User management">
                <div className="text">
                    <UserPicture picture={ pic } username={ this.props.username } avatar={ true } width= { 30 } />
                </div>
                <i className="ui big left floated aligned dropdown icon"></i>
                <div className="menu" role="menu">
                    <div className="header">
                        {this.props.username}
                    </div>
                    <div className="divider"></div>
                    <div className="item" data-value={'/user/' + this.props.username} role="menuitem" aria-label="My Decks" tabIndex="0" >
                        <i className="user icon link"  /> My Decks
                    </div>
                    <div className="item" data-value={'/user/' + this.props.username + '/settings/profile' } role="menuitem" aria-label="My Settings" tabIndex="0" >
                        <i className="setting icon" /> My Settings
                    </div>
                    <div className="item" data-value={'logout'} role="menuitem" aria-label="Sign Out" tabIndex="0" >
                        <i className="sign out icon"  /> Sign Out
                    </div>
                </div>
            </div>
        );
    }
}

HeaderDropdown.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default HeaderDropdown;
