import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import ContributorsStore from '../../../../stores/ContributorsStore';
import ContributorsList from './ContributorsList';

class ContributorsPanel extends React.Component {
    componentDidMount() {
        this.enableAccordion();
    }
    componentDidUpdate(){
        this.refreshAccordion();
    }
    enableAccordion(status) {
        let accordionDIV = this.refs.contributorsPanel;
        $(accordionDIV).find('.ui.accordion').accordion({
            exclusive: false
        });
    }
    refreshAccordion(status) {
        let accordionDIV = this.refs.contributorsPanel;
        $(accordionDIV).find('.ui.accordion').accordion('refresh');
    }

    render() {
        return (
            <div className="sw-contributors-panel" ref="contributorsPanel">
                <div className="ui">
                    <div className="ui styled accordion">
	                    <div className="title" style={{color: '#4183C4'}}>
	                      <i className="dropdown icon"></i>
	                      Creator
	                    </div>
	                    <div className="content">
	                    	<ContributorsList items={this.props.ContributorsStore.creator  }></ContributorsList>
	                    </div>
	                    <div className="title" style={{color: '#4183C4'}}>
	                      <i className="dropdown icon"></i>
	                      Contributors
	                    </div>
	                    <div className="content">
	                    	<ContributorsList items={this.props.ContributorsStore.contributors}></ContributorsList>
	                    </div>
	                    <div className="title" style={{color: '#4183C4'}}>
	                      <i className="dropdown icon"></i>
	                      Translators
	                    </div>
	                    <div className="content">
	                    	<ContributorsList items={this.props.ContributorsStore.translators}></ContributorsList>
	                    </div>
                    </div>
                </div>

             </div>
        );
    }
}

ContributorsPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ContributorsPanel = connectToStores(ContributorsPanel, [ContributorsStore], (context, props) => {
    return {
        ContributorsStore: context.getStore(ContributorsStore).getState()
    };
});

export default ContributorsPanel;
