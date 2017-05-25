import React from 'react';
import revertRevision from '../../../../actions/history/revertRevision';
import showRevisionChanges from '../../../../actions/history/showRevisionChanges';
import hideRevisionChanges from '../../../../actions/history/hideRevisionChanges';
import {Accordion, Button, Icon, Header, Segment} from 'semantic-ui-react';
import DeckRevisionChanges from './DeckRevisionChanges';
import moment from 'moment';

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
        window.open('/deck/' + this.props.selector.sid.split('-')[0] + '-' + this.props.revision.id , '_blank');
    }


    handleRevertClick() {
        this.context.executeAction(revertRevision, {
            selector: this.props.selector, revisionId: this.props.revision.id
        });
    }

    render() {
        const revision = this.props.revision;
        const canEdit = this.props.userid !== '' && this.props.permissions.edit && !this.props.permissions.readOnly;

        return (
        <div>
            <Accordion.Title active={revision.expanded}>
                <Icon color='grey' name='save' size='large' className='outline'
                      aria-label='Saved at'/>
                <span>{moment(revision.lastUpdate).calendar(null, {sameElse: 'lll'})} by <a
                className="user"
                href={'/user/' + revision.username}> {revision.username}</a>
                            </span>
                <Button basic floated='right' size='tiny' aria-label='expand details'
                        icon='ellipsis horizontal'
                        onClick={this.handleExpandClick.bind(this)}/>
            </Accordion.Title>
            <Accordion.Content active={revision.expanded}>
                <Segment clearing>
                    <Header size='small'>Summary of changes
                        {revision.latest ? '' :
                        <Button.Group basic size='tiny' floated='right'>
                            <Button aria-label='Compare to current deck' icon='exchange' disabled/>
                            <Button aria-label='Restore deck' icon='history' disabled={!canEdit}/>
                            <Button aria-label='View deck in new tab' icon onClick={this.handleViewRevisionClick.bind(this)}>
                                <Icon.Group>
                                    <Icon name='unhide'/>
                                    <Icon name='external' corner/>
                                </Icon.Group>
                            </Button>
                        </Button.Group>}
                    </Header>
                    <DeckRevisionChanges changes={this.props.changes}/>
                </Segment>
            </Accordion.Content>
        </div>
        );
    }
}

DeckRevision.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DeckRevision;
