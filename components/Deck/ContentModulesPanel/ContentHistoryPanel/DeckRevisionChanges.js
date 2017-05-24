import React from 'react';
import {Feed, Icon} from 'semantic-ui-react';
import moment from 'moment';
import {NavLink} from 'fluxible-router';

class DeckRevisionChanges extends React.Component {

    render() {
        const changes = this.props.changes ? this.props.changes.map((change, index) => {
            let opVerb, opObj;
            switch (change.op) {
                case 'add':
                    opVerb = 'added';
                    opObj = change.value.kind + ' "' + change.value.ref.title + '"';
                    break;
                case 'replace':
                    opVerb = 'updated';
                    opObj = change.oldValue.kind + ' "' + change.oldValue.ref.title + '"';
                    break;
                default:
                    opVerb = 'updated';
                    opObj = 'the deck';
            }

            return (
            <Feed.Event key={index}>
                <Feed.Label>
                    <Icon name='pencil'/>
                </Feed.Label>
                <Feed.Content>
                    <Feed.Date>{moment(change.timestamp).calendar(null, {sameElse: 'lll'})}</Feed.Date>
                    <Feed.Summary>
                        <NavLink className="user" href={'/user/' + change.username}> {change.username}</NavLink> {opVerb + ' ' + opObj}
                    </Feed.Summary>
                </Feed.Content>
            </Feed.Event>
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
