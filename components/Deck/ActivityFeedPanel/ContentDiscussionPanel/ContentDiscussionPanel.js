import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentDiscussionStore from '../../../../stores/ContentDiscussionStore';
import Comment from './Comment';

class ContentDiscussionPanel extends React.Component {
    render() {
        let oldWay = (
            <div ref="contentDiscussionPanel" className="ui segment">
                Discussion related to {this.props.ContentDiscussionStore.selector.stype} #{this.props.ContentDiscussionStore.selector.sid}.
                <br/>
                <NavLink href={'/discussion/' + this.props.ContentDiscussionStore.selector.stype + '/' + this.props.ContentDiscussionStore.selector.sid}>{'/discussion/' + this.props.ContentDiscussionStore.selector.stype + '/' + this.props.ContentDiscussionStore.selector.sid}</NavLink>
            </div>
        );
        return (
            <div className="ui comments" style={{maxWidth: 'none'}}>
                <form className="ui reply form">
                    <div className="field">
                        <textarea style={{minHeight: '6em', height: '6em'}}></textarea>
                    </div>
                    <div className="ui blue labeled submit icon button">
                        <i className="icon edit"></i> Add Comment
                    </div>
                </form>
                <h3 className="ui dividing header">Comments</h3>
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {this.props.ContentDiscussionStore.discussion.map((comment, index) => { return (<Comment key={index} comment={comment} />); })}
                </div>
            </div>
        );
    }
}

ContentDiscussionPanel = connectToStores(ContentDiscussionPanel, [ContentDiscussionStore], (context, props) => {
    return {
        ContentDiscussionStore: context.getStore(ContentDiscussionStore).getState()
    };
});
export default ContentDiscussionPanel;
