import React from 'react';
import {creatorAttribute} from './util/ContributorsUtil';
import {contains} from './util/ContributorsUtil';
import UserPicture from '../../../common/UserPicture';

class ContributorItem extends React.Component {
    render() {
        return (
        <div className="item">
            <div className="image">
                <UserPicture picture={ this.props.data.picture }
                             username={ this.props.data.username } link={ false }
                             private={ false } width={ 30 } size={ 'mini' }/>
            </div>
            <div className="content inline-div">
                <div className="header">
                    <a href={'/user/' + this.props.data.id}>{this.props.data.username}</a>
                </div>
                <div className="description">{this.props.data.organization}</div>
            </div>
        </div>
        );
    }
}

export default ContributorItem;
