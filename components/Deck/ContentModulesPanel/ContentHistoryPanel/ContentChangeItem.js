import React from 'react';
import {Feed, Icon, Button} from 'semantic-ui-react';
import moment from 'moment';
import revertRevision from '../../../../actions/history/revertRevision';
import {NavLink} from 'fluxible-router';

class ContentChangeItem extends React.Component {

    handleRevertClick() {
        this.context.executeAction(revertRevision, {
            selector: this.props.selector, revisionId: this.props.change.value.ref.revision
        });
    }

    render() {
        const change = this.props.change;
        const canEdit = this.props.userid !== '' && this.props.permissions.edit && !this.props.permissions.readOnly;
        let actionVerb, actionObj;

        switch (change.action) {
            case 'add':
                actionVerb = 'added';
                actionObj = change.value.kind + ' "' + change.value.ref.title + '"';
                break;
            case 'revise':
                actionVerb = 'created a new version of';
                actionObj = change.oldValue.kind + ' "' + change.oldValue.ref.title + '"';
                break;
            case 'rename':
                actionVerb = 'renamed';
                actionObj = change.oldValue.kind + ' "' + change.oldValue.ref.title + '"';
                break;
            case 'revert':
                actionVerb = 'restored';
                actionObj = change.oldValue.kind + ' "' + change.oldValue.ref.title + '" to an earlier version';
                break;
            case 'remove':
                actionVerb = 'removed';
                actionObj = change.value.kind + ' "' + change.value.ref.title + '"';
                break;
            case 'replace':
                actionVerb = 'edited';
                actionObj = change.value.kind + ' "' + change.value.ref.title + '"';
                break;
            case 'move':
                actionVerb = 'moved';
                actionObj = change.value.kind + ' "' + change.value.ref.title + '"';
                break;
            default:
                actionVerb = 'updated';
                actionObj = 'the deck';
        }

        let buttons = this.props.selector.stype === 'slide' && ['add', 'replace', 'rename'].includes(change.action) ? <span><Button.Group basic size='tiny' floated='right'>
                        <Button aria-label='Compare to current slide version' icon='exchange' disabled/>
                        <Button aria-label='Restore slide' icon='history' disabled={!canEdit} onClick={this.handleRevertClick.bind(this)} />
                        <Button aria-label='View slide' icon>
                            <Icon.Group>
                                <Icon name='unhide'/>
                                <Icon name='external' corner/>
                            </Icon.Group>
                        </Button>
                    </Button.Group></span> : '';

        return (
        <Feed.Event>
            <Feed.Label>
                <Icon name='pencil'/>
            </Feed.Label>
            <Feed.Content>
                <Feed.Date>{moment(change.timestamp).calendar(null, {sameElse: 'lll'})}</Feed.Date>
                <Feed.Summary>
                    <NavLink className="user"
                             href={'/user/' + change.username}> {change.username}</NavLink> {actionVerb + ' ' + actionObj}
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
