import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import DataSourceStore from '../../../../stores/DataSourceStore';
import PermissionsStore from '../../../../stores/PermissionsStore';
/*import DataSourceList from './DataSourceList';
import EditDataSource from './EditDataSource';
import newDataSource from '../../../../actions/datasource/newDataSource';
import showMoreDataSources from '../../../../actions/datasource/showMoreDataSources';*/
import { FormattedMessage, defineMessages } from 'react-intl';
import { Header, Accordion, Icon, Label } from 'semantic-ui-react';
import CheckDescriptiveNames from './CheckDescriptiveNames';
import CheckHierarchicalDesign from './CheckHierarchicalDesign';
import CheckMultipleLanguages from './CheckMultipleLanguages';
import CheckQuestions from './CheckQuestions';
import CheckQuestionDistractors from './CheckQuestionDistractors';
import CheckMetadataQuality from './CheckMetadataQuality';
import CheckMetadataAdherenceQuality from './CheckMetadataAdherenceQuality';

class QualityPanel extends React.Component {
    state = { activeIndex: -1 };

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    };

    render() {
        const { activeIndex } = this.state;

        return (
            <div className='ui bottom attached' ref='qualityPanel'>
                <Header as='h3' dividing>
                    Quality Issues
                </Header>

                <Header as='h4'>Content structure</Header>
                <Accordion fluid styled>
                    <CheckDescriptiveNames activeIndex={this.state.activeIndex} handleClick={this.handleClick} index='0' />
                    <CheckHierarchicalDesign activeIndex={this.state.activeIndex} handleClick={this.handleClick} index='1' />
                    <CheckMetadataQuality activeIndex={this.state.activeIndex} handleClick={this.handleClick} index='2' />
                    <CheckMetadataAdherenceQuality activeIndex={this.state.activeIndex} handleClick={this.handleClick} index='3' />
                </Accordion>

                <Header as='h4'>Learning content</Header>
                <Accordion fluid styled>
                    <CheckMultipleLanguages activeIndex={this.state.activeIndex} handleClick={this.handleClick} index='4' />
                </Accordion>

                <Header as='h4'>Self assessment</Header>
                <Accordion fluid styled>
                    <CheckQuestions activeIndex={this.state.activeIndex} handleClick={this.handleClick} index='5' />
                    <CheckQuestionDistractors activeIndex={this.state.activeIndex} handleClick={this.handleClick} index='6' />
                </Accordion>
            </div>
        );
    }
}

QualityPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
};

QualityPanel = connectToStores(QualityPanel, [DataSourceStore, PermissionsStore], (context, props) => {
    return {
        DataSourceStore: context.getStore(DataSourceStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState(),
    };
});

export default QualityPanel;
