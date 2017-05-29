import React from 'react';
import {Feed, Icon} from 'semantic-ui-react';
import moment from 'moment';
import {NavLink} from 'fluxible-router';

class DeckRevisionChanges extends React.Component {

    render() {
        const changes = this.props.changes ? this.props.changes.map((change, index) => {
            let actionVerb, actionObj;
            switch (change.action) {
                case 'add':
                    actionVerb = 'added';
                    actionObj = change.value.kind + ' "' + change.value.ref.title + '"';
                    break;
                case 'revise':
                    actionVerb = 'created a new version of';
                    actionObj = change.oldValue.kind + ' "' + change.oldValue.ref.title + '"';
                    break;
                case 'rename':
                    actionVerb = 'renamed';
                    actionObj = change.oldValue.kind + ' "' + change.oldValue.ref.title + '"';
                    break;
                case 'revert':
                    actionVerb = 'restored';
                    actionObj = change.oldValue.kind + ' "' + change.oldValue.ref.title + '" to an earlier version';
                    break;
                case 'remove':
                    actionVerb = 'removed';
                    actionObj = change.value.kind + ' "' + change.value.ref.title + '"';
                    break;
                case 'move':
                    actionVerb = 'moved';
                    actionObj = change.value.kind + ' "' + change.value.ref.title + '"';
                    break;
                default:
                    actionVerb = 'updated';
                    actionObj = 'the deck';
            }

            return (
            <Feed.Event key={index}>
                <Feed.Label>
                    <Icon name='pencil'/>
                </Feed.Label>
                <Feed.Content>
                    <Feed.Date>{moment(change.timestamp).calendar(null, {sameElse: 'lll'})}</Feed.Date>
                    <Feed.Summary>
                        <NavLink className="user" href={'/user/' + change.username}> {change.username}</NavLink> {actionVerb + ' ' + actionObj}
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
