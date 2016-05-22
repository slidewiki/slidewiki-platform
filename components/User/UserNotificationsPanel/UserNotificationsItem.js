import React from 'react';
import {formatDate} from '../../Deck/ActivityFeedPanel/util/ActivityFeedUtil';
import classNames from 'classnames/bind';
import readUserNotification from '../../../actions/user/readUserNotification';

class UserNotificationsItem extends React.Component {
    handleClick(notification) {
      if (notification.new !== undefined && notification.new === true)
          this.context.executeAction(readUserNotification, {
              id: notification.id
          });
    }
    render() {
        const notification = this.props.notification;

        let iconNotification = '';
        let summaryNotification = '';
        const DateDiv = (
            <div className="date">
                {formatDate(notification.timestamp)}
            </div>
        );
        const commentStyles = {
            fontStyle: 'italic',
            fontWeight: 400
        };

        switch (notification.activity_type) {
            case 'translate':
                iconNotification = (<i className="ui big translate icon"></i>);
                summaryNotification = (
                    <div className="summary" onClick={this.handleClick.bind(this, notification)}>
                        <a className="user" href={'/user/' + notification.user_id}>
                            {notification.author.username}
                        </a> {'translated ' + notification.content_kind + ' '}
                        <a href={'/slideview/' + notification.content_id}>{notification.content_name}</a>{' to '}
                        <a href={'/slideview/' + notification.translation_info.content_id}>{notification.translation_info.language}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'share':
                iconNotification = (<i className="ui big slideshare icon"></i>);
                summaryNotification = (
                    <div className="summary" onClick={this.handleClick.bind(this, notification)}>
                        <a className="user" href={'/user/' + notification.user_id}>
                            {notification.author.username}
                        </a> {'shared ' + notification.content_kind + ' '}
                        <a href={'/slideview/' + notification.content_id}>{notification.content_name}</a>{' on '}
                        <a target="_blank" href={notification.share_info.postURI}>{notification.share_info.platform}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'add':
                iconNotification = (<i className="ui big write icon"></i>);
                summaryNotification = (
                    <div className="summary" onClick={this.handleClick.bind(this, notification)}>
                        <a className="user" href={'/user/' + notification.user_id}>
                            {notification.author.username}
                        </a> {'created ' + notification.content_kind + ' '}
                        <a href={'/slideview/' + notification.content_id}>{notification.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'edit':
                iconNotification = (<i className="ui big edit icon"></i>);
                summaryNotification = (
                    <div className="summary" onClick={this.handleClick.bind(this, notification)}>
                        <a className="user" href={'/user/' + notification.user_id}>
                            {notification.author.username}
                        </a> {'edited ' + notification.content_kind + ' '}
                        <a href={'/slideview/' + notification.content_id}>{notification.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'comment':
                iconNotification = (<i className="ui big comment outline icon"></i>);
                summaryNotification = (
                    <div className="summary" onClick={this.handleClick.bind(this, notification)}>
                        <a className="user" href={'/user/' + notification.user_id}>
                            {notification.author.username}
                        </a> {'commented on ' + notification.content_kind + ' '}
                        <a href={'/slideview/' + notification.content_id}>{notification.content_name}</a>
                        <br/>
                        <span style={commentStyles}>{'"' + notification.comment_info.text + '"'}</span>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'reply':
                iconNotification = (<i className="ui big comments outline icon"></i>);
                summaryNotification = (
                    <div className="summary" onClick={this.handleClick.bind(this, notification)}>
                        <a className="user" href={'/user/' + notification.user_id}>
                            {notification.author.username}
                        </a>
                        <span> replied to a comment </span>{'on ' + notification.content_kind + ' '}
                        <a href={'/slideview/' + notification.content_id}>{notification.content_name}</a>
                        <br/>
                        <span style={commentStyles}>{'"' + notification.comment_info.text + '"'}</span>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'use':
                iconNotification = (<i className="ui big copy icon"></i>);
                summaryNotification = (
                    <div className="summary" onClick={this.handleClick.bind(this, notification)}>
                        <a className="user" href={'/user/' + notification.user_id}>
                            {notification.author.username}
                        </a> {'used ' + notification.content_kind + ' '}
                        <a href={'/slideview/' + notification.content_id}>{notification.content_name}</a>
                        {' in deck '}<a href={'/slideview/' + notification.use_info.target_id}>{notification.use_info.target_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'rate'://TODO modify rate display
                iconNotification = (<i className="ui big empty star icon"></i>);
                summaryNotification = (
                    <div className="summary" onClick={this.handleClick.bind(this, notification)}>
                        <a className="user" href={'/user/' + notification.user_id}>
                            {notification.author.username}
                        </a> {'rated ' + notification.content_kind + ' '}
                        <a href={'/slideview/' + notification.content_id}>{notification.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'react'://TODO modify react display
                iconNotification = (<i className="ui big thumbs outline up icon"></i>);
                summaryNotification = (
                    <div className="summary" onClick={this.handleClick.bind(this, notification)}>
                        <a className="user" href={'/user/' + notification.user_id}>
                            {notification.author.username}
                        </a> {'liked ' + notification.content_kind + ' '}
                        <a href={'/slideview/' + notification.content_id}>{notification.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'download':
                iconNotification = (<i className="ui big download icon"></i>);
                summaryNotification = (
                    <div className="summary" onClick={this.handleClick.bind(this, notification)}>
                        <a className="user" href={'/user/' + notification.user_id}>
                            {notification.author.username}
                        </a> {'downloaded ' + notification.content_kind + ' '}
                        <a href={'/slideview/' + notification.content_id}>{notification.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            default:
                iconNotification = (<i className="ui big warning icon"></i>);
                summaryNotification = (
                    <div className="summary" onClick={this.handleClick.bind(this, notification)}>
                        Unknown type of activity - {notification.activity_type}
                    </div>
                );
        }

        let itemClass = classNames({
            'event': true,
            'ui  segment': (notification.new !== undefined && notification.new === true)
        });
        return (
            <div className="ui feed">
                <div className={itemClass}>
                    <div className="activity-icon">
                        {iconNotification}
                    </div>
                    <div className="content" style={{marginLeft: '1em'}}>
                        {summaryNotification}
                    </div>
                </div>
            </div>
        );
    }
}
UserNotificationsItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserNotificationsItem;
