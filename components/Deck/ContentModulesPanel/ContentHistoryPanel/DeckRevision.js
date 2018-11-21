import PropTypes from 'prop-types';
import React from 'react';
import revertRevision from '../../../../actions/history/revertRevision';
import showRevisionChanges from '../../../../actions/history/showRevisionChanges';
import hideRevisionChanges from '../../../../actions/history/hideRevisionChanges';
import {List, Button, Icon, Header, Segment, Divider} from 'semantic-ui-react';
import DeckRevisionChanges from './DeckRevisionChanges';
//import moment from 'moment';
import {formatDate} from '../../ActivityFeedPanel/util/ActivityFeedUtil'; //TODO move to common
import { defineMessages } from 'react-intl';

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
        const redirectId = this.props.selector.sid.split('-')[0] + '-' + this.props.revision.id;
        window.open(`/deck/${redirectId}/_/deck/${redirectId}`, '_blank');
    }


    handleRevertClick() {
        const swal_messages = defineMessages({
            text: {
                id: 'DeckRevision.swal.text',
                defaultMessage: 'This action will restore the deck to an earlier version. Do you want to continue?',
            },
            confirmButtonText: {
                id: 'DeckRevision.swal.confirmButtonText',
                defaultMessage: 'Yes, restore deck',
            },
            cancelButtonText: {
                id: 'DeckRevision.swal.cancelButtonText',
                defaultMessage: 'No',
            }
        });
        swal({
            text: context.intl.formatMessage(swal_messages.text),
            type: 'question',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: context.intl.formatMessage(swal_messages.confirmButtonText),
            confirmButtonClass: 'ui olive button',
            cancelButtonText: context.intl.formatMessage(swal_messages.cancelButtonText),
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
        const form_messages = defineMessages({
            icon_aria_saved: {
                id: 'DeckRevision.form.icon_aria_saved',
                defaultMessage: 'Saved at',
            },
            date_on: {
                id: 'DeckRevision.form.date_on',
                defaultMessage: 'on',
            },
            date_at: {
                id: 'DeckRevision.form.date_at',
                defaultMessage: 'at',
            },
            by: {
                id: 'DeckRevision.form.by',
                defaultMessage: 'by',
            },
            button_aria_show: {
                id: 'DeckRevision.form.button_aria_show',
                defaultMessage: 'Show details',
            },
            version_changes: {
                id: 'DeckRevision.form.header',
                defaultMessage: 'Version changes',
            },
            button_aria_restore: {
                id: 'DeckRevision.form.button_aria_restore',
                defaultMessage: 'Restore deck',
            },
            button_aria_view: {
                id: 'DeckRevision.form.button_aria_view',
                defaultMessage: 'View deck in new tab',
            }
        });
        const revision = this.props.revision;
        const canEdit = this.props.permissions.edit && !this.props.permissions.readOnly;
        const datechange = new Date(revision.lastUpdate);
        return (
            <List.Item>
                <List.Content tabIndex='0'>
                    <List.Header><Icon color='grey' name='save' size='large' className='outline'
                                       aria-label={this.context.intl.formatMessage(form_messages.icon_aria_saved)}/>
                        <span>{formatDate(revision.lastUpdate) + ', ' + this.context.intl.formatMessage(form_messages.date_on) + ' ' + datechange.toLocaleDateString('en-GB') + ' ' + this.context.intl.formatMessage(form_messages.date_at) + ' ' + datechange.toLocaleTimeString('en-GB')}{/*moment(revision.lastUpdate).calendar(null, {sameElse: 'lll'})*/} {this.context.intl.formatMessage(form_messages.by)} <a
                        className="user"
                        href={'/user/' + revision.username}> {revision.userDisplayName}</a>
                            </span>
                        <Button basic floated='right' size='tiny'
                                aria-label={this.context.intl.formatMessage(form_messages.button_aria_show)} data-tooltip={this.context.intl.formatMessage(form_messages.button_aria_show)}
                                icon='ellipsis horizontal'
                                onClick={this.handleExpandClick.bind(this)}/>
                    </List.Header>
                    {revision.expanded &&
                        <Segment>
                            <Header size='small'>{this.context.intl.formatMessage(form_messages.version_changes)}
                                {revision.latest ? '' :
                                    <Button.Group basic size='tiny' floated='right'>
                                        <Button icon='history' disabled={!canEdit}
                                                aria-label={this.context.intl.formatMessage(form_messages.button_aria_restore)} data-tooltip={this.context.intl.formatMessage(form_messages.button_aria_restore)}
                                                onClick={this.handleRevertClick.bind(this)} tabIndex='0'/>
                                        <Button icon aria-label={this.context.intl.formatMessage(form_messages.button_aria_view)} data-tooltip={this.context.intl.formatMessage(form_messages.button_aria_view)}
                                                onClick={this.handleViewRevisionClick.bind(this)} tabIndex='0'>
                                            <Icon.Group>
                                                <Icon name='unhide'/>
                                                <Icon name='external' corner/>
                                            </Icon.Group>
                                        </Button>
                                    </Button.Group>
                                }
                            </Header>
                            <Divider clearing hidden fitted/>
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
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default DeckRevision;
