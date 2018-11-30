import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckHistoryStore from '../../../../stores/DeckHistoryStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import PermissionsStore from '../../../../stores/PermissionsStore';
import createRevision from '../../../../actions/history/createRevision';
import DeckRevision from './DeckRevision';
import {Button, Divider, List} from 'semantic-ui-react';
import { defineMessages } from 'react-intl';

class DeckHistoryPanel extends React.Component {

    handleCreateRevisionClick() {
        const swal_messages = defineMessages({
            text: {
                id: 'DeckHistoryPanel.swal.text',
                defaultMessage: 'This action will create a new version for this deck. Do you want to continue?',
            },
            confirmButtonText: {
                id: 'DeckHistoryPanel.swal.confirmButtonText',
                defaultMessage: 'Yes, create a new version',
            },
            cancelButtonText: {
                id: 'DeckHistoryPanel.swal.cancelButtonText',
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
            this.context.executeAction(createRevision, {
                id: this.props.selector.id.split('-')[0]
            });
        }, (reason) => {
            //done(reason);
        });
    }

    render() {
        const form_messages = defineMessages({
            button_aria: {
                id: 'DeckHistoryPanel.form.button_aria',
                defaultMessage: 'Create a new version of this deck',
            },
            button_content: {
                id: 'DeckHistoryPanel.form.button_content',
                defaultMessage: 'Create a new version',
            }
        });
        let selector = this.props.selector;
        let isRoot = selector.stype === 'deck' && selector.id === selector.sid;
        let deckRevisions = this.props.DeckHistoryStore.revisions.map((revision) => {
            return (
            <DeckRevision key={revision.id} revision={revision}
                          changes={this.props.DeckHistoryStore.changes[revision.id]} selector={selector}
                          userid={this.props.UserProfileStore.userid}
                          permissions={this.props.PermissionsStore.permissions}/>
            );
        });
        return (
        <div ref="deckHistoryPanel" className="ui">
            {isRoot && this.props.PermissionsStore.permissions.edit && !this.props.PermissionsStore.permissions.readOnly ?
            <div><Button positive aria-label={this.context.intl.formatMessage(form_messages.button_aria)} size='small' floated='right'
                         icon='plus'
                         content={this.context.intl.formatMessage(form_messages.button_content)} onClick={this.handleCreateRevisionClick.bind(this)}/>
                <Divider hidden clearing/></div> : ''}
            <List relaxed verticalAlign='middle'>
                {deckRevisions}
            </List>
        </div>
        );
    }
}

DeckHistoryPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

DeckHistoryPanel = connectToStores(DeckHistoryPanel, [DeckHistoryStore, UserProfileStore, PermissionsStore], (context, props) => {
    return {
        DeckHistoryStore: context.getStore(DeckHistoryStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});
export default DeckHistoryPanel;
