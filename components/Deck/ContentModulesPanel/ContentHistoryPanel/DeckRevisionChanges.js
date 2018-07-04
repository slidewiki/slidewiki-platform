import PropTypes from 'prop-types';
import React from 'react';
import {List} from 'semantic-ui-react';
import ContentChangeItem from './ContentChangeItem';

class DeckRevisionChanges extends React.Component {

    render() {
        const changes = this.props.changes && this.props.changes.length ? this.props.changes.map((change, index) => {
            return (
            <ContentChangeItem selector={this.props.selector} permissions={this.props.permissions} type='deck' change={change} key={index}/>
            );
        }) : 'There are no changes for this version.';

        return (
            <List relaxed style={{ 'overflow-y': 'auto', 'max-height': '400px' }}>
                {changes}
            </List>
        );
    }
}

DeckRevisionChanges.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

export default DeckRevisionChanges;
