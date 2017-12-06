import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
// import updateUsergroup from '../../../actions/user/userprofile/updateUsergroup';
// import deleteUsergroup from '../../../actions/user/userprofile/deleteUsergroup';
// import leaveUsergroup from '../../../actions/user/userprofile/leaveUsergroup';

class UserDeckGroups extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.error.action !== undefined && this.props.error === '') {
        //     let message = 'Error while deleting the group: ';
        //     if (nextProps.error.action === 'leave')
        //         message = 'Error while leaving the group: ';
        //     swal({
        //         title: 'Error',
        //         text: message + nextProps.error.message,
        //         type: 'error',
        //         confirmButtonText: 'Close',
        //         confirmButtonClass: 'negative ui button',
        //         allowEscapeKey: false,
        //         allowOutsideClick: false,
        //         buttonsStyling: false
        //     })
        //     .then(() => {
        //         this.context.executeAction(updateUsergroup, {group: {}, offline: true});

        //         return true;
        //     })
        //     .catch();
        //     return;
        // }
    }

    handleClickOnEditGroup(e) {
        // e.preventDefault();
        // console.log('handleClickOnEditGroup:', e.target.attributes.name.nodeValue);

        // const action = e.target.attributes.name.nodeValue;  //eg. changeGroup_2
        // const groupid = action.split('_')[1];

        // let group = this.props.groups.find((group) => {
        //     return group._id.toString() === groupid;
        // });

        // console.log('handleClickOnEditGroup: use group', group);

        // this.context.executeAction(updateUsergroup, {group: group, offline: false});

        // this.context.executeAction(navigateAction, {
        //     url: '/user/' + this.props.username + '/groups/edit'
        // });
    }

    handleClickOnRemoveGroup(e) {
        // e.preventDefault();
        // console.log('handleClickOnRemoveGroup:', e.target.attributes.name.nodeValue);

        // const action = e.target.attributes.name.nodeValue;  //eg. changeGroup_2
        // const groupid = action.split('_')[1];

        // this.context.executeAction(deleteUsergroup, {groupid: groupid});
    }

    handleClickOnLeaveGroup(e) {
        // e.preventDefault();
        // console.log('handleClickOnLeaveGroup:', e.target.attributes.name.nodeValue);

        // const action = e.target.attributes.name.nodeValue;  //eg. changeGroup_2
        // const groupid = action.split('_')[1];

        // this.context.executeAction(leaveUsergroup, {groupid: groupid});
    }

    handleCLickNewGroup(e) {
        // e.preventDefault();
        // this.context.executeAction(updateUsergroup, {group: {}, offline: true});
        // this.context.executeAction(navigateAction, {
        //     url: '/user/' + this.props.username + '/groups/edit'
        // });
    }

    render() {
        let content = '';
        let myCollections = [];
        let sharedCollections = [];

        // error loading deck collections
        if(this.props.error){
            content = (
                <h3>An error occurred while fetching deck collections. Please try again later.</h3>
            );
        } else {
            let collections = this.props.collections.documents;

            if(collections.length === 0){
                content = (
                    <h3>No deck collections available</h3>
                );
            } else {

                // filter loggedin user's collections
                myCollections = collections.filter( (col) => {
                    return (col.user === this.props.user.id);
                });

                // filter shared collections
                
                sharedCollections = collections.filter( (col) => {
                    return (col.user !== this.props.user.id);
                });
            }
        }
        return (
            <div className="ui segments">
                {(this.props.collections === undefined) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                <div className="ui secondary clearing segment">
                    <h2 className="ui left floated header">{(this.props.loggedinuser === this.props.user.uname) ? 'My Deck Collections' : 'Owned Deck Collections' }</h2>
                </div>
                <div className="ui segment">
                    {content}
                    myCollections
                    {JSON.stringify(myCollections)}
                    sharedCollections
                    {JSON.stringify(sharedCollections)}
                </div>
            </div>
        );
    }
}

UserDeckGroups.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserDeckGroups;
