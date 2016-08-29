import React from 'react';
import likeActivity from '../../../actions/activityfeed/likeActivity';
import {formatDate} from './util/ActivityFeedUtil';

class ActivityItem extends React.Component {
    handleLike() {
        this.context.executeAction(likeActivity, {
            id: this.props.activity.id
        });
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
        const viewPath = ((node.content_kind === 'slide') ? '/slideview/' : '/deckview/') + node.content_id;
        switch (node.activity_type) {
            case 'translate':
                IconNode = (<i className="ui big translate icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.user_id}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'translated ' + node.content_kind + ' '}
                        <a href={viewPath}>{node.content_name}</a>{' to '}
                        {/*<a href={'/slideview/' + node.translation_info.content_id}>{node.translation_info.language}</a>*/}
                        <a href={viewPath}>{node.translation_info.language}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'share':
                IconNode = (<i className="ui big slideshare icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.user_id}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'shared ' + node.content_kind + ' '}
                        <a href={viewPath}>{node.content_name}</a>{' on '}
                        <a target="_blank" href={node.share_info.postURI}>{node.share_info.platform}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'add':
                IconNode = (<i className="ui big write icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.user_id}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'created ' + node.content_kind + ' '}
                        <a href={viewPath}>{node.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'edit':
                IconNode = (<i className="ui big edit icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.user_id}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'edited ' + node.content_kind + ' '}
                        <a href={viewPath}>{node.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'comment':
                IconNode = (<i className="ui big comment outline icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.user_id}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'commented on ' + node.content_kind + ' '}
                        <a href={viewPath}>{node.content_name}</a>
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
                        <a className="user" href={'/user/' + node.user_id}>
                            {node.author ? node.author.username : 'unknown'}
                        </a>
                        <span> replied to a comment </span>{'on ' + node.content_kind + ' '}
                        <a href={viewPath}>{node.content_name}</a>
                        <br/>
                        <span style={commentStyles}>{'"' + node.comment_info.text + '"'}</span>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'use':
                IconNode = (<i className="ui big copy icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.user_id}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'used ' + node.content_kind + ' '}
                        <a href={viewPath}>{node.content_name}</a>
                        {' in deck '}<a href={'/deckview/' + node.use_info.target_id}>{node.use_info.target_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'rate'://TODO modify rate display
                IconNode = (<i className="ui big empty star icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.user_id}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'rated ' + node.content_kind + ' '}
                        <a href={viewPath}>{node.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'react'://TODO modify react display
                IconNode = (<i className="ui big thumbs outline up icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.user_id}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'liked ' + node.content_kind + ' '}
                        <a href={viewPath}>{node.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'download':
                IconNode = (<i className="ui big download icon"></i>);
                SummaryNode = (
                    <div className="summary">
                        <a className="user" href={'/user/' + node.user_id}>
                            {node.author ? node.author.username : 'unknown'}
                        </a> {'downloaded ' + node.content_kind + ' '}
                        <a href={viewPath}>{node.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            default:
                IconNode = (<i className="ui big warning icon"></i>);
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

export default ActivityItem;
