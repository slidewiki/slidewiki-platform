import React from 'react';
import {Feed, Icon, Button} from 'semantic-ui-react';
import moment from 'moment';
import revertRevision from '../../../../actions/history/revertRevision';
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
            <span>
                <Button.Group basic size='tiny' floated='right'>
                            <Button aria-label='Compare to current slide version' icon='exchange' disabled/>
                            <Button aria-label='Restore slide' icon='history' disabled={!canEdit}
                                    onClick={this.handleRevertClick.bind(this)}/>
                            <Button aria-label='View slide' icon>
                                <Icon.Group>
                                    <Icon name='unhide'/>
                                    <Icon name='external' corner/>
                                </Icon.Group>
                            </Button>
                </Button.Group>
            </span>;

        return (
        <Feed.Event>
            <Feed.Label>
                <Icon name={iconName}/>
            </Feed.Label>
            <Feed.Content>
                <Feed.Date>{moment(change.timestamp).calendar(null, {sameElse: 'lll'})}</Feed.Date>
                <Feed.Summary>
                    <NavLink className="user"
                             href={'/user/' + change.username}> {change.username}</NavLink> {description}
                    {buttons}
                </Feed.Summary>
            </Feed.Content>
        </Feed.Event>
        );
    };
}

ContentChangeItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ContentChangeItem;
