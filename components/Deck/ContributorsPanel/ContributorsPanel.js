import React from 'react';
import ContributorsStore from '../../../stores/ContributorsStore';
import {connectToStores} from 'fluxible-addons-react';

import ContributorsList from './ContributorsList';

class ContributorsPanel extends React.Component {
    render() {
        return (
            <div className="sw-contributors-panel" ref="contributorsPanel">

                <div className="ui segments">
                    <div className="ui secondary segment">
                        <a href="/contributors/deck/57">Contributors</a>
                    </div>
                    <div className="ui segment">
                        <ContributorsList items={this.props.ContributorsStore.contributors} />
                    </div>
                </div>

             </div>
        );
    }
}
ContributorsPanel = connectToStores(ContributorsPanel, [ContributorsStore], function (context, props) {
    return {
        ContributorsStore: context.getStore(ContributorsStore).getState()
    };
});
export default ContributorsPanel;
