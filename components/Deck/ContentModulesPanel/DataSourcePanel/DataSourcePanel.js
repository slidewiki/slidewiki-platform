import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DataSourceStore from '../../../../stores/DataSourceStore';
import PermissionsStore from '../../../../stores/PermissionsStore';
import DataSourceList from './DataSourceList';
import EditDataSource from './EditDataSource';
import newDataSource from '../../../../actions/datasource/newDataSource';
import showMoreDataSources from '../../../../actions/datasource/showMoreDataSources';
import { FormattedMessage, defineMessages } from 'react-intl';

class DataSourcePanel extends React.Component {
    handleNewDataSource() {
        this.context.executeAction(newDataSource);
    }

    handleShowMore(e) {
        e.preventDefault();
        this.context.executeAction(showMoreDataSources);
    }

    render() {
        const dataSources = this.props.DataSourceStore.dataSources;
        const arrayOfDataSourcesIsLarge = dataSources.length > 10;
        const showAllDataSources = this.props.DataSourceStore.showAllDataSources;
        const displayDataSources = (arrayOfDataSourcesIsLarge && !showAllDataSources) ? dataSources.slice(0, 9) : dataSources;
        const dataSource = this.props.DataSourceStore.dataSource;
        const selector = this.props.DataSourceStore.selector;

        let editPermission = (this.props.PermissionsStore.permissions.admin || this.props.PermissionsStore.permissions.edit);
        let newDataSourceButton = (editPermission) ?
            <button tabIndex="0" onClick={this.handleNewDataSource.bind(this)} className="ui blue labeled icon button">
                <i className="icon plus"></i>
                <FormattedMessage
                    id='DataSourcePanel.form.button_add'
                    defaultMessage='Add source' />
            </button>
            : '';

        let sourcesHeader = (
            <h3 className="ui dividing header">
                <FormattedMessage
                    id='DataSourcePanel.form.header'
                    defaultMessage='Sources' />
            </h3>
        );

        let showMoreLink = (!showAllDataSources && arrayOfDataSourcesIsLarge) ? <div><br/><a href="#" onClick={this.handleShowMore.bind(this)} >
            <FormattedMessage
                id='DataSourcePanel.form.show_more'
                defaultMessage='Show more ...' /></a></div> : '';
        const form_messages = defineMessages({
            no_sources: {
                id: 'DataSourcePanel.form.no_sources',
                defaultMessage: 'There are currently no sources for this',
            }
        });
        let sourcesList = (dataSources.length === 0) ?
            <div>{this.context.intl.formatMessage(form_messages.no_sources) + ' ' + this.props.DataSourceStore.selector.stype}.</div>
            :
            <div>
                <DataSourceList items={displayDataSources} editable ={editPermission} selector={selector}/>
                {showMoreLink}
            </div>
            ;

        let editForm = <EditDataSource dataSource={dataSource}/>;

        return (
            <div className="ui bottom attached" ref="dataSourcePanel" role="tabpanel">
                {(dataSource === undefined) ?
                    newDataSourceButton : ''}
                {(dataSource === undefined) ?
                    sourcesHeader : ''}
                {(dataSource === undefined) ?
                    sourcesList : editForm}
            </div>
        );
    }
}

DataSourcePanel.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

DataSourcePanel = connectToStores(DataSourcePanel, [DataSourceStore, PermissionsStore], (context, props) => {
    return {
        DataSourceStore: context.getStore(DataSourceStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});

export default DataSourcePanel;
