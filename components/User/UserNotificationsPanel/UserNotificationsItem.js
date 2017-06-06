import React from 'react';
import {formatDate} from '../../Deck/ActivityFeedPanel/util/ActivityFeedUtil';
import classNames from 'classnames/bind';
import readUserNotification from '../../../actions/user/notifications/readUserNotification';

class UserNotificationsItem extends React.Component {
    handleClick(notification) {
        if (notification.newNotificationId !== undefined && notification.newNotificationId !== '') {
            this.context.executeAction(readUserNotification, {
                newNotificationId: notification.newNotificationId
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
        let allIconClass = classNames({
            'ui icon': true,
            'big': this.props.iconSize === 'big'
        });

        if (notification.user_id === '0' || notification.user_id === 'undefined') {
            notification.user_id = undefined;
        }

        let viewPath = ((notification.content_kind === 'slide') ? '/slideview/' : '/deck/') + notification.content_id;
        if (notification.content_kind === 'group')
            viewPath = '/user/'+notification.user_id+'/profile/groups'; //TODO the username is neede here instead of the userid
        switch (notification.activity_type) {
            case 'translate':
                const translateIconClass = allIconClass.concat(' translate');
                iconNotification = (<i className={translateIconClass}></i>);
                summaryNotification = (
                    <div className="summary">
                    <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                        {notification.author ? notification.author.username : 'unknown'}
                        </a> {'translated ' + notification.content_kind + ' '}
                        <a href={viewPath}>{notification.content_name}</a>{' to '}
                        {/*<a href={'/slideview/' + notification.translation_info.content_id}>{notification.translation_info.language}</a>*/}
                        <a href={viewPath}>{notification.translation_info.language}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'share':
                const shareIconClass = allIconClass.concat(' slideshare');
                const onPlatform = (notification.share_info.platform === 'E-mail') ? 'by E-mail' : (' on ' + notification.share_info.platform);
                iconNotification = (<i className={shareIconClass}></i>);
                summaryNotification = (
                    <div className="summary">
                    <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                        {notification.author ? notification.author.username : 'unknown'}
                        </a> {'shared ' + notification.content_kind + ' '}
                        <a href={viewPath}>{notification.content_name}</a> {onPlatform}
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'add':
                const addIconClass = allIconClass.concat(' write');
                iconNotification = (<i className={addIconClass}></i>);
                summaryNotification = (
                    <div className="summary" >
                    <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                        {notification.author ? notification.author.username : 'unknown'}
                        </a> {'created ' + notification.content_kind + ' '}
                        <a href={viewPath}>{notification.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'edit':
                const editIconClass = allIconClass.concat(' edit');
                iconNotification = (<i className={editIconClass}></i>);
                summaryNotification = (
                    <div className="summary">
                    <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                        {notification.author ? notification.author.username : 'unknown'}
                        </a> {'edited ' + notification.content_kind + ' '}
                        <a href={viewPath}>{notification.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'comment':
                const commentIconClass = allIconClass.concat(' comment outline');
                iconNotification = (<i className={commentIconClass}></i>);
                summaryNotification = (
                    <div className="summary">
                    <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                        {notification.author ? notification.author.username : 'unknown'}
                        </a> {'commented on ' + notification.content_kind + ' '}
                        <a href={viewPath}>{notification.content_name}</a>
                        <br/>
                        <span style={commentStyles}>{'"' + notification.comment_info.text + '"'}</span>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'reply':
                const replyIconClass = allIconClass.concat(' comments outline');
                iconNotification = (<i className={replyIconClass}></i>);
                summaryNotification = (
                    <div className="summary">
                    <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                        {notification.author ? notification.author.username : 'unknown'}
                        </a>
                        <span> replied to a comment </span>{'on ' + notification.content_kind + ' '}
                        <a href={viewPath}>{notification.content_name}</a>
                        <br/>
                        <span style={commentStyles}>{'"' + notification.comment_info.text + '"'}</span>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'use':
                const useIconClass = allIconClass.concat(' copy');
                iconNotification = (<i className={useIconClass}></i>);
                summaryNotification = (
                    <div className="summary">
                    <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                        {notification.author ? notification.author.username : 'unknown'}
                        </a> {'used ' + notification.content_kind + ' '}
                        <a href={viewPath}>{notification.content_name}</a>
                        {/*{' in deck '}<a href={'/slideview/' + notification.use_info.target_id}>{notification.use_info.target_name}</a>*/}
                        {' in deck '}<a href={'/deckview/' + notification.use_info.target_id}>{notification.use_info.target_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'rate'://TODO modify rate display
                const rateIconClass = allIconClass.concat(' empty star');
                iconNotification = (<i className={rateIconClass}></i>);
                summaryNotification = (
                    <div className="summary">
                    <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                        {notification.author ? notification.author.username : 'unknown'}
                        </a> {'rated ' + notification.content_kind + ' '}
                        <a href={viewPath}>{notification.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'react'://TODO modify react display
                const reactIconClass = allIconClass.concat(' thumbs outline up');
                iconNotification = (<i className={reactIconClass}></i>);
                summaryNotification = (
                    <div className="summary">
                    <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                        {notification.author ? notification.author.username : 'unknown'}
                        </a> {'liked ' + notification.content_kind + ' '}
                        <a href={viewPath}>{notification.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'download':
                const downloadIconClass = allIconClass.concat(' download');
                iconNotification = (<i className={downloadIconClass}></i>);
                summaryNotification = (
                    <div className="summary">
                    <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                        {notification.author ? notification.author.username : 'unknown'}
                        </a> {'downloaded ' + notification.content_kind + ' '}
                        <a href={viewPath}>{notification.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'fork':
                const forkIconClass = allIconClass.concat(' fork');
                iconNotification = (<i className={forkIconClass}></i>);
                summaryNotification = (
                    <div className="summary">
                    <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                        {notification.author ? notification.author.username : 'unknown'}
                        </a> {'forked ' + notification.content_kind + ' '}
                        <a href={viewPath}>{notification.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'joined':
                const joinedIconClass = allIconClass.concat(' add user');
                iconNotification = (<i className={joinedIconClass}></i>);
                summaryNotification = (
                    <div className="summary">
                    <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                        {notification.author ? notification.author.username : 'unknown'}
                        </a> {'Changes in ' + notification.content_kind + ' '}
                        <a href={viewPath}>{notification.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            case 'left':
                const leftIconClass = allIconClass.concat(' remove user');
                iconNotification = (<i className={leftIconClass}></i>);
                summaryNotification = (
                    <div className="summary">
                    <a className="user" href={notification.user_id ? '/user/' + notification.user_id : ''}>
                        {notification.author ? notification.author.username : 'unknown'}
                        </a> {'Changes in ' + notification.content_kind + ' '}
                        <a href={viewPath}>{notification.content_name}</a>
                        <br/>
                        {DateDiv}
                    </div>
                );
                break;
            default:
                const warningIconClass = allIconClass.concat(' warning');
                iconNotification = (<i className={warningIconClass}></i>);
                summaryNotification = (
                    <div className="summary">
                        Unknown type of activity - {notification.activity_type}
                    </div>
                );
        }

        let itemClass = classNames({
            'event': true,
            'ui raised segment': (notification.newNotificationId !== undefined && notification.newNotificationId !== '')
        });
        return (
            <div className="ui feed">
                <div className={itemClass} onClick={this.handleClick.bind(this, notification)}>
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
