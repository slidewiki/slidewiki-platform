import React from 'react';
import revertRevision from '../../../../actions/history/revertRevision';
import showRevisionChanges from '../../../../actions/history/showRevisionChanges';
import hideRevisionChanges from '../../../../actions/history/hideRevisionChanges';
import {List, Button, Icon, Header, Segment} from 'semantic-ui-react';
import DeckRevisionChanges from './DeckRevisionChanges';
//import moment from 'moment';
import {formatDate} from '../../ActivityFeedPanel/util/ActivityFeedUtil'; //TODO move to common

class DeckRevision extends React.Component {

    handleExpandClick() {
        if (this.props.revision.expanded) {
            this.context.executeAction(hideRevisionChanges, {
                revisionId: this.props.revision.id
            });
        } else {
            this.context.executeAction(showRevisionChanges, {
                deckId: this.props.selector.sid.split('-')[0],
                revisionId: this.props.revision.id
            });
        }
    }

    handleViewRevisionClick() {
        //open the deck revision in a new tab
        window.open('/deck/' + this.props.selector.sid.split('-')[0] + '-' + this.props.revision.id, '_blank');
    }


    handleRevertClick() {
        swal({
            text: 'This action will restore the deck to an earlier version. Do you want to continue?',
            type: 'question',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes, restore deck',
            confirmButtonClass: 'ui olive button',
            cancelButtonText: 'No',
            cancelButtonClass: 'ui red button',
            buttonsStyling: false
        }).then((accepted) => {
            this.context.executeAction(revertRevision, {
                selector: this.props.selector, revisionId: this.props.revision.id
            });
        }, (reason) => {
            //done(reason);
        });
    }

    render() {
        const revision = this.props.revision;
        const canEdit = this.props.permissions.edit && !this.props.permissions.readOnly;
        let segmentStyle = {
            'overflow-y': 'auto',
            'max-height': '400px'
        };
        const datechange = new Date(revision.lastUpdate);
        return (
            <List.Item>
                <List.Content tabIndex='0'>
                    <List.Header><Icon color='grey' name='save' size='large' className='outline'
                                       aria-label='Saved at'/>
                        <span>{formatDate(revision.lastUpdate)}, on { datechange.toLocaleDateString('en-GB')} at {datechange.toLocaleTimeString('en-GB')}{/*moment(revision.lastUpdate).calendar(null, {sameElse: 'lll'})*/} by <a
                        className="user"
                        href={'/user/' + revision.username}> {revision.username}</a>
                            </span>
                        <Button basic floated='right' size='tiny' aria-label='expand details'
                                icon='ellipsis horizontal'
                                onClick={this.handleExpandClick.bind(this)}/>
                    </List.Header>
                    {revision.expanded &&
                        <Segment style={segmentStyle}>
                            <Header size='small'>Version changes
                                {revision.latest ? '' :
                                    <Button.Group basic size='tiny' floated='right'>
                                        <Button aria-label='Compare to current deck' icon='exchange' disabled/>
                                        <Button aria-label='Restore deck' icon='history' disabled={!canEdit}
                                                onClick={this.handleRevertClick.bind(this)} tabIndex='0'/>
                                        <Button aria-label='View deck in new tab' icon
                                                onClick={this.handleViewRevisionClick.bind(this)} tabIndex='0'>
                                            <Icon.Group>
                                                <Icon name='unhide'/>
                                                <Icon name='external' corner/>
                                            </Icon.Group>
                                        </Button>
                                    </Button.Group>
                                }
                            </Header>
                            <DeckRevisionChanges selector={this.props.selector} permissions={this.props.permissions}
                                                 changes={this.props.changes}/>
                        </Segment>
                    }
                </List.Content>
            </List.Item>
        );
    }
}

DeckRevision.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DeckRevision;
