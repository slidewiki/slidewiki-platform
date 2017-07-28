import React from 'react';
import {creatorAttribute} from './util/ContributorsUtil';
import {contains} from './util/ContributorsUtil';
import UserPicture from '../../../common/UserPicture';

class ContributorItem extends React.Component {
    render() {
        return (
            <a className="item" href={'/user/' + this.props.data.id}>
                    <div className="ui image">
                        <UserPicture picture={ this.props.data.picture }
                            username={ this.props.data.username } link={ false }
                            private={ false } size={ 'mini' } width= { 24 } bordered={ false } alt={'""'}/>
                    </div>
                    <div className="content">
                        <div className="description">
                            {this.props.data.username}
                        </div>

                        <div className="extra">{this.props.data.organization}</div>
                    </div>
                </a>

        );
    }
}

export default ContributorItem;
