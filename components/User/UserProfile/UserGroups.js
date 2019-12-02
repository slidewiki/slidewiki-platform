import PropTypes from 'prop-types';
import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import updateUsergroup from '../../../actions/usergroups/updateUsergroup';
import { FormattedMessage, defineMessages } from 'react-intl';
import UserPicture from '../../common/UserPicture';
import {Segment, Header, Button} from 'semantic-ui-react';

class UserGroups extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#1e78bb', 'color': 'white'};

        this.messages = defineMessages({
            error: {
                id: 'UserGroups.error',
                defaultMessage: 'Error',
            },
            unknownError: {
                id: 'UserGroups.unknownError',
                defaultMessage: 'Unknown error while saving.',
            },
            close: {
                id: 'UserGroups.close',
                defaultMessage: 'Close',
            },
            msgError: {
                id: 'UserGroups.msgError',
                defaultMessage: 'Error while deleting the group',
            },
            msgErrorLeaving: {
                id: 'UserGroups.msgErrorLeaving',
                defaultMessage: 'Error while leaving the group',
            },
            member: {
                id: 'UserGroups.member',
                defaultMessage: 'Member',
            },
            members: {
                id: 'UserGroups.members',
                defaultMessage: 'Members',
            },
            groupSettings: {
                id: 'UserGroups.groupSettings',
                defaultMessage: 'Group settings',
            },
            groupDetails: {
                id: 'UserGroups.groupDetails',
                defaultMessage: 'Group details',
            },
            notAGroupmember: {
                id: 'UserGroups.notAGroupmember',
                defaultMessage: 'Not a member of a group.',
            },
            loading: {
                id: 'UserGroups.loading',
                defaultMessage: 'Loading',
            },
            groups: {
                id: 'UserGroups.groups',
                defaultMessage: 'Groups',
            },
            createGroup: {
                id: 'UserGroups.createGroup',
                defaultMessage: 'Create new group',
            },
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error.action !== undefined && this.props.error === '') {
            let message = this.context.intl.formatMessage(this.messages.error) + ': ';
            if (nextProps.error.action === 'leave')
                message = this.context.intl.formatMessage(this.messages.msgErrorLeaving) + ': ';
            swal({
                title: this.context.intl.formatMessage(this.messages.error),
                text: message + nextProps.error.message,
                type: 'error',
                confirmButtonText: this.context.intl.formatMessage(this.messages.close),
                confirmButtonClass: 'negative ui button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false
            })
            .then(() => {
                this.context.executeAction(updateUsergroup, {group: {}, offline: true});

                return true;
            })
            .catch();
            return;
        }
    }

    handleClickNewGroup(e) {
        e.preventDefault();
        this.context.executeAction(updateUsergroup, {group: {}, offline: true});
        this.context.executeAction(navigateAction, {
            url: '/usergroup/0/settings'
        });
    }

    handleClickOnGroupDetails(e) {
        e.preventDefault();

        const action = e.target.attributes.name.value;  //eg. viewGroup_2
        const groupid = action.split('_')[1];

        let group = this.props.groups.find((group) => {
            return group._id.toString() === groupid;
        });

        // console.log('handleClickOnGroupDetails: use group', group);

        this.context.executeAction(navigateAction, {url: '/usergroup/' + group._id});
    }

    render() {
        let items = [];
        // console.log('render userGroups:', this.props.userid, this.props.groups);
        this.props.groups.forEach((group) => {
            items.push( (
                <div key={group._id} className="ui segment" >
                    <div className="ui two column grid container">
                        <div className="left aligned ten wide column">
                            <div className="ui header"><h2>{group.name}</h2></div>
                            <div className="meta">
                              {group.members.length+1} {this.context.intl.formatMessage(((group.members.length+1) !== 1) ? this.messages.members : this.messages.member)}
                            </div>
                        </div>
                        <div className="four wide column">
                            <div className="meta">
                              <UserPicture picture={ group.picture } link={ false } private={ false } width={ 50 } centered={ false } size={ 'mini' } aria-hidden={ 'true' } />
                            </div>
                        </div>
                        <div className="right aligned two wide column">
                            <button className="ui large basic icon button"
                                    data-tooltip={this.context.intl.formatMessage(this.messages.groupDetails)}
                                    aria-label={this.context.intl.formatMessage(this.messages.groupDetails)}
                                    name={'viewGroup_' + group._id}
                                    onClick={this.handleClickOnGroupDetails.bind(this)} >
                                <i className="info icon" name={'viewGroup_' + group._id} ></i>
                            </button>
                        </div>
                    </div>
                </div>
            ));
        });

        if (this.props.groups === undefined || this.props.groups === null || this.props.groups.length < 1) {
            items = [(
                <div key="dummy" className="ui segment" >
                  <div className="ui two column stackable grid container">
                    <h4>{this.context.intl.formatMessage(this.messages.notAGroupmember)}</h4>
                  </div>
                </div>
            )];
        }

        return (
            <Segment.Group>
                <Segment secondary clearing>
                    <Header as="h2" size="medium" floated="left" id="main">{this.context.intl.formatMessage(this.messages.groups)}</Header>
                    <Button 
                        icon="plus" 
                        floated="right" 
                        size='medium' 
                        onClick={this.handleClickNewGroup.bind(this)}
                    >
                        {this.context.intl.formatMessage(this.messages.createGroup)}
                    </Button>
                </Segment>

              {(this.props.status === 'pending') ? <div className="ui active dimmer"><div className="ui text loader">{this.context.intl.formatMessage(this.messages.loading)}</div></div> : ''}

              {items}
            </Segment.Group>
        );
    }
}

UserGroups.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default UserGroups;
