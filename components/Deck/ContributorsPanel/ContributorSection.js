import React from 'react';
import ContributorsStore from '../../../stores/ContributorsStore';
import expandContributors from '../../../actions/expandContributors';
// import loadContributors from '../../../actions/loadContributors';

class ContributorSection extends React.Component {
    handleExpand() {
        this.context.executeAction(expandContributors, {listName: this.props.listName, test: 'test'});
    }

    render() {
        return (
          	<div className="ui segment">

            	<div className="contributorSublist">
                	<a className="listName" onClick={this.handleExpand.bind(this)} > {this.props.listName} </a>
            	</div>
            	{this.props.children}
            </div>

        );
    }
}


ContributorSection.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default ContributorSection;
