import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckHistoryStore from '../../../../stores/DeckHistoryStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import PermissionsStore from '../../../../stores/PermissionsStore';
import createRevision from '../../../../actions/history/createRevision';
import DeckRevision from './DeckRevision';
import {Button, Divider, List} from 'semantic-ui-react';

class DeckHistoryPanel extends React.Component {

    handleCreateRevisionClick() {
        swal({
            text: 'This action will create a new version for this deck. Do you want to continue?',
            type: 'question',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes, create a new version',
            confirmButtonClass: 'ui olive button',
            cancelButtonText: 'No',
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
        let selector = this.props.selector;
        let isRoot = selector.stype === 'deck' && selector.id === selector.sid;
        let deckRevisions = this.props.DeckHistoryStore.revisions.map((revision, index) => {
            return (
            <DeckRevision key={revision.id} allowUndoDelete={index === 0} revision={revision}
                          changes={this.props.DeckHistoryStore.changes[revision.id]} selector={selector}
                          userid={this.props.UserProfileStore.userid}
                          permissions={this.props.PermissionsStore.permissions}/>
            );
        });
        return (
        <div ref="deckHistoryPanel" className="ui">
            {isRoot && this.props.PermissionsStore.permissions.edit && !this.props.PermissionsStore.permissions.readOnly ?
            <div><Button positive aria-label='Create a new version of this deck' size='small' floated='right'
                         icon='plus'
                         content='Create a new version' onClick={this.handleCreateRevisionClick.bind(this)}/>
                <Divider hidden clearing/></div> : ''}
            <List relaxed verticalAlign='middle'>
                {deckRevisions}
            </List>
        </div>
        );
    }
}

DeckHistoryPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

DeckHistoryPanel = connectToStores(DeckHistoryPanel, [DeckHistoryStore, UserProfileStore, PermissionsStore], (context, props) => {
    return {
        DeckHistoryStore: context.getStore(DeckHistoryStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});
export default DeckHistoryPanel;
