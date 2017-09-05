import React from 'react';
import likeActivity from '../../../actions/activityfeed/likeActivity';
import {formatDate} from './util/ActivityFeedUtil';
import {navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import cheerio from 'cheerio';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import TreeUtil from '../TreePanel/util/TreeUtil';

class ActivityItem extends React.Component {
    handleLike() {
        this.context.executeAction(likeActivity, {
            id: this.props.activity.id
        });
    }

    //return the position of the node in the deck
    getPath(node){
        const flatTree = this.props.DeckTreeStore.flatTree;
        let path = '';
        for (let i=0; i < flatTree.size; i++) {
            if (flatTree.get(i).get('type') === node.content_kind && flatTree.get(i).get('id') === node.content_id) {
                path = flatTree.get(i).get('path');
                let nodeSelector = {id: this.props.selector.id, stype: node.content_kind, sid: node.content_id, spath: path};
                let nodeURL = TreeUtil.makeNodeURL(nodeSelector, 'deck', 'view');

                return nodeURL;
            }
        }
        return path;
    }

    handleRefClick(e) {
        e.preventDefault();

        this.context.executeAction(navigateAction, {
            url: this.getPath(this.props.activity)
        });
        // return false;
    }

    render() {
        const node = this.props.activity;

        let IconNode = '';
        let SummaryNode = '';
        const DateDiv = (
            <div className="date">
                {formatDate(node.timestamp)}
            </div>
        );
        const commentStyles = {
            fontStyle: 'italic',
            fontWeight: 400
        };
        const cheerioContentName = (node.content_name) ? cheerio.load(node.content_name).text() : '';
        const viewPath = ((node.content_kind === 'slide') ? '/deck/' + this.props.selector.id + '/slide/' : '/deck/') + node.content_id;
        const nodeRef = (node.content_kind === this.props.selector.stype && node.content_id.split('-')[0] === this.props.selector.sid.split('-')[0]) ? (<span> {'this ' + node.content_kind} </span>) :  (<span>{node.content_kind + ' '}<a href={this.getPath(node)} onClick={this.handleRefClick.bind(this)}>{cheerioContentName}</a></span>);

        if (node.user_id === '0') {
            node.user_id = undefined;
        }
        switch (node.activity_type) {
            case 'translate':
                IconNode = (<i className="ui large translate icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'translated '} {nodeRef} {' to '}
                        {/*<a href={'/slideview/' + node.translation_info.content_id}>{node.translation_info.language}</a>*/}
                        <a href={viewPath}>{node.translation_info.language}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'share':
                IconNode = (<i className="ui large share alternate icon"></i>);
                const onPlatform = (node.share_info.platform === 'E-mail') ? 'by E-mail' : (' on ' + node.share_info.platform);
                SummaryNode = (
                    <div className="description">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'shared '} {nodeRef} {onPlatform}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'add':
                IconNode = (<i className="ui large write icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'created '} {nodeRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'edit':
                IconNode = (<i className="ui large edit icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'edited '} {nodeRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'comment':
                IconNode = (<i className="ui large comment outline icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'commented on '} {nodeRef}
                        <br/>
                        <span style={commentStyles}>{'"' + node.comment_info.text + '"'}</span>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'reply':
                IconNode = (<i className="ui big comments outline icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''}>
                            {node.author ? node.author.username : 'unknown'}
                        </a>
                        <span> replied to a comment </span>{'on ' } {nodeRef}
                        <br/>
                        <span style={commentStyles}>{'"' + node.comment_info.text + '"'}</span>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'use':
                IconNode = (<i className="ui large attach icon"></i>);
                const title = (node.use_info.target_name !== '') ? node.use_info.target_name : node.use_info.target_id;
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'used '} {nodeRef}
                        {' in deck '}<a href={'/deck/' + node.use_info.target_id}>{title}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'rate'://TODO modify rate display
                IconNode = (<i className="ui large empty star icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'rated '} {nodeRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'react'://TODO modify react display
                IconNode = (<i className="ui large thumbs outline up icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'liked '} {nodeRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'download':
                IconNode = (<i className="ui large download icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'downloaded '} {nodeRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'fork':
                IconNode = (<i className="ui large fork icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'forked '} {nodeRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'delete':
                IconNode = (<i className="ui large remove circle outline icon"></i>);
                const cheerioDeletedName = (node.delete_info.content_name) ? cheerio.load(node.delete_info.content_name).text() : '';

                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> <span>{'deleted ' + node.delete_info.content_kind + ' "' + cheerioDeletedName + '" '}</span>
                        <br/>
                        <span>{'from '} {nodeRef}</span>
                        <br/>
                        {DateDiv}
                    </div>
                );

                break;
            default:
                IconNode = (<i className="ui large warning icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        Unknown type of activity - {node.activity_type}
                    </div>
                );
        }
        // TODO: Unused (no likes for activities), therefore MetaNode should be removed probably, otherwise it should go below the SummaryNode
        const MetaNode = (
            <div className="meta">
                <a className="like" onClick={this.handleLike.bind(this)}>
                    <i className="like icon"></i> {node.likesNo} Likes
                </a>
            </div>
        );

        return (
            <div className="ui feed">
                <div className="event">
                    <div className="activity-icon">
                        {IconNode}
                    </div>
                    <div className="content" style={{marginLeft: '1em'}}>
                        {SummaryNode}
                    </div>
                </div>
            </div>
        );
    }
}

ActivityItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ActivityItem = connectToStores(ActivityItem, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default ActivityItem;
