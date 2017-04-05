import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DataSourceStore from '../../../../stores/DataSourceStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import DataSourceList from './DataSourceList';
import EditDataSource from './EditDataSource';
import ShadowScrollbars from './Scrollbars/ShadowScrollbars';
import newDataSource from '../../../../actions/datasource/newDataSource';
import showMoreDataSources from '../../../../actions/datasource/showMoreDataSources';

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
        const userId = this.props.UserProfileStore.userid;
        const contentOwnerId = this.props.DataSourceStore.contentOwner;
        const editable = (String(userId) === String(contentOwnerId)) && (selector.stype === 'slide');

        let newDataSourceButton = (editable) ?
            <button tabIndex="0" onClick={this.handleNewDataSource.bind(this)} className="ui blue labeled icon button">
                <i className="icon plus"></i> Add source
            </button>
            : '';

        let sourcesHeader = <h3 className="ui dividing header">Sources</h3>;

        let showMoreLink = (!showAllDataSources && arrayOfDataSourcesIsLarge) ? <div><br/><a href="#" onClick={this.handleShowMore.bind(this)} >Show more ...</a></div> : '';
        let sourcesList = (dataSources.length === 0)
            ?
            <div>There are currently no sources for this {this.props.DataSourceStore.selector.stype}.</div>
            :
            <div>
                <DataSourceList items={displayDataSources} editable ={editable} selector={selector}/>
                {showMoreLink}
            </div>
            ;

        let editForm = <EditDataSource dataSource={dataSource}/>;

        return (
            <div className="ui bottom attached" ref="dataSourcePanel">
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
    executeAction: React.PropTypes.func.isRequired
};

DataSourcePanel = connectToStores(DataSourcePanel, [DataSourceStore, UserProfileStore], (context, props) => {
    return {
        DataSourceStore: context.getStore(DataSourceStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default DataSourcePanel;
