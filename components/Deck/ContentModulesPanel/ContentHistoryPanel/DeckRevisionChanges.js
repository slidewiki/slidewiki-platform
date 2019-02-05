import PropTypes from 'prop-types';
import React from 'react';
import {List} from 'semantic-ui-react';
import ContentChangeItem from './ContentChangeItem';
import { defineMessages } from 'react-intl';

class DeckRevisionChanges extends React.Component {

    render() {
        const form_messages = defineMessages({
            no_changes: {
                id: 'DeckRevisionChanges.form.no_changes',
                defaultMessage: 'There are no changes for this version.',
            }
        });
        const changes = this.props.changes && this.props.changes.length ? this.props.changes.map((change, index) => {
            return (
            <ContentChangeItem selector={this.props.selector} permissions={this.props.permissions} type='deck' change={change} key={index}/>
            );
        }) : this.context.intl.formatMessage(form_messages.no_changes);

        return (
            <List relaxed style={{ 'overflow-y': 'auto', 'max-height': '400px' }}>
                {changes}
            </List>
        );
    }
}

DeckRevisionChanges.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default DeckRevisionChanges;
