import React from 'react';
import revertRevision from '../../../../actions/history/revertRevision';
import showRevisionChanges from '../../../../actions/history/showRevisionChanges';
import hideRevisionChanges from '../../../../actions/history/hideRevisionChanges';
import {Accordion, Button, Icon, Header, Segment} from 'semantic-ui-react';
import DeckRevisionChanges from './DeckRevisionChanges';
import moment from 'moment';

class ContentHistoryItem extends React.Component {

    handleExpandClick() {
        if (this.props.revision.expanded) {
            this.context.executeAction(hideRevisionChanges, {
                revisionId: this.props.revision.id
            });
        } else {
            this.context.executeAction(showRevisionChanges, {
                deckId: this.props.selector.id.split('-')[0],
                revisionId: this.props.revision.id
            });
        }
    }


    handleRevertClick() {
        this.context.executeAction(revertRevision, {
            selector: this.props.selector, revisionId: this.props.revision.id
        });
    }

    /*<div className="item">
     <div className="content">
     <div className="header">
     <span>{moment(revision.lastUpdate).calendar(null, {sameElse: 'lll'})} by <a className="user"
     href={'/user/' + revision.user}> {revision.username}</a>
     </span>
     {revision.active ? <i className='check circle icon green'></i> : revertIcon}
     </div>
     <div className="description"></div>
     </div>
     </div>*/

    render() {
        const revision = this.props.revision;
        const revertIcon = (this.props.userid !== '' && this.props.permissions.edit && !this.props.permissions.readOnly) ? (
        <a className="like" onClick={this.handleRevertClick.bind(this)}>
            <i className="undo icon"/>
        </a>
        ) : '';
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
                            <Button aria-label='Restore deck' icon='history'/>
                            <Button aria-label='View deck in new tab' icon>
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

ContentHistoryItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ContentHistoryItem;
