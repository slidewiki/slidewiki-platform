import React from 'react';
import ContributorsList from './ContributorsList';


class ContributorsPanel extends React.Component {
    render() {
        return (
            <div className="sw-contributors-panel" ref="contributorsPanel">

                <div className="ui segments">
                    <div className="ui secondary segment">
                        Contributors
                    </div>
                    <div className="ui segment">
                        <ContributorsList />
                    </div>
                </div>

             </div>
        );
    }
}

export default ContributorsPanel;
