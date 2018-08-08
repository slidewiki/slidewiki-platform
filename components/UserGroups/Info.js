import PropTypes from 'prop-types';
import React from 'react';
import UserPicture from '../common/UserPicture';

class Info extends React.Component {

    render() {
        let content1 = <UserPicture picture={ this.props.group.picture } link={ false } private={ false } width={ 150 } centered={ false } size={ 'small' } aria-hidden={ 'true' } />;
        let content2 = <div><h2>{ this.props.group.name }</h2>
            <div className="ui item">
                <div className="item">
                    <div className="content">
                        <div className="header">
                            Creator: <a href={'/user/' + this.props.group.creator.username} target="_blank">{this.props.group.creator.displayName || this.props.group.creator.username}</a>
                            <br />
                            Members: {this.props.group.members.length + 1}
                        </div>
                    </div>
                </div>
            </div>
        </div>;

        return (
            <div className="ui two column grid">
                <div className="ui sixteen wide column computer tablet only">
                    {content1}
                    {content2}
                </div>
                <div className="ui column mobile only">
                    {content1}
                </div>
                <div className="ui column mobile only">
                    {content2}
                </div>
                <div className="ui sixteen wide column">
                    <div className = "ui divider" />
                </div>
            </div>
        );
    }
}

Info.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

export default Info;
