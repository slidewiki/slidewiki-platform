import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import ContributorsStore from '../../../../stores/ContributorsStore';
import ContributorsList from './ContributorsList';
import { FormattedMessage, defineMessages } from 'react-intl';
import SingleItemAccordion from '../../../common/SingleItemAccordion';

class ContributorsPanel extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        const form_messages = defineMessages({
            no_contributors: {
                id: 'ContributorsPanel.form.no_contributors',
                defaultMessage: 'There are no contributors for this',
            }
        });

        return (
            <div className="sw-contributors-panel" ref="contributorsPanel">
                <div className="ui">
                    <h4 className="ui header">
                        <FormattedMessage
                            id='ContributorsPanel.form.header'
                            defaultMessage='Creator' />
                    </h4>
                    <ContributorsList items={this.props.ContributorsStore.creator}/>
                    <SingleItemAccordion
                        buttonContent={<FormattedMessage id='ContributorsPanel.form.title' defaultMessage='Contributors' />}
                        revealContent={this.props.ContributorsStore.contributors.length === 0 ?
                                `${this.context.intl.formatMessage(form_messages.no_contributors) + ' ' + this.props.ContributorsStore.selector.stype}.` :
                                <ContributorsList items={this.props.ContributorsStore.contributors}/>}
                    />
                </div>
            </div>
        );
    }
}

ContributorsPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};
ContributorsPanel = connectToStores(ContributorsPanel, [ContributorsStore], (context, props) => {
    return {
        ContributorsStore: context.getStore(ContributorsStore).getState()
    };
});

export default ContributorsPanel;
