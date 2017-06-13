import React from 'react';
import {List, Icon, Button} from 'semantic-ui-react';
//import moment from 'moment';
import revertRevision from '../../../../actions/history/revertRevision';
import {formatDate} from '../../ActivityFeedPanel/util/ActivityFeedUtil'; //TODO move to common

import {NavLink} from 'fluxible-router';

class ContentChangeItem extends React.Component {

    handleRevertClick() {
        swal({
            text: 'This action will restore the slide to an earlier version. Do you want to continue?',
            type: 'question',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes, restore slide',
            confirmButtonClass: 'ui olive button',
            cancelButtonText: 'No',
            cancelButtonClass: 'ui red button',
            buttonsStyling: false
        }).then((accepted) => {
            this.context.executeAction(revertRevision, {
                selector: this.props.selector, revisionId: this.props.change.value.ref.revision
            });
        }, (reason) => {
            //done(reason);
        });
    }

    handleViewSlideClick() {
        //open the slide revision in a new tab
        window.open('/slideview/' + this.props.change.value.ref.id + '-' + this.props.change.value.ref.revision, '_blank');
    }

    handleDiffViewClick() {
        const {sid, stype} = this.props.selector;
        console.log(this.props);
        // @sid - ID of the current slide
        //TODO: @did (diff id) - ID of the selected slide
        // window.open(`/diffview/${stype}/${sid}/${did}`);
    }

    render() {
        const change = this.props.change;
        const canEdit = this.props.permissions.edit && !this.props.permissions.readOnly;
        let description;
        let iconName = 'write';

        switch (change.action) {
            case 'add':
                iconName = change.value.kind === 'slide'? 'file text' :'folder';
                description = <span>added {change.value.kind} <em>{change.value.ref.title}</em></span>;
                break;
            case 'copy':
                description = <span>created a duplicate of {change.value.kind} <em>{change.value.origin.title}</em> {change.value.origin.id}-{change.value.origin.revision}</span>;
                break;
            case 'attach':
                description = <span>attached {change.value.kind} <em>{change.value.origin.title}</em> {change.value.origin.id}-{change.value.origin.revision}</span>;
                break;
            case 'fork':
                iconName = 'fork';
                description = <span>created a fork of deck <NavLink href={'/deck/' + change.value.origin.id + '-' + change.value.origin.revision}>{change.value.origin.title}</NavLink></span>;
                break;
            case 'revise':
                iconName = 'save';
                description = <span>created a new version of {change.oldValue.kind} <em>{change.oldValue.ref.title}</em></span>;
                break;
            case 'rename':
                description = <span>renamed {change.renamed.kind} <em>{change.renamed.from}</em> to <em>{change.renamed.to}</em></span>;
                break;
            case 'revert':
                iconName='history';
                description = <span>restored {change.oldValue.kind} <em>{change.oldValue.ref.title}</em> to an earlier version</span>;
                break;
            case 'remove':
                iconName = 'trash outline';
                description = <span>removed {change.value.kind} <em>{change.value.ref.title}</em></span>;
                break;
            case 'edit':
                description = <span>edited slide <em>{change.value.ref.title}</em></span>;
                break;
            case 'move':
                iconName = 'move';
                if (this.props.selector.stype === 'slide') {
                    description = 'moved the slide';
                } else if (parseInt(this.props.selector.sid) === change.value.ref.id) {
                    description = 'moved the deck';
                } else {
                    description = <span>moved {change.value.kind} <em>{change.value.ref.title}</em></span>;
                }
                break;
            case 'update':
                description = <span>updated deck <em>{change.path[change.path.length - 1].title}</em></span>;
                break;
            default:
                description = <span>updated the deck</span>;
        }

        // buttons are shown only for slide history and only for changes that result in new slide revisions
        let buttons = this.props.selector.stype === 'slide' && ['add', 'edit', 'rename'].includes(change.action) &&
            <Button.Group basic size='tiny' floated='right'>
                        <Button aria-label='Compare to current slide version' icon='exchange' onClick={this.handleDiffViewClick.bind(this)}/>
                        <Button aria-label='Restore slide' icon='history' disabled={!canEdit}
                                onClick={this.handleRevertClick.bind(this)} tabIndex='0'/>
                        <Button aria-label='View slide' icon tabIndex='0' onClick={this.handleViewSlideClick.bind(this)}>
                            <Icon.Group>
                                <Icon name='unhide'/>
                                <Icon name='external' corner/>
                            </Icon.Group>
                        </Button>
            </Button.Group>;
        const datechange = new Date(change.timestamp);
        return (
            <List.Item>
                <Icon name={iconName} />
                <List.Content style={{width:'100%'}} tabIndex='0'>
                    <List.Header>
                        <NavLink className="user"
                                          href={'/user/' + change.username}> {change.username}</NavLink> {description} {buttons}
                    </List.Header>
                    {/*<List.Description>{moment(change.timestamp).calendar(null, {sameElse: 'lll'})}</List.Description>*/}
                    <List.Description>{formatDate(change.timestamp)}, on { datechange.toLocaleDateString('en-GB')} at {datechange.toLocaleTimeString('en-GB')}</List.Description>
                </List.Content>
            </List.Item>
        );
    };
}

ContentChangeItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ContentChangeItem;
