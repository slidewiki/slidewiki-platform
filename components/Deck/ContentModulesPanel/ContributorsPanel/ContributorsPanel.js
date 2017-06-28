import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import ContributorsStore from '../../../../stores/ContributorsStore';
import ContributorsList from './ContributorsList';

class ContributorsPanel extends React.Component {
    componentDidMount() {
        this.enableAccordion();
    }

    componentDidUpdate() {
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
                    <h5 className="ui small header" tabIndex="0">
                        Creator
                    </h5>
                    <ContributorsList items={this.props.ContributorsStore.creator  }></ContributorsList>
                    <div className="ui accordion">
                        <div className="title" tabIndex="0">
                            <i className="dropdown icon"></i>
                            Contributors
                        </div>
                        <div className="content">
                            {this.props.ContributorsStore.contributors.length === 0 ?
                                <div>There are no contributors for this {this.props.ContributorsStore.selector.stype}.</div> :
                                <ContributorsList items={this.props.ContributorsStore.contributors}></ContributorsList>}
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
