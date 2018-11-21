import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import SlideHistoryStore from '../../../../stores/SlideHistoryStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import PermissionsStore from '../../../../stores/PermissionsStore';
import {List} from 'semantic-ui-react';
import ContentChangeItem from './ContentChangeItem';
import { defineMessages } from 'react-intl';

class SlideHistoryPanel extends React.Component {

    render() {
        const form_messages = defineMessages({
            no_changes: {
                id: 'SlideHistoryPanel.form.no_changes',
                defaultMessage: 'There are no changes for this slide.',
            }
        });
        const changes = this.props.SlideHistoryStore.changes && this.props.SlideHistoryStore.changes.length ? this.props.SlideHistoryStore.changes.map((change, index) => {
            return (
            <ContentChangeItem selector={this.props.selector} permissions={this.props.PermissionsStore.permissions} change={change} key={index}/>
            );
        }) : this.context.intl.formatMessage(form_messages.no_changes);

        return (
        <div ref="slideHistoryPanel" className="ui">
            <List relaxed>
                {changes}
            </List>
        </div>
        );
    }
}

SlideHistoryPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

SlideHistoryPanel = connectToStores(SlideHistoryPanel, [SlideHistoryStore, UserProfileStore, PermissionsStore], (context, props) => {
    return {
        SlideHistoryStore: context.getStore(SlideHistoryStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});
export default SlideHistoryPanel;
