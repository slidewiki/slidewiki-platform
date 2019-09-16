import PropTypes from 'prop-types';
import React from 'react';
import likeActivity from '../../../actions/activityfeed/likeActivity';
import {formatDate} from './util/ActivityFeedUtil';
import {navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import cheerio from 'cheerio';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import Util from '../../common/Util';
import {getLanguageName} from '../../../common';
import {FormattedMessage, defineMessages} from 'react-intl';

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
                let nodeURL = Util.makeNodeURL(nodeSelector, 'deck', 'view', undefined, undefined, true);

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

        let contentType = node.content_kind;

        if (contentType === 'deck') {
            contentType = <FormattedMessage id='activity.feed.item.deck' defaultMessage='deck'/>;
        } else if (contentType === 'slide') {
            contentType = <FormattedMessage id='activity.feed.item.slide' defaultMessage='slide'/>;
        } 

        const nodeRef = (node.content_kind === this.props.selector.stype && node.content_id.split('-')[0] === this.props.selector.sid.split('-')[0]) ? (<span><FormattedMessage id='activity.feed.item.this' defaultMessage='this'/> {contentType}</span>) : (<span>{contentType} <a href={this.getPath(node)} onClick={this.handleRefClick.bind(this)}>{cheerioContentName}</a></span>);

        if (node.user_id === '0'|| node.user_id === 'undefined') {
            node.user_id = undefined;
        }
        switch (node.activity_type) {
            case 'translate':
                IconNode = (<i className="ui translate icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ? node.author.displayName || node.author.username : 'unknown'}
                        </a> <FormattedMessage id='activity.feed.item.translated' defaultMessage='translated'/> {nodeRef} <FormattedMessage id='activity.feed.item.to' defaultMessage='to'/>
                        {/*<a href={'/slideview/' + node.translation_info.content_id}>{node.translation_info.language}</a>*/}
                        {getLanguageName(node.translation_info.language)}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'share':
                IconNode = (<i className="ui share alternate icon"></i>);
                const onPlatform = (node.share_info.platform === 'E-mail') ? 'by E-mail' : (' on ' + node.share_info.platform);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ? node.author.displayName || node.author.username : 'unknown'}
                        </a> <FormattedMessage id='activity.feed.item.shared' defaultMessage='shared'/> {nodeRef} {onPlatform}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'add':
                IconNode = (<i className="ui pencil alternate icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ? node.author.displayName || node.author.username : 'unknown'}
                        </a> <FormattedMessage id='activity.feed.item.created' defaultMessage='created'/> {nodeRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'edit':
                IconNode = (<i className="ui edit icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ? node.author.displayName || node.author.username : 'unknown'}
                        </a> <FormattedMessage id='activity.feed.item.edited' defaultMessage='edited'/> {nodeRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'move':
                IconNode = (<i className="ui arrows alternate icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ? node.author.displayName || node.author.username : 'unknown'}
                        </a> <FormattedMessage id='activity.feed.item.moved' defaultMessage='moved'/> {nodeRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'comment':
                IconNode = (<i className="ui comment outline icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ? node.author.displayName || node.author.username : 'unknown'}
                        </a> <FormattedMessage id='activity.feed.item.commented' defaultMessage='commented on'/> {nodeRef}
                        <br/>
                        <span style={commentStyles}>{'"' + node.comment_info.text + '"'}</span>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'reply':
                IconNode = (<i className="ui comment outline icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ? node.author.displayName || node.author.username : 'unknown'}
                        </a>
                        <span> <FormattedMessage id='activity.feed.item.reply' defaultMessage='replied to a comment on'/>  </span> {nodeRef}
                        <br/>
                        <span style={commentStyles}>{'"' + node.comment_info.text + '"'}</span>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'use':
                IconNode = (<i className="ui clone outline icon"></i>);
                const title = (node.use_info.target_name !== '') ? node.use_info.target_name : node.use_info.target_id;
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ? node.author.displayName || node.author.username : 'unknown'}
                        </a> <FormattedMessage id='activity.feed.item.used' defaultMessage='used'/> {nodeRef}
                        <FormattedMessage id='activity.feed.item.indeck' defaultMessage='in deck'/> <a href={'/deck/' + node.use_info.target_id}>{title}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'attach':
                IconNode = (<i className="ui attach icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ? node.author.displayName || node.author.username : 'unknown'}
                        </a> <FormattedMessage id='activity.feed.item.attached' defaultMessage='attached'/> {nodeRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'rate'://TODO modify rate display
                IconNode = (<i className="ui star outline icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ? node.author.displayName || node.author.username : 'unknown'}
                        </a> <FormattedMessage id='activity.feed.item.rated' defaultMessage='rated'/> {nodeRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'react'://TODO modify react display
                IconNode = (<i className="ui thumbs outline up icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ?node.author.displayName ||  node.author.username : 'unknown'}
                        </a> <FormattedMessage id='activity.feed.item.liked' defaultMessage='liked'/> {nodeRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'download':
                IconNode = (<i className="ui download icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ? node.author.displayName || node.author.username : 'unknown'}
                        </a> <FormattedMessage id='activity.feed.item.downloaded' defaultMessage='downloaded'/> {nodeRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'fork':
                IconNode = (<i className="ui fork icon"></i>);
                const forkRef = (node.fork_info) ? (<span>, creating a <a href={'/deck/' + node.fork_info.content_id}>new deck</a></span>) : '';
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ? node.author.displayName || node.author.username : 'unknown'}
                        </a> <FormattedMessage id='activity.feed.item.forked' defaultMessage='forked'/> {nodeRef}{forkRef}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'delete':
                IconNode = (<i className="ui trash alternate icon"></i>);
                const cheerioDeletedName = (node.delete_info.content_name) ? cheerio.load(node.delete_info.content_name).text() : '';

                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={node.user_id ? '/user/' + node.user_id : ''} target="_blank">
                            {node.author ? node.author.displayName || node.author.username : 'unknown'}
                        </a> <span> <FormattedMessage id='activity.feed.item.deleted' defaultMessage='deleted'/> {node.delete_info.content_kind + ' "' + cheerioDeletedName + '" '}</span>
                        <br/>
                        <span><FormattedMessage id='activity.feed.item.from' defaultMessage='from'/> {nodeRef}</span>
                        <br/>
                        {DateDiv}
                    </div>
                );

                break;
            default:

        }

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
    executeAction: PropTypes.func.isRequired
};
ActivityItem = connectToStores(ActivityItem, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default ActivityItem;
