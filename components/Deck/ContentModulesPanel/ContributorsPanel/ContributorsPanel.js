import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import ContributorsStore from '../../../../stores/ContributorsStore';
import ContributorsList from './ContributorsList';
import { FormattedMessage, defineMessages } from 'react-intl';
import {Accordion, AccordionItem, AccordionItemBody, AccordionItemTitle} from 'react-accessible-accordion';
import {Icon} from 'semantic-ui-react';

class ContributorsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {advanced_options_visible: false};
    };

    /**
     * Toggles the state of advanced_options_visible.
     * Triggered by clicks on <AccordionItemTitle> elements.
     *
     * @returns {void}
     */
    handleAccordionChange = () => {
        const { advanced_options_visible } = this.state;
        this.setState({ advanced_options_visible: !advanced_options_visible });
    };

    render() {
        const form_messages = defineMessages({
            no_contributors: {
                id: 'ContributorsPanel.form.no_contributors',
                defaultMessage: 'There are no contributors for this',
            }
        });

        const { advanced_options_visible } = this.state;

        return (
            <div className="sw-contributors-panel" ref="contributorsPanel">
                <div className="ui">
                    <h4 className="ui header">
                        <FormattedMessage
                            id='ContributorsPanel.form.header'
                            defaultMessage='Creator' />
                    </h4>
                    <ContributorsList items={this.props.ContributorsStore.creator}/>
                    <Accordion onChange={this.handleAccordionChange} accordion={false}>
                        <AccordionItem>
                            <AccordionItemTitle>
                                <Icon name={advanced_options_visible ? 'down caret' : 'right caret'}/>
                                <FormattedMessage
                                    id='ContributorsPanel.form.title'
                                    defaultMessage='Contributors' />
                            </AccordionItemTitle>
                            <AccordionItemBody hideBodyClassName='hidden'>
                                {this.props.ContributorsStore.contributors.length === 0 ?
                                    `${this.context.intl.formatMessage(form_messages.no_contributors) + ' ' + this.props.ContributorsStore.selector.stype}.` :
                                    <ContributorsList items={this.props.ContributorsStore.contributors}/>}
                            </AccordionItemBody>
                        </AccordionItem>
                    </Accordion>
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
