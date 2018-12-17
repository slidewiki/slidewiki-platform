import PropTypes from 'prop-types';
import React from 'react';
import {List, Icon, Button} from 'semantic-ui-react';
//import moment from 'moment';
import revertRevision from '../../../../actions/history/revertRevision';
import {formatDate} from '../../ActivityFeedPanel/util/ActivityFeedUtil'; //TODO move to common

import cheerio from 'cheerio';
import {NavLink} from 'fluxible-router';

import {getLanguageName, getLanguageNativeName} from '../../../../common';
import { defineMessages } from 'react-intl';

class ContentChangeItem extends React.Component {

    handleRevertClick() {
        const swal_messages = defineMessages({
            text: {
                id: 'ContentChangeItem.swal.text',
                defaultMessage: 'This action will restore the slide to an earlier version. Do you want to continue?',
            },
            confirmButtonText: {
                id: 'ContentChangeItem.swal.confirmButtonText',
                defaultMessage: 'Yes, restore slide',
            },
            cancelButtonText: {
                id: 'ContentChangeItem.swal.cancelButtonText',
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
                selector: this.props.selector, revisionId: this.props.change.oldValue.ref.revision
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
        const { sid, stype } = this.props.selector;
        const did = this.props.change.value.ref.revision;
        window.open(`/diffview/${stype}/${sid}/${did}`);
    }

    render() {
        const form_messages = defineMessages({
            add_description: {
                id: 'ContentChangeItem.form.add_description',
                defaultMessage: 'added',
            },
            copy_description: {
                id: 'ContentChangeItem.form.copy_description',
                defaultMessage: 'created a duplicate of',
            },
            attach_description: {
                id: 'ContentChangeItem.form.attach_description',
                defaultMessage: 'attached',
            },
            fork_description: {
                id: 'ContentChangeItem.form.fork_description',
                defaultMessage: 'created a fork of deck',
            },
            translate_description_added: {
                id: 'ContentChangeItem.form.translate_description_added',
                defaultMessage: 'added',
            },
            translate_description_translation: {
                id: 'ContentChangeItem.form.translate_description_translation',
                defaultMessage: 'translation for',
            },
            revise_description: {
                id: 'ContentChangeItem.form.revise_description',
                defaultMessage: 'created a new version of',
            },
            rename_description_renamed: {
                id: 'ContentChangeItem.form.rename_description_renamed',
                defaultMessage: 'renamed',
            },
            rename_description_to: {
                id: 'ContentChangeItem.form.rename_description_to',
                defaultMessage: 'to',
            },
            revert_description_restored: {
                id: 'ContentChangeItem.form.revert_description_restored',
                defaultMessage: 'restored',
            },
            revert_description_to: {
                id: 'ContentChangeItem.form.revert_description_to',
                defaultMessage: 'to an earlier version',
            },
            remove_description: {
                id: 'ContentChangeItem.form.remove_description',
                defaultMessage: 'removed',
            },
            edit_description_slide_translation: {
                id: 'ContentChangeItem.form.edit_description_slide_translation',
                defaultMessage: 'edited slide translation',
            },
            edit_description_slide: {
                id: 'ContentChangeItem.form.edit_description_slide',
                defaultMessage: 'edited slide',
            },
            move_description_slide: {
                id: 'ContentChangeItem.form.move_description_slide',
                defaultMessage: 'moved the slide',
            },
            move_description_deck: {
                id: 'ContentChangeItem.form.move_description_deck',
                defaultMessage: 'moved the deck',
            },
            move_description: {
                id: 'ContentChangeItem.form.move_description',
                defaultMessage: 'moved',
            },
            update_description: {
                id: 'ContentChangeItem.form.update_description',
                defaultMessage: 'updated deck',
            },
            default_description: {
                id: 'ContentChangeItem.form.default_description',
                defaultMessage: 'updated the deck',
            },
            button_compare: {
                id: 'ContentChangeItem.form.button_compare',
                defaultMessage: 'Compare to current slide version',
            },
            button_restore: {
                id: 'ContentChangeItem.form.button_restore',
                defaultMessage: 'Restore slide',
            },
            button_view: {
                id: 'ContentChangeItem.form.button_view',
                defaultMessage: 'View slide',
            },
            date_on: {
                id: 'ContentChangeItem.form.date_on',
                defaultMessage: 'on',
            },
            date_at: {
                id: 'ContentChangeItem.form.date_at',
                defaultMessage: 'at',
            }
        });
        let change = this.props.change;

        let description, actionText;
        let iconName = 'write';

        if (change.value && change.value.ref) {
            change.value.ref.title = cheerio.load(change.value.ref.title).text();
        }
        if (change.value && change.value.origin) {
            change.value.origin.title = cheerio.load(change.value.origin.title).text();
        }
        if (change.oldValue && change.oldValue.ref) {
            change.oldValue.ref.title = cheerio.load(change.oldValue.ref.title).text();
        }
        if (change.translated) {
            change.translated.title = cheerio.load(change.translated.title).text();
        }
        switch (change.action) {
            case 'add':
                iconName = change.value.kind === 'slide'? 'file text' :'folder';
                description = <span>{this.context.intl.formatMessage(form_messages.add_description) + ' ' + change.value.kind} <em>{change.value.ref.title}</em></span>;
                break;
            case 'copy':
                description = <span>{this.context.intl.formatMessage(form_messages.copy_description) + ' ' + change.value.kind} <em>{change.value.origin.title}</em> {change.value.origin.id}-{change.value.origin.revision}</span>;
                break;
            case 'attach':
                iconName = change.value.kind === 'slide'? 'file text' :'folder';
                description = <span>{this.context.intl.formatMessage(form_messages.attach_description) + ' ' + change.value.kind} <em>{change.value.origin.title}</em> {change.value.origin.id}-{change.value.origin.revision}</span>;
                break;
            case 'fork':
                iconName = 'fork';
                description = <span>{this.context.intl.formatMessage(form_messages.fork_description) + ' '} <NavLink href={'/deck/' + change.value.origin.id + '-' + change.value.origin.revision}>{change.value.origin.title}</NavLink></span>;
                break;
            case 'translate':
                iconName = 'translate';
                description =
                    <span>{this.context.intl.formatMessage(form_messages.translate_description_added) + ' ' + getLanguageName(change.translated.language) + ' ' + this.context.intl.formatMessage(form_messages.translate_description_translation) + ' ' + change.translated.kind} <em>{change.translated.title}</em>
                    </span>;
                break;
            case 'revise':
                iconName = 'save';
                description = <span>{this.context.intl.formatMessage(form_messages.revise_description) + ' ' + change.oldValue.kind} <em>{change.oldValue.ref.title}</em></span>;
                break;
            case 'rename':
                description = <span>{this.context.intl.formatMessage(form_messages.rename_description_renamed) + ' ' + change.renamed.kind} <em>{change.renamed.from}</em> {this.context.intl.formatMessage(form_messages.rename_description_to)} <em>{change.renamed.to}</em></span>;
                break;
            case 'revert':
                iconName='history';
                description = <span>{this.context.intl.formatMessage(form_messages.revert_description_restored) + ' ' + change.oldValue.kind} <em>{change.oldValue.ref.title}</em> {this.context.intl.formatMessage(form_messages.revert_description_to)}</span>;
                break;
            case 'remove':
                iconName = 'trash alternate';
                description = <span>{this.context.intl.formatMessage(form_messages.remove_description) + ' ' + change.value.kind} <em>{change.value.ref.title}</em></span>;
                break;
            case 'edit':
                actionText = this.context.intl.formatMessage(change.value.variant ? form_messages.edit_description_slide_translation : form_messages.edit_description_slide);
                description = <span>{actionText} <em>{change.value.ref.title}</em></span>;
                break;
            case 'move':
                iconName = 'move';
                if (this.props.selector.stype === 'slide') {
                    description = this.context.intl.formatMessage(form_messages.move_description_slide);
                } else if (parseInt(this.props.selector.sid) === change.value.ref.id) {
                    description = this.context.intl.formatMessage(form_messages.move_description_deck);
                } else {
                    description = <span>{this.context.intl.formatMessage(form_messages.move_description) + ' ' + change.value.kind} <em>{change.value.ref.title}</em></span>;
                }
                break;
            case 'update':
                description = <span>{this.context.intl.formatMessage(form_messages.update_description)} <em>{change.path[change.path.length - 1].title}</em></span>;
                break;
            default:
                description = <span>{this.context.intl.formatMessage(form_messages.default_description)}</span>;
        }

        let buttons;
        if (this.props.selector.stype === 'slide' && ['add', 'attach', 'copy', 'edit', 'rename', 'revert'].includes(change.action) ) {
            // buttons are shown only for slide history and only for changes that result in new slide revisions

            const canEdit = this.props.permissions.edit && !this.props.permissions.readOnly;
            const isCurrent = this.props.selector.sid === `${this.props.change.value.ref.id}-${this.props.change.value.ref.revision}`;

            const currentRev = parseInt(this.props.selector.sid.split('-')[1]);
            const shouldView = currentRev !== change.value.ref.revision;

            const canRestore = this.props.permissions.edit && !this.props.permissions.readOnly
                && change.oldValue && currentRev !== change.oldValue.ref.revision;

            buttons = <Button.Group basic size='tiny' floated='right'>
                            <Button aria-label={this.context.intl.formatMessage(form_messages.button_compare)} icon='exchange' disabled={isCurrent} onClick={this.handleDiffViewClick.bind(this)}/>
                            <Button aria-label={this.context.intl.formatMessage(form_messages.button_restore)} icon='history' disabled={!canEdit || !canRestore}
                                onClick={this.handleRevertClick.bind(this)} tabIndex='0'/>
                        <Button aria-label={this.context.intl.formatMessage(form_messages.button_view)} icon tabIndex='0' disabled={!shouldView} onClick={this.handleViewSlideClick.bind(this)}>
                            <Icon.Group>
                                <Icon name='unhide'/>
                                <Icon name='external' corner/>
                            </Icon.Group>
                        </Button>
            </Button.Group>;
        }

        const datechange = new Date(change.timestamp);
        return (
            <List.Item>
                <Icon name={iconName} />
                <List.Content style={{width:'100%'}} tabIndex='0'>
                    <List.Header>
                        <NavLink className="user"
                                          href={'/user/' + change.username}> {change.userDisplayName}</NavLink> {description} {buttons}
                    </List.Header>
                    {/*<List.Description>{moment(change.timestamp).calendar(null, {sameElse: 'lll'})}</List.Description>*/}
                    <List.Description>{formatDate(change.timestamp) + ', ' + this.context.intl.formatMessage(form_messages.date_on) + ' ' + datechange.toLocaleDateString('en-GB') + ' ' + this.context.intl.formatMessage(form_messages.date_at) + ' ' + datechange.toLocaleTimeString('en-GB')}</List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

ContentChangeItem.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default ContentChangeItem;
