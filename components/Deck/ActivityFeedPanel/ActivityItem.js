import React from 'react';
import likeActivity from '../../../actions/likeActivity';

class ActivityItem extends React.Component {
    handleLike() {
        console.log("Liked the following activity:");
        console.log(this.props.activity);
        this.context.executeAction(likeActivity, {
            id: this.props.activity.id
        });
    }
    render() {
        let node = this.props.activity;
        var Addendum;
        let isTranslation = node.type === 'translate' && node.translation;
        let isSharing = node.type === 'share' && node.shareInfo;
        if (isTranslation) {
            Addendum = (
                <span> to <a href={'/slideview/' + node.translation.contentID}>{node.translation.language}</a></span>
            );
        } else if (isSharing) {
            Addendum = (
                <span> on <a target="_blank" href={node.shareInfo.postURI}>{node.shareInfo.platform}</a></span>
            );
        }
        let hasAddendum = isTranslation || isSharing;
        let verb = node.type.endsWith('e') ? node.type+'d' : node.type+'ed';
        return (
            <div className="ui feed">
                <div className="event">
                    <div className="label">
                        <i className="ui user icon"></i>
                    </div>
                    <div className="content">
                        <div className="summary">
                            <a className="user" href={'/user/' + node.userID}>
                                {node.username}
                            </a> {verb + ' ' + node.contentType + ' '}
                            <a href={'/slideview/' + node.contentID}>#{node.contentID}</a>
                            { hasAddendum? Addendum : '' }.
                            <div className="date">
                                {node.date}
                            </div>
                        </div>
                        <div className="meta">
                            <a className="like" onClick={this.handleLike.bind(this)}>
                                <i className="like icon"></i> {node.likesNo} Likes
                            </a>
                        </div>
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
