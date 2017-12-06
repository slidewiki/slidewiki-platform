import React from 'react';
import {formatDate} from '../../Deck/ActivityFeedPanel/util/ActivityFeedUtil';
import {List, Icon, Button} from 'semantic-ui-react';
import classNames from 'classnames/bind';
import cheerio from 'cheerio';
import readUserNotification from '../../../actions/user/notifications/readUserNotification';
import deleteUserNotification from '../../../actions/user/notifications/deleteUserNotification';

class UserNotificationsItem extends React.Component {
    handleMarkAsRead(notification) {
        if (notification.id !== undefined && notification.id !== '') {
            this.context.executeAction(readUserNotification, {
                id: notification.id
            });
        }
    }
    handleDelete(notification) {
        if (notification.id !== undefined && notification.id !== '') {
            this.context.executeAction(deleteUserNotification, {
                id: notification.id
            });
        }
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

        if (notification.user_id === '0' || notification.user_id === 'undefined') {
            notification.user_id = undefined;
        }

        let viewPath = ((notification.content_kind === 'slide') ? '/slideview/' : '/deck/') + notification.content_id;
        const cheerioContentName = (notification.content_name !== undefined) ? cheerio.load(notification.content_name).text() : '';
        if (notification.content_kind === 'group')
            viewPath = '/user/' + this.props.username + '/groups/overview';
        switch (notification.activity_type) {
            case 'translate':
                iconNotification = 'translate';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'translated ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a>{' to '}
                        {/*<a href={'/slideview/' + notification.translation_info.content_id}>{notification.translation_info.language}</a>*/}
                        <a href={viewPath}>{notification.translation_info.language}</a>
                    </div>
                );
                break;
            case 'share':
                const onPlatform = (notification.share_info.platform === 'E-mail') ? 'by E-mail' : (' on ' + notification.share_info.platform);
                iconNotification = 'share alternate';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'shared ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a> {onPlatform}
                    </div>
                );
                break;
            case 'add':
                iconNotification = 'write';
                summaryNotification = (
                    <div className="summary" >
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'created ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a>
                    </div>
                );
                break;
            case 'edit':
                iconNotification = 'edit';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'edited ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a>
                    </div>
                );
                break;
            case 'move':
                iconNotification = 'move';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'moved ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a>
                    </div>
                );
                break;
            case 'comment':
                iconNotification = 'comment outline';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'commented on ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a>
                        <br/>
                        <span style={commentStyles}>{'"' + notification.comment_info.text + '"'}</span>
                    </div>
                );
                break;
            case 'reply':
                iconNotification = 'comments massive outline';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a>
                        <span> replied to a comment </span>{'on ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a>
                        <br/>
                        <span style={commentStyles}>{'"' + notification.comment_info.text + '"'}</span>
                    </div>
                );
                break;
            case 'use':
                const title = (notification.use_info.target_name !== '') ? notification.use_info.target_name : notification.use_info.target_id;
                iconNotification = 'repeat';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'used ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a>
                        {' in deck '}<a href={'/deck/' + notification.use_info.target_id}>{title}</a>
                    </div>
                );
                break;
            case 'attach':
                iconNotification = 'attach';
                summaryNotification = (
                    <div className="summary" >
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'attached ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a>
                    </div>
                );
                break;
            case 'rate'://TODO modify rate display
                iconNotification = 'empty star';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'rated ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a>
                    </div>
                );
                break;
            case 'react'://TODO modify react display
                iconNotification = 'thumbs outline up';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'liked ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a>
                    </div>
                );
                break;
            case 'download':
                iconNotification = 'download';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'downloaded ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a>
                    </div>
                );
                break;
            case 'fork':
                iconNotification = 'fork';
                const forkRef = (notification.fork_info) ? (<span>, creating a <a href={'/deck/' + notification.fork_info.content_id}>new deck</a></span>) : '';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'forked ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a>
                        {forkRef}
                    </div>
                );
                break;
            case 'delete':
                iconNotification = 'remove circle outline';
                const cheerioDeletedName = (notification.delete_info.content_name) ? cheerio.load(notification.delete_info.content_name).text() : '';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'deleted ' + notification.delete_info.content_kind + ' "' + cheerioDeletedName + '" '}
                        {'from ' + notification.content_kind + ' '}
                        <a href={viewPath}>{cheerioContentName}</a>
                    </div>
                );

                break;
            case 'joined':
                iconNotification = 'add user';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'made changes in ' + notification.content_kind + ': '}
                        <a href={viewPath}>{cheerioContentName}</a>
                    </div>
                );
                break;
            case 'left':
                iconNotification = 'remove user';
                summaryNotification = (
                    <div className="summary">
                        <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                            {notification.author ? notification.author.username : 'unknown'}
                        </a> {'made changes in ' + notification.content_kind + ': '}
                        <a href={viewPath}>{cheerioContentName}</a>
                    </div>
                );
                break;
            default:
                iconNotification = 'warning';
                summaryNotification = (
                    <div className="summary">
                        Unknown type of activity - {notification.activity_type}
                    </div>
                );
        }

        let markAsReadButton = (notification.new) ? (<Button aria-label='Mark as read' icon='checkmark' onClick={this.handleMarkAsRead.bind(this, notification)}/>) : '';
        let buttons = (
            <Button.Group basic size='tiny' floated='right'>
                {markAsReadButton}
                <Button aria-label='Delete' icon='remove' onClick={this.handleDelete.bind(this, notification)} tabIndex='0'/>
            </Button.Group>);
        let itemClass = classNames({
            'event': true,
            'ui raised segment': notification.new
        });
        return (
            <List.Item className={itemClass} >
                <Icon name={iconNotification} size='big' />
                <List.Content style={{width:'100%'}} tabIndex='0'>
                    <List.Header>
                        {summaryNotification} {buttons}
                    </List.Header>
                    <List.Description>
                        {DateDiv}
                    </List.Description>
                </List.Content>
            </List.Item>
        );
    }
}
UserNotificationsItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserNotificationsItem;
