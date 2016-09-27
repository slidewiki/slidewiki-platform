import React from 'react';
import { NavLink } from 'fluxible-router';
import UserPicture from '../common/UserPicture';
import { connectToStores } from 'fluxible-addons-react';
import userSignOut from '../../actions/user/userSignOut';
import UserProfileStore from '../../stores/UserProfileStore';
import fetchUser from '../../actions/user/userprofile/fetchUser';

class HeaderDropdown extends React.Component {
    componentDidMount(){
        $(this.refs.userDropDown).dropdown({action: 'select'});//{on: 'hover', action: 'nothing'}
        if(this.props.UserProfileStore.userpicture === undefined)
            this.context.executeAction(fetchUser,{ params: {username: this.props.UserProfileStore.username}, onlyPicture: true});
    }

    componentDidUpdate() {
        $(this.refs.userDropDown).dropdown({action: 'select'});//{on: 'hover', action: 'nothing'}
        if(this.props.UserProfileStore.userpicture === undefined)
            this.context.executeAction(fetchUser, { params: {username: this.props.UserProfileStore.username}, onlyPicture: true});
    }

    handleSignout() {
        this.context.executeAction(userSignOut, {});
    }

    render() {
        let pic = (this.props.UserProfileStore.userpicture === undefined) ? '' : this.props.UserProfileStore.userpicture;
        return(
            <div className="ui top right pointing dropdown" ref="userDropDown">
                <div className="text">
                    <UserPicture picture={ pic } username={ this.props.UserProfileStore.username } avatar={ true } width= { 50 }/>
                </div>
                <div className="menu">
                    <div className="header">
                        <h4>{this.props.UserProfileStore.username}</h4>
                    </div>
                    <div className="divider"></div>
                    <NavLink className="item" href={ '/user/' + this.props.UserProfileStore.username }>
                        <i className="user icon link"/> My Profile
                    </NavLink>
                    <NavLink className="item" href={ '/user/' + this.props.UserProfileStore.username + '/settings' }>
                        <i className="setting icon"/> My Settings
                    </NavLink>
                    <div className="item">
                        <div onClick={ this.handleSignout.bind(this) }><i className="sign out icon"/> Sign Out</div>
                    </div>
                </div>
            </div>
      );
    }
}

HeaderDropdown.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

HeaderDropdown = connectToStores(HeaderDropdown, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default HeaderDropdown;
