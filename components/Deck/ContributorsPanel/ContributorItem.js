import React from 'react';
import {creatorAttribute} from './util/ContributorsUtil';
import {avatarPath} from './util/ContributorsUtil';
import {contains} from './util/ContributorsUtil';

class ContributorItem extends React.Component {
    render() {
        return (
        	<div className="item">
        		<a className="avatar inline-div padding15">
        			{(this.props.data.username !== '') ? <img src={avatarPath(this.props.data.avatar)}   height={30} width={30}></img> : <i className="ui icon user" />}
        	    </a>

        	    <div className="content inline-div">
        	        <div className="header">
        	          <a  href={'/user/' + this.props.data.id}>{this.props.data.username}</a>
        	        </div>
        	        <div className="description">{this.props.data.organization}</div>
        	    </div>
        	</div>
        );
    }
}

export default ContributorItem;
