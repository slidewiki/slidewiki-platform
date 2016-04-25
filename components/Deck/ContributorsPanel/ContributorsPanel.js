import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import ContributorsStore from '../../../stores/ContributorsStore';
import ContributorsList from './ContributorsList';
import ContributorSection from './ContributorSection';


import Accordion from './Accordion';

class ContributorsPanel extends React.Component {
//var ContributorsPanel = React.createClass({

    render() {
        return (
            <div className="sw-contributors-panel" ref="contributorsPanel">
                <div className="ui segments">
                    <div className="ui secondary segment">
                        <a href="/contributors/deck/57">Contributors</a>
                    </div>


                    <ContributorSection listName="Creator"><ContributorsList items={this.props.ContributorsStore.creator  }></ContributorsList></ContributorSection>


                    <ContributorSection listName="Contributors"><ContributorsList items={this.props.ContributorsStore.contributors}></ContributorsList></ContributorSection>
                    <ContributorSection listName="Translators"><ContributorsList items={this.props.ContributorsStore.translators}></ContributorsList></ContributorSection>
                </div>

             </div>
        );
    }

//});
}



ContributorsPanel = connectToStores(ContributorsPanel, [ContributorsStore], (context, props) => {
    return {
        ContributorsStore: context.getStore(ContributorsStore).getState()
    };
});



export default ContributorsPanel;
