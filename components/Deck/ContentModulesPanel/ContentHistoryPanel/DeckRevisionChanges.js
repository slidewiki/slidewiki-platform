import React from 'react';
import {Feed} from 'semantic-ui-react';
import ContentChangeItem from './ContentChangeItem';

class DeckRevisionChanges extends React.Component {

    render() {
        const changes = this.props.changes ? this.props.changes.map((change, index) => {
            return (
            <ContentChangeItem change={change} key={index}/>
            );
        }) : '';

        return (
            <Feed>
                {changes}
            </Feed>
        );
    }
}

DeckRevisionChanges.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DeckRevisionChanges;
